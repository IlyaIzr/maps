import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import mapboxgl from 'mapbox-gl';
import { MapArea } from '../Map/Map'
import { Rater } from '../Rater'
import { Featurer } from '../Featurer';
import { formatGeodata } from './formatGeodata'
// TODO make separate styles
import '../Map/Maps.css'
import { Legend } from '../Legend';
import { Reviews } from '../Reviews';
import { getLayoutCoords, notNaN } from '~rest/helperFuncs';
import { setMapMode } from '~store/app';
import { TEXT } from '~rest/lang';
import { postTagsIfAny } from '~requests/tags';
import { postReview } from '~requests/reviews';
import { ReactComponent as CloseIcon } from '~rest/svg/close5.svg';
import s from './MapWrap.module.css'
import { handleError, handleNewLevel } from '~rest/helperFuncs';
import { LAYOUT_ZOOM, RATED_LAYER_SRC } from '../const';
import { setAppGeodata } from '../../store/map';

export const MapWrap = () => {
  // Store
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const geoData = useSelector(state => state.map.geodata)
  const dispatch = useDispatch()
  
  // Todo that needs context or smth
  // const { geodata, currentFeature } = useSelector(state => state.map)
  const [feature, setFeature] = useState(null);
  // const [geoData, setGeoData] = useState(null)
  // Featurer
  const [name, setName] = useState('')
  // Map
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
      id: feature.id || feature.properties.id,
      name: feature.properties.name || "",
      polyString,
      iso_3166_2: feature.properties.iso_3166_2 || null
    }
    const { x, y } = getLayoutCoords(lng, lat, LAYOUT_ZOOM)
    place.x = x
    place.y = y

    // Go out from mapMode
    setMapMode(dispatch, null)

    let newGeodata = [...geoData]


    // Case next review
    if (feature.source === RATED_LAYER_SRC) {
      const res = await postReview({
        userId: user.id, review, place: { id: feature.id, ...feature.properties, polyString },
        userLevel: user.level, commentsNumber: user.commentsn
      })
      handleError(dispatch, res, '#ppr1')
      handleNewLevel(res, user.commentsn, dispatch)

      // Add Mutate geoData (without mutating properties{})
      // Todo move this logic to the BE
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

      handleError(dispatch, res, '#ppr2')
      handleNewLevel(res, user.commentsn, dispatch)

      newGeodata.push({
        type: 'Feature',
        // TODO no id nor iso here
        properties: { rating, name, amount: 1, ...place },
        id: feature.id,
        // geometry: {...feature.geometry}
        geometry: feature.geometry
      })

    }

    // Common block

    const tagReq = await postTagsIfAny({
      user: user.id, comment, featureId: feature.id || feature.properties.id,
      iso_3166_2: feature.properties.iso_3166_2, lng, lat
    })
    handleError(dispatch, tagReq, '#ptg_Main_3')

    setAppGeodata(dispatch, newGeodata)
    updateLayers()

    // end
    // Todo: as far as creating polygon a beta feature it's better just reload the app
    if (feature.source === 'createdPoly') location.reload()

    // finally restore init features
    resetRater()
  }

  return (
    <div className={s.mainWrapper}>
      <MapArea
        feature={feature} setFeature={setFeature}
        resetRater={resetRater}
        featureTrigger={featureTrigger}
        key={mapTrigger}
      />
      {
        app.legendShown && <Legend />
      }
      {feature &&
        <div className="featureContainer mp-bg-light mp-border-secondary">
          <Featurer feature={feature} name={name} setName={setName} />
          <Rater feature={feature} onSubmit={onSubmit} />
          <Reviews feature={feature} updateLayers={updateLayers} resetRater={resetRater} />
          <div className="closeFeature mp-bg-light mp-dark mp-border-secondary" onClick={resetRater} title={TEXT.close}>

            <CloseIcon fill="var(--dark)" className="close-legend" />
          </div>
        </div>
      }
    </div>
  )
}
