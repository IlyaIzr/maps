import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gradients } from '../rest/colors';
import { TEXT } from '../rest/lang';
import { setModal } from '../store/app';

export const Rater = ({ onSubmit }) => {
  const theme = useSelector(s => s.app.theme)
  const gradient = gradients[theme]
  const dispatch = useDispatch()

  const [hover, setHover] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  function onClick() {
    setRating(hover)
  }
  function onInput(e) {
    setComment(e.target.value)
  }
  function onSub() {
    if (Number(rating) === 0) return setModal(dispatch, {
      message: TEXT.rateZeroModal,
      acceptAction: submitAction,
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

  // TODO make stars with rating gradient
  return (
    <div className="rater">

      <div className="stars">
        <h5 className="starRating">{TEXT.rating} :</h5> <span className="hoverValue mp-dark">{hover}</span>
        <br />
        {[...Array(5)].map((star, index) => {
          index += 1;
          return (
            <button
              type="button"
              key={index}
              name={index}
              className={index <= (hover || rating) ? "mp-accent starButton" : "mp-secondary starButton"}
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

      <textarea
        name="comment" cols="25" rows="2"
        value={comment} onInput={onInput}
        className="raterComment"
        placeholder={TEXT.commentPlacehol}
      />

      <div className="raterBtnContainer">
        <button type="button" onClick={onSub}>{TEXT.push}</button>
      </div>
    </div>
  );
}
