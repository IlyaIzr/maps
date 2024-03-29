import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { AppLink } from '~components/Link/AppLink'
import { deleteReview, getReviews } from '../requests/reviews';
import { restrictedLetters } from '../rest/config';
import { TEXT } from '../rest/lang';
import { expandComments, setModal, setToast, shrinkComments } from '../store/app';
import { ReactComponent as TopIcon } from '../rest/svg/top.svg'
import { ReactComponent as CloseIcon } from '../rest/svg/close3.svg';
import { upsertFeatureToAppGeodata } from '../store/map';
import { RATED_LAYER_SRC } from './const';
import { handleError } from '../rest/helperFuncs';

export const Reviews = ({ resetRater }) => {
  const dispatch = useDispatch()
  const { currentFeature: feature = {} } = useSelector(state => state.map)
  const { reviewsShown } = useSelector(state => state.app)
  const { id: userId, isRoot } = useSelector(state => state.user)

  const [reviews, setReviews] = useState([])

  useEffect(() => {
    if (!Object.keys(feature)) return;
    (async function () {
      if (feature?.source !== RATED_LAYER_SRC) return setReviews([])

      const res = await getReviews(feature.properties.id || feature.id)
      if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #revEr2' });
      setReviews(res.data)
    })()
    // Cleanup. Do we need it?
    return () => {
      setReviews([])
    }
  }, [feature])

  if (feature?.source !== RATED_LAYER_SRC) return null

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
      id: feature.properties.id,
      iso_3166_2: feature.properties.iso_3166_2 || ''
    }

    setModal(dispatch, {
      message: TEXT.removeComment + '?',
      async acceptAction() {
        const res = await deleteReview(timestamp, place, author, isRoot)
        if (res.status !== 'OK') return handleError(dispatch, res, 'revEr1')

        const updatedFeature = { ...feature, properties: { ...feature.properties, ...res.updatedProps } }
        upsertFeatureToAppGeodata(dispatch, updatedFeature)

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
        res.push(<AppLink to={"/tags/item/" + composingTag.substr(1) + letter}>
          <span className="commentTag cursor-pointer mp-counter">{composingTag + letter}</span>
        </AppLink>)
        composingTag = ""
        plain += letter
      } else if (i === text.length - 1) {
        // last letter is in tag
        res.push(<AppLink to={"/tags/item/" + composingTag.substr(1) + letter}>
          <span className="commentTag cursor-pointer mp-counter">{composingTag + letter}</span>
        </AppLink>)
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
            <AppLink to={"/friends/item/" + review.author}>
              <div className="authorLogo mp-bg-primary">
                <span className="mp-dark" title={review.login}>{String(review.name)?.[0]?.toUpperCase()}</span>
              </div>
            </AppLink>
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
        <div key={'whatever'}>{TEXT.noReviews}</div>
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
