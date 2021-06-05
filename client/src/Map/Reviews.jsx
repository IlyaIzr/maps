import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getReviews } from '../requests/map';
import { TEXT } from '../rest/lang';
import { expandComments, shrinkComments } from '../store/app';

export const Reviews = ({ feature }) => {
  const dispatch = useDispatch()
  const { reviewsShown } = useSelector(state => state.app)

  const [reviews, setReviews] = useState([])

  useEffect(() => {
    (async function () {
      const res = await getReviews(feature.id)
      if (res.status !== 'OK') return console.log('error with res', res);
      setReviews(res.data)
    })()
    // Cleanup. Do we need it?
    return () => {
      setReviews([])
    }
  }, [])

  function onClick() {
    reviewsShown ? shrinkComments(dispatch) : expandComments(dispatch)
  }

  
  if (feature?.source !== 'ratedFeaturesSource') return (null)
  return (
    <div className={`reviewsContainer ${reviewsShown ? 'expanded' : 'shrinked'}`}>
      {reviews.length ? reviews.map(review => {
        return (
          <div className="reviewWrap" key={review.author + review.grade + Math.random()}>
            <div className="authorLogo">
              <span title={review.author}>{String(review.author)[0].toUpperCase()}</span>
            </div>
            <div className="reviewBody">
              <p className="author">{review.author}</p>
              <div className="reviewDate">{new Date(review.timestamp).toLocaleDateString()}</div>
              {Boolean(review.comment) && <div className="reviewComment">{review.comment}</div>}
              <div className="reviewRating">{review.grade}/5
              <span className="reviewStars stars">
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <span key={index}
                        className={index <= (review.grade) ? "star-on starButton" : "star-off starButton"}
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
        <div className="skipper" onClick={onClick}>
          {reviewsShown ? 
            <span>&#8613;</span> :
            <span>&#8615;</span>
          }
        </div>
      </div>
    </div>
  )
}
