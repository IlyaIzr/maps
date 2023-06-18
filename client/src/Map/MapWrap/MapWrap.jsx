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
import { LAYOUT_ZOOM } from '../const';
import { setCurrentFeature, upsertFeatureToAppGeodata } from '../../store/map';
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
  const dispatch = useDispatch()

  function resetRater() {
    setCurrentFeature(dispatch, null)
  }

  async function onSubmit(rating, comment) {
    // Calculations
    const [northEastest, southWestest, polyString] = formatGeodata(feature.geometry)
    const tempBox = new mapboxgl.LngLatBounds(northEastest, southWestest)
    const { lng, lat } = tempBox.getCenter()
    const { x, y } = getLayoutCoords(lng, lat, LAYOUT_ZOOM)
    // id from props has higher priority. However on first review id only exists at feature.id 
    const placeId = feature.properties.id || feature.id


    // Data to store
    const review = {
      comment,
      grade: notNaN(rating),
      targetId: placeId,
    }
    const place = {
      ...feature.properties,
      lng, lat,
      id: placeId,
      name: feature.properties.name || "",
      polyString,
      iso_3166_2: feature.properties.iso_3166_2 || null,
      x, y
    }

    // Go out from mapMode - TODO whatever that means...
    setMapMode(dispatch, null)

    // Case both cases
    const res = await postReview({
      userId: user.id, review, place, userLevel: user.level, commentsNumber: user.commentsn
    })
    const wasRepeating = handleRepeatingError(dispatch, res)
    if (wasRepeating) return;
    handleError(dispatch, res, '#ppr1')
    handleNewLevel(res, user.commentsn, dispatch)

    if (res.place) upsertFeatureToAppGeodata(dispatch, { ...feature, properties: { ...res.place } })
    else console.log('%c⧭ weird error 4214', 'color: #514080', res, place);

    const tagReq = await postTagsIfAny({
      user: user.id, comment, featureId: feature.id || feature.properties.id,
      iso_3166_2: feature.properties.iso_3166_2, lng, lat
    })
    handleError(dispatch, tagReq, '#ptg_Main_3')

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
