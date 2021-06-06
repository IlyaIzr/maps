import React from 'react'
import { useState } from 'react';
import { gradient } from '../rest/colors';
import { TEXT } from '../rest/lang';

export const Rater = ({ rating, setRating, comment, setComment, onSubmit }) => {
  const [hover, setHover] = useState(0);

  function onClick(e) {
    setRating(hover)
  }
  function onInput(e) {
    setComment(e.target.value)
  }
  function onSub() {
    setHover(0)
    onSubmit()
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
              style={index <= (hover || rating) ? { color: gradient[hover] } : {}}
            >
              <span className="star">&#9733;</span>
            </button>
          );
        })}

      </div>

      <textarea
        name="comment" cols="31" rows="2"
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
