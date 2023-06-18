import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import mapboxgl from 'mapbox-gl';
import { gradients } from '~rest/colors';
import { notNaN } from '~rest/helperFuncs';
import { TEXT } from '~rest/lang';
import { setModal } from '~store/app';
import { Comment } from './Comment';
import { TotalRating } from '~components/TotalRating/TotalRating'
import { formatGeodata } from './MapWrap/formatGeodata';
import { LAYOUT_ZOOM } from './const';
import { getLayoutCoords, handleError, handleNewLevel } from '../rest/helperFuncs';
import { setMapMode } from '../store/app';
import { postReview } from '../requests/reviews';
import { handleRepeatingError } from './handleRepeatingError';
import { upsertFeatureToAppGeodata } from '../store/map';
import { postTagsIfAny } from '../requests/tags';

export const Rater = ({ resetRater }) => {
  const user = useSelector(state => state.user)
  const { theme, isLogged } = useSelector(s => s.app)
  const feature = useSelector(state => state.map.currentFeature)
  const gradient = gradients[theme]
  const dispatch = useDispatch()

  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  function onClick() {
    setRating(hover)
  }
  function onSub() {
    if (Number(rating) === 0) return setModal(dispatch, {
      message: TEXT.rateZeroModal,
      acceptAction: submitAction,
      acceptLabel: TEXT.yes,
      cancelLabel: TEXT.goBack,
    })
    onSubmit()
  }
  function onMouseEnter(e) {
    setHover(Number(e.target.name))
  }
  function onMouseLeave() {
    setHover(rating)
  }

  useEffect(() => {
    setHover(0)
    setRating(0)
    setComment('')
  }, [feature])

  async function onSubmit() {
    setHover(0)
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

  // TODO make stars with rating gradient
  return (
    <div className="rater">
      <div className={`starsAndRating ${feature.properties.rating === undefined ? 'noRating' : ''}`}>

        <div className="stars">
          <h5 className="starRating">{TEXT.yourRating} :</h5> <span className="hoverValue mp-dark">{notNaN(hover)}</span>
          <br />
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                name={index}
                className="starButton"
                onClick={onClick}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
                style={index <= (hover || rating) ? { color: gradient[hover] } : { color: gradient[0] }}
              >
                <span className="star">&#9733;</span>
              </button>
            );
          })}

        </div>

        {
          feature.properties.rating !== undefined &&
          <TotalRating rating={feature.properties.rating} amount={feature.properties.amount} />
        }
      </div>

      <Comment comment={comment} setComment={setComment} />

      <div className="raterBtnContainer">
        <button type="button" onClick={onSub}>{TEXT.send}</button>
        {!isLogged &&
          <div className="subtitle">{TEXT.asAnonimus}</div>
        }
      </div>
    </div>
  );
}
