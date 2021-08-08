import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getReviews } from '../requests/map';
import { TEXT } from '../rest/lang';
import { expandComments, setToast, shrinkComments } from '../store/app';

export const Reviews = ({ feature }) => {
  const dispatch = useDispatch()
  const { reviewsShown } = useSelector(state => state.app)

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


  if (feature?.source !== 'ratedFeaturesSource') return (null)
  return (
    <div className={`reviewsContainer ${reviewsShown ? 'expanded' : 'shrinked'}`}>
      {reviews.length ? reviews.map(review => {
        if (!review.name) review.name = TEXT.anonimus
        return (
          <div className="reviewWrap mp-border-secondary mp-shadow-light" key={review.author + review.timestamp}>
            <div className="authorLogo mp-bg-counter">
              <span className="mp-primary" title={review.login}>{String(review.name)?.[0]?.toUpperCase()}</span>
            </div>
            <div className="reviewBody">
              <p className="author">{review.name}</p>
              <div className="reviewDate mp-secondary">{new Date(review.timestamp).toLocaleDateString()}</div>
              {Boolean(review.comment) && <div className="reviewComment mp-bg-primary">{review.comment}</div>}
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
