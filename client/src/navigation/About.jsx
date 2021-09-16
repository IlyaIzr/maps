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
      <div className="paddingcontainer">
        <p>{TEXT.aboutMain}</p>
        <h5 className="mp-border-dark">{TEXT.aboutFutureTitle}</h5>
        <p>{TEXT.aboutFuture}</p>

        <br />
        <p htmlFor="comment">{TEXT.comment}:</p>
        <textarea
          name="comment" rows="3"
          value={comment} onInput={onInput}
          className="raterComment mp-border-dark mp-dark"
          placeholder={TEXT.aboutPlaceholder}
        />
        <br />
        <button className="button" onClick={onClick}>{TEXT.submit}</button>
        <br />
        <h5 className="mp-border-dark">{TEXT.techInfo}</h5>
        <p>{TEXT.techSpecs}</p>

        <br />
        <br />

        <p className="version mp-counter">{TEXT.author}: @ilyaizr</p>
        <p className="version mp-counter">{TEXT.version}: alpha 3.2</p>

        <div className="bottom"></div>
      </div>
    </div>
  )
}
