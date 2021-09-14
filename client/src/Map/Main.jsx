import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { MapArea } from './Map'
import { Rater } from './Rater'
import { Featurer } from './Featurer';
import { formatGeodata } from './formatGeodata'
import './Maps.css'
import { Legend } from './Legend';
import { Reviews } from './Reviews';
import { getLayoutCoords, notNaN } from '../rest/helperFuncs';
import { setMapMode, setToast, showMain } from '../store/app';
import { TEXT } from '../rest/lang';
import { postTags } from '../requests/tags';
import { postReview } from '../requests/reviews';
import { setCommentsNumber, setUserLevel } from '../store/user';


export const Main = () => {
  // Store
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const dispatch = useDispatch()

  const [feature, setFeature] = useState(null);
  // Featurer
  const [name, setName] = useState('')
  // Map
  const [geoData, setGeoData] = useState(null)
  const [featureTrigger, setFeatureTrigger] = useState(0);
  const [mapTrigger, setMapTrigger] = useState(0);
  function updateLayers() {
    setFeatureTrigger(featureTrigger + 1)
  }

  function resetRater() {
    setName('')
    setFeature(null)
  }

  async function onSubmit(rating, comment) {
    // Calculations
    const [northEastest, southWestest, polyString] = formatGeodata(feature.geometry)
    const tempBox = new mapboxgl.LngLatBounds(northEastest, southWestest)
    const { lng, lat } = tempBox.getCenter()


    // Data to store
    const review = {
      comment,
      grade: rating,
      targetId: feature.id,
    }
    const place = {
      lng, lat,
      id: feature.id,
      name: feature.properties.name || "",
      polyString
    }
    const { x, y } = getLayoutCoords(lng, lat, 16)
    place.x = x
    place.y = y

    // Go out from mapMode
    setMapMode(dispatch, null)

    let newGeodata = [...geoData]

    function resLevelHandler(res) {
      if (res.newLevel) {
        setToast(dispatch, { status: 'complete', message: TEXT.nowYourLevel + ' ' + res.newLevel })
        setUserLevel(dispatch, res.newLevel)
      }
      setCommentsNumber(dispatch, user.commentsn + 1)
    }

    // Case next review
    if (feature.source === 'ratedFeaturesSource') {
      const res = await postReview({
        userId: user.id, review, place: { ...feature.properties, id: feature.id, polyString },
        userLevel: user.level, commentsNumber: user.commentsn
      })
      if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #ppr1' })
      resLevelHandler(res)

      // Mutate geoData
      for (let i = 0; i < newGeodata.length; i++) {
        if (newGeodata[i].id === feature.id) {
          const { amount, rating } = feature.properties
          if (newGeodata[i].properties) newGeodata[i].properties = { ...feature.properties }
          else newGeodata[i].properties = {}
          newGeodata[i].properties.rating = notNaN(+((amount * rating + review.grade) / (amount + 1)).toFixed(5))  //toFixed - 5 numbers after point
          newGeodata[i].properties.amount = amount + 1
          break;
        }
      }
    } else {
      // Case first time

      const res = await postReview({
        userId: user.id, review, place, userLevel: user.level, commentsNumber: user.commentsn
      })
      // return;
      if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #ppr2' })
      resLevelHandler(res)

      newGeodata.push({
        type: 'Feature',
        properties: { rating, name, amount: 1 },
        id: feature.id,
        // geometry: {...feature.geometry}
        geometry: feature.geometry
      })

    }

    // Common block

    const tagReq = await postTags({ user: user.id, comment, placeId: feature.id })
    if (tagReq.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #ptg_Main_3' })

    setGeoData(newGeodata)
    updateLayers()

    // end
    if (feature.source === 'createdPoly') setMapTrigger(mapTrigger + 1)

    // finally restore init features
    resetRater()
  }

  useEffect(() => {
    showMain(dispatch)
    // eslint-disable-next-line
  }, [])

  return (
    <div className={app.mapHidden ? "hidden" : "mainWrapper"}>
      <MapArea
        feature={feature} setFeature={setFeature}
        resetRater={resetRater}
        geoData={geoData} setGeoData={setGeoData}
        featureTrigger={featureTrigger}
        key={mapTrigger}
      />
      <Legend />
      {feature &&
        <div className="featureContainer mp-bg-light mp-border-secondary">
          <Featurer feature={feature} name={name} setName={setName} />
          <Rater feature={feature} onSubmit={onSubmit} />
          <Reviews feature={feature} updateLayers={updateLayers} setGeoData={setGeoData} resetRater={resetRater} />
          <div className="closeFeature mp-bg-light mp-dark mp-border-secondary" onClick={resetRater} title={TEXT.close}>&#10005;</div>
        </div>
      }
      
      <div className="bottom"></div>
    </div>
  )
}
