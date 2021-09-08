import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { hideMain, setToast } from '../store/app'
import { TEXT } from '../rest/lang';
import { postFeedback } from '../requests/reviews';

export const About = () => {
  const dispatch = useDispatch()

  const [comment, setComment] = useState('');

  useEffect(() => {
    hideMain(dispatch)
    // eslint-disable-next-line
  }, [])

  function onInput(e) {
    setComment(e.target.value);
  }

  async function onClick() {
    const res = await postFeedback(comment)

    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #aboutus1' })
    else setToast(dispatch, { message: TEXT.sent, status: 'complete' })
    setTimeout(() => {
      setComment('')
    }, 500)
  }

  return (
    <div className="aboutPage relative">
      <p>{TEXT.aboutMain}</p>
      <h5 className="mp-border-dark">{TEXT.aboutFutureTitle}</h5>
      <p>{TEXT.aboutFuture}</p>

      <br />
      <label htmlFor="comment">{TEXT.comment}:</label>
      <textarea
        name="comment" cols="25" rows="2"
        value={comment} onInput={onInput}
        className="raterComment mp-border-dark mp-dark"
        placeholder={TEXT.aboutPlaceholder}
      />
      <button className="button" onClick={onClick}>{TEXT.submit}</button>
      <p className="version mp-counter">{TEXT.version}: 'alpha'</p>
    </div>
  )
}
