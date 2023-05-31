import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gradients } from '~rest/colors';
import { notNaN } from '~rest/helperFuncs';
import { TEXT } from '~rest/lang';
import { setModal } from '~store/app';
import { Comment } from './Comment';
import { TotalRating } from '~components/TotalRating/TotalRating'

export const Rater = ({ feature, onSubmit }) => {
  const { theme, isLogged } = useSelector(s => s.app)
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
    submitAction()
  }
  function submitAction() {
    setHover(0)
    onSubmit(rating, comment)
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
          <div className="subtitle">{TEXT.asAnonius}</div>
        }
      </div>
    </div>
  );
}
