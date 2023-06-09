import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteReview, deleteReviewAsRoot, getReviews } from '../requests/reviews';
import { restrictedLetters } from '../rest/config';
import { notNaN } from '../rest/helperFuncs';
import { TEXT } from '../rest/lang';
import { expandComments, setModal, setToast, shrinkComments } from '../store/app';
import { ReactComponent as TopIcon } from '../rest/svg/top.svg'
import { ReactComponent as CloseIcon } from '../rest/svg/close3.svg';
import { setAppGeodata } from '../store/map';

export const Reviews = ({ feature, resetRater, updateLayers }) => {
  const dispatch = useDispatch()
  const { geodata: geoData, currentFeature } = useSelector(state => state.map)
  const { reviewsShown } = useSelector(state => state.app)
  const { id: userId, isRoot } = useSelector(state => state.user)

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
    const timestamp = e.currentTarget.attributes.timestamp.value
    const author = e.currentTarget.attributes.author.value
    const place = {
      rating: feature.properties.rating,
      amount: feature.properties.amount,
      grade: e.currentTarget.attributes.grade.value,
      id: feature.id,
      iso_3166_2: feature.properties.iso_3166_2 || ''
    }

    setModal(dispatch, {
      message: TEXT.removeComment + '?',
      async acceptAction() {
        const res =
          isRoot ?
            await deleteReviewAsRoot(timestamp, place, author) :
            await deleteReview(timestamp, place)

        if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' revEr1' })

        // TODO review this mutation
        // should be rather fixed by removing updateLayers and other unobvious reactivity triggers
        const newGeodata = (function () {
          for (let i = 0; i < geoData.length; i++) {
            if (geoData[i].id === feature.properties.id) {
              const { amount, rating } = feature.properties
              geoData[i].properties = {
                ...geoData[i].properties,
                rating: notNaN(+((amount * rating - place.grade) / (amount - 1)).toFixed(5)),  //toFixed - 5 numbers after point
                amount: amount - 1
              }
              break;
            }
          }
          return geoData
        })()
        setAppGeodata(d, newGeodata)
        updateLayers()
        resetRater()
        setToast(dispatch, { message: TEXT.successfulUpdate, status: 'complete' })
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

  function isDeletionPossible(author) {
    if (isRoot) return true
    if (author !== 'anonimus' && author === userId) return true
    return false
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
                  {isDeletionPossible(review.author) &&
                    <CloseIcon
                      fill="var(--dark)" className="delete-comment-icon cursor-pointer"
                      onClick={deleteClick}
                      timestamp={review.timestamp}
                      grade={review.grade}
                      author={review.author}
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
