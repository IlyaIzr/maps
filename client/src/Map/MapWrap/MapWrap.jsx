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
import { setAppGeodata, setCurrentFeature } from '../../store/map';
import { handleRepeatingError } from './handleRepeatingError';

// This component has map, actions with it, map features and features with it
// Logic of this component is mostly about posting a review
// This can be moved to a separate file later
export const MapWrap = () => {
  // Store
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  // Todo remove it?
  const feature = useSelector(state => state.map.currentFeature)
  const geoData = useSelector(state => state.map.geodata)
  const dispatch = useDispatch()

  function resetRater() {
    setCurrentFeature(dispatch, null)
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
      targetId: feature.id || feature.properties.id,
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
      const wasRepeating = handleRepeatingError(dispatch, res)
      if (wasRepeating) return;
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
        properties: { rating, amount: 1, ...place },
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

    // end
    // Todo: as far as creating polygon a beta feature it's better just reload the app
    if (feature.source === 'createdPoly') location.reload()

    // finally restore init features
    resetRater()
  }

  return (
    <div className={s.mainWrapper}>
      <MapArea
        resetRater={resetRater}
      />
      {
        app.legendShown && <Legend />
      }
      {feature &&
        <div className="featureContainer mp-bg-light mp-border-secondary">
          <Featurer />
          <Rater feature={feature} onSubmit={onSubmit} />
          <Reviews resetRater={resetRater} />
          <div className="closeFeature mp-bg-light mp-dark mp-border-secondary" onClick={resetRater} title={TEXT.close}>
            <CloseIcon fill="var(--dark)" className="close-legend" />
          </div>
        </div>
      }
    </div>
  )
}
