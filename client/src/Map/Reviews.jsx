import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteReview, getReviews } from '../requests/reviews';
import { restrictedLetters } from '../rest/config';
import { notNaN } from '../rest/helperFuncs';
import { TEXT } from '../rest/lang';
import { expandComments, setModal, setToast, shrinkComments } from '../store/app';
import { ReactComponent as TopIcon } from '../rest/svg/top.svg'
import { ReactComponent as CloseIcon } from '../rest/svg/close3.svg';

export const Reviews = ({ feature, resetRater, updateLayers, setGeoData }) => {
  const dispatch = useDispatch()
  const { reviewsShown } = useSelector(state => state.app)
  const userId = useSelector(state => state.user.id)

  const [reviews, setReviews] = useState([])

  useEffect(() => {
    (async function () {
      if (feature?.source !== 'ratedFeaturesSource') return setReviews([])

      const res = await getReviews(feature.id)
      if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #revEr2' });
      setReviews(res.data)
    })()
    // Cleanup. Do we need it?
    return () => {
      setReviews([])
    }
    /* eslint-disable */
  }, [feature?.source, feature?.id])
  /* eslint-enable */

  if (feature?.source !== 'ratedFeaturesSource') return null

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
        if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' revEr1' })

        setGeoData(geoData => {
          // Mutate geoData
          for (let i = 0; i < geoData.length; i++) {
            if (geoData[i].id === feature.id) {
              const { amount, rating } = feature.properties
              geoData[i].properties = {
                ...geoData[i].properties,
                rating: notNaN(+((amount * rating - place.grade) / (amount - 1)).toFixed(5)),  //toFixed - 5 numbers after point
                amount: amount - 1
              }
              break;
            }
          } return geoData
        })
        updateLayers()
        resetRater()
      }
    })
  }



  function parseTags(text = "") {
    if (!text || !text.includes('#')) return text

    let res = []
    let composingTag = ""
    let plain = ""

    for (let i = 0; i < text.length; i++) {
      const letter = text[i]
      if (plain && letter === '#') {
        res.push(<span>{plain}</span>)
        plain = ""
        composingTag = '#'
      }
      else if (plain && i === text.length - 1) res.push(<span>{plain + letter}</span>)
      else if (letter === '#') composingTag = '#'

      else if (!composingTag) plain += letter
      else if (restrictedLetters.includes(letter)) {
        res.push(<Link to={"/tags/item/" + composingTag.substr(1) + letter}>
          <span className="commentTag cursor-pointer mp-counter">{composingTag + letter}</span>
        </Link>)
        composingTag = ""
        plain += letter
      } else if (i === text.length - 1) {
        // last letter is in tag
        res.push(<Link to={"/tags/item/" + composingTag.substr(1) + letter}>
          <span className="commentTag cursor-pointer mp-counter">{composingTag + letter}</span>
        </Link>)
      } else composingTag += letter
    }
    return <div>{res}</div>
  }
  return (
    <div className={`reviewsContainer ${reviewsShown ? 'expanded' : 'shrinked'}`}>
      {reviews.length ? reviews.map(review => {
        if (!review.name) review.name = TEXT.anonimus
        return (
          <div className="reviewWrap mp-border-secondary mp-shadow-light" key={review.author + review.timestamp + Math.random()}>
            <Link to={"/friends/item/" + review.author}>
              <div className="authorLogo mp-bg-primary">
                <span className="mp-dark" title={review.login}>{String(review.name)?.[0]?.toUpperCase()}</span>
              </div>
            </Link>
            <div className="reviewBody">

              <div className="authorDateWrap">
                <span className="author mp-primary">{review.name}</span>
                <span className="reviewDate mp-dark">
                  {new Date(review.timestamp).toLocaleDateString()}
                  {Boolean(review.author !== 'anonimus' && review.author === userId) &&
                    <CloseIcon fill="var(--dark)" className="delete-comment-icon cursor-pointer"
                      onClick={deleteClick} timestamp={review.timestamp} grade={review.grade}
                    />
                  }
                </span>
              </div>

              <div className="reviewRating">{review.grade}/5
                <span className="reviewStars stars">
                  {[...Array(5)].map((star, index) => {
                    index += 1;
                    return (
                      <span key={index + review.timestamp}
                        className={index <= (review.grade) ? "mp-accent starButton" : "mp-secondary starButton"}
                      >&#9733;
                      </span>
                    );
                  })}
                </span>
              </div>
              {Boolean(review.comment) && <div className="reviewComment ">{parseTags(review.comment)}</div>}
            </div>
          </div>
        )
      }) :
        <div key={'whatever'}>{TEXT.noreviews}</div>
      }

      <div className="skipperContainer">
        <div className="skipper mp-bg-light mp-border-secondary" >
          {reviewsShown ?

            <TopIcon fill="var(--secondary)" className="nav-icon" onClick={onClick} />
            :
            <span className="mp-secondary" onClick={onClick}>&#8615;</span>
          }
        </div>
      </div>
    </div>
  )
}
