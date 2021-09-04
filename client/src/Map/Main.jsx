import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import { MapArea } from './Map'
import { Rater } from './Rater'
import { Featurer } from './Featurer';
import { formatGeodata } from './formatGeodata'
import { postInitReview, postNextReview } from '../requests/map';
import './Maps.css'
import { Legend } from './Legend';
import { Reviews } from './Reviews';
import { getLayoutCoords } from '../rest/helperFuncs';
import { friendModeId, setToast, showMain } from '../store/app';
import { TEXT } from '../rest/lang';
import { postTags } from '../requests/tags';


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

    // Go out from watchMode
    friendModeId(dispatch, null)


    // Case next review
    if (feature.source === 'ratedFeaturesSource') {
      const res = await postNextReview({ user: user.id, review, place: { ...feature.properties, id: feature.id } })
      if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #ppr1' })
      const res2 = await postTags({ user: user.id, comment, placeId: feature.id })
      if (res2.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #ptg2' })
      // Mutate geoData
      for (let i = 0; i < geoData.length; i++) {
        if (geoData[i].id === feature.id) {
          const { amount, rating } = feature.properties
          geoData[i].properties = {
            rating: +((amount * rating + review.grade) / (amount + 1)).toFixed(5),  //toFixed - 5 numbers after point
            amount: amount + 1
          }
          break;
        }
      } setGeoData(geoData)
      updateLayers()
      return resetRater()
    }


    // Case first time review
    // console.log(user.id, review, place);
    const res = await postInitReview({ user: user.id, review, place })
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError })

    setGeoData([...geoData, {
      type: 'Feature',
      properties: { rating, name, amount: 1 },
      id: feature.id,
      // geometry: {...feature.geometry}
      geometry: feature.geometry
    }])
    updateLayers()

    if (feature.source === 'createdPoly') setMapTrigger(mapTrigger + 1)
    // Restore init features
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
          <Reviews feature={feature} updateLayers={updateLayers} setGeoData={setGeoData} />
          <div className="closeFeature mp-bg-light mp-dark mp-border-secondary" onClick={resetRater} title={TEXT.close}>&#10005;</div>
        </div>
      }
    </div>
  )
}
