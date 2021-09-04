import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { gradients } from '../rest/colors';
import { TEXT } from '../rest/lang';
import { setModal } from '../store/app';
import { Comment } from './Comment';

export const Rater = ({ feature, onSubmit }) => {
  const { theme, isLogged } = useSelector(s => s.app)
  const gradient = gradients[theme]
  const dispatch = useDispatch()

  function color() {
    if (!feature?.properties?.rating) return gradients[theme][0]
    for (let i = 0; i < gradients[theme].length; i++) {
      if (feature.properties.rating - 1 < i) return gradients[theme][i]
    }
  }

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
      cancelLabel: TEXT.goBack
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
  function ratingData() {
    return String(Number(feature.properties.rating).toPrecision(3)).split('.')
  }

  // TODO make stars with rating gradient
  return (
    <div className="rater">
      <div className={`starsAndRating ${feature.properties.rating === undefined && 'noRating'}`}>

        <div className="stars">
          <h5 className="starRating">{TEXT.yourRating} :</h5> <span className="hoverValue mp-dark">{hover + 1 ? hover : 0}</span>
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

        {feature.properties.rating !== undefined && <div className="rating">
          <div className="ratingAmount mp-border-primary relative" style={{ borderColor: color() }} title={TEXT.rating}>
            {ratingData()[0]}.<span >{ratingData()[1]}</span>
            <sub className="mp-dark mp-bg-light" style={{ color: color() }} title={TEXT.marks}> ( {feature.properties.amount} ) </sub>
          </div>
        </div>}
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
