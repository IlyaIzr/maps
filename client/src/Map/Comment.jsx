import React, { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { tagSuggestions } from '../requests/tags';
import { TEXT } from '../rest/lang';
import { setToast } from '../store/app';

export const Comment = ({ comment, setComment }) => {
  const dispatch = useDispatch()

  const ref = useRef(null)
  const [tagSuggestion, setTagSuggestion] = useState(null)
  const [suggestions, setSuggestions] = useState([]);

  function onInput(e) {
    setComment(e.target.value);
    const currCase = e.nativeEvent.data

    if (currCase === '#') setTagSuggestion('')
    if (!currCase || currCase === ' ' || currCase === ',' || currCase === '.' || currCase === '/') setTagSuggestion(null)
    else if (typeof tagSuggestion === 'string') setTagSuggestion(tagSuggestion + currCase)
  }

  function onTagClick(e) {
    const toFill = e.target.attributes.value.value
    const newComm = comment.split('#')
    newComm[newComm.length - 1] = toFill
    setComment(newComm.join('#'))
    setTagSuggestion(null)
    ref.current.focus()
  }

  useEffect(() => {
    // todo add delay to reqs
    // todo max 3 tags
    (async function () {
      if (typeof tagSuggestion !== 'string') return;

      const res = await tagSuggestions(tagSuggestion)
      if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #com1' });
      setSuggestions(res.data)
    })()

    // eslint-disable-next-line 
  }, [tagSuggestion])


  return (
    <div>
      {typeof tagSuggestion === 'string' && <div className="suggContainer mp-border-dark">
        {suggestions.map(sugg => <span
          className="sugg mp-accent mp-dark-hover mp-border-secondary cursor-pointer" key={sugg.tag} value={sugg.tag} onClick={onTagClick}
        >
          <span className="mp-secondary">#</span>{sugg.tag}
        </span>)
        }
      </div>}
      <textarea
        name="comment" cols="25" rows="2"
        value={comment} onInput={onInput}
        className="raterComment mp-border-dark"
        placeholder={TEXT.commentPlacehol}
        ref={ref}
      />
    </div>
  )
}
