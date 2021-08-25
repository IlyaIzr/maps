import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteReview, getReviews } from '../requests/map';
import { TEXT } from '../rest/lang';
import { expandComments, setModal, setToast, shrinkComments } from '../store/app';

export const Reviews = ({ feature, updateLayers, setGeoData }) => {
  const dispatch = useDispatch()
  const { reviewsShown } = useSelector(state => state.app)
  const userId = useSelector(state => state.user.id)

  const [reviews, setReviews] = useState([])

  useEffect(() => {
    (async function () {
      if (feature?.source !== 'ratedFeaturesSource') return (null)

      const res = await getReviews(feature.id)
      if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError });
      setReviews(res.data)
    })()
    // Cleanup. Do we need it?
    return () => {
      setReviews([])
    }
    /* eslint-disable */
  }, [feature?.source, feature?.id])
  /* eslint-enable */

  function onClick() {
    reviewsShown ? shrinkComments(dispatch) : expandComments(dispatch)
  }

  function deleteClick(e) {
    const timestamp = e.target.attributes.timestamp.value
    const place = {
      rating: feature.properties.rating,
      amount: feature.properties.amount,
      grade: e.target.attributes.grade.value,
      id: feature.id
    }

    setModal(dispatch, {
      message: TEXT.removeComment + '?',
      async acceptAction() {
        const res = await deleteReview(timestamp, place)

        if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError });
        setReviews(reviews.filter(rev => rev.timestamp + rev.author !== timestamp + userId))
        feature.properties.rating = (place.amount * place.rating - place.grade) / (place.amount - 1)
        feature.properties.amount -= 1
        setGeoData(geoData => {

          // Mutate geoData
          for (let i = 0; i < geoData.length; i++) {
            if (geoData[i].id === feature.id) {
              const { amount, rating } = feature.properties
              geoData[i].properties = {
                rating: +((amount * rating - place.grade) / (amount - 1)).toFixed(5),  //toFixed - 5 numbers after point
                amount: amount - 1
              }
              break;
            }
          } return geoData
        })
        updateLayers()
      }
    })
  }


  if (feature?.source !== 'ratedFeaturesSource') return (null)
  return (
    <div className={`reviewsContainer ${reviewsShown ? 'expanded' : 'shrinked'}`}>
      {reviews.length ? reviews.map(review => {
        console.log('%c⧭', 'color: #d90000', review);
        if (!review.name) review.name = TEXT.anonimus
        return (
          <div className="reviewWrap mp-border-secondary mp-shadow-light" key={review.author + review.timestamp}>
            <Link to={"/friends/user/" + review.author}>
              <div className="authorLogo mp-bg-primary">
                <span className="mp-dark" title={review.login}>{String(review.name)?.[0]?.toUpperCase()}</span>
              </div>
            </Link>
            <div className="reviewBody">
              <p className="author mp-primary">{review.name}</p>
              <div className="reviewDate mp-secondary">
                {new Date(review.timestamp).toLocaleDateString()}
                {Boolean(review.author !== 'anonimus' && review.author === userId) &&
                  <label
                    onClick={deleteClick} className="deleteComment cursor-pointer" timestamp={review.timestamp} grade={review.grade}
                  > ✕
                  </label>
                }
              </div>
              <div className="reviewRating">{review.grade}/5
                <span className="reviewStars stars">
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <span key={index}
                        className={index <= (review.grade) ? "mp-accent starButton" : "mp-secondary starButton"}
                      >&#9733;
                      </span>
                    );
                  })}
                </span>
              </div>
              {Boolean(review.comment) && <div className="reviewComment ">{review.comment}</div>}
            </div>
          </div>
        )
      }) :
        <div>{TEXT.noreviews}</div>
      }

      <div className="skipperContainer">
        <div className="skipper mp-bg-light mp-border-secondary" onClick={onClick}>
          {reviewsShown ?
            <span className="mp-secondary">&#8613;</span> :
            <span className="mp-secondary">&#8615;</span>
          }
        </div>
      </div>
    </div>
  )
}
