import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { setToast } from '~store/app'
import { TEXT } from '~rest/lang';
import { postFeedback } from '~requests/reviews';
import { copyToClipboard } from '~rest/utils/helperFuncs';

export const About = () => {
  const dispatch = useDispatch()

  const [comment, setComment] = useState('');

  function onInput(e: React.FormEvent<HTMLTextAreaElement>) {
    setComment((e.target as HTMLTextAreaElement).value);
  }

  async function onClick() {
    const res = await postFeedback(comment)

    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #aboutus1' })
    else setToast(dispatch, { message: TEXT.sent, status: 'complete' })
    setTimeout(() => {
      setComment('')
    }, 500)
  }

  function onEmailClick() {
    copyToClipboard('ilyaizrailyan@gmail.com')
    setToast(dispatch, {
      message: 'copied to clipboard',
      status: 'complete'
    })
  }

  return (
    <div className="aboutPage relative">
      <div className="paddingcontainer">
        <p>{TEXT.aboutMain}</p>
        <h5 className="mp-border-dark">{TEXT.aboutFutureTitle}</h5>
        <p>{TEXT.aboutFuture}</p>

        <br />
        <p>{TEXT.comment}:</p>
        <textarea
          name="comment" rows={3}
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
        <p className="version mp-counter">{TEXT.version}: alpha 3.3</p>
        <p className="version mp-counter">github: <a className='mp-accent' href="https://github.com/IlyaIzr/maps">github.com/IlyaIzr/maps</a></p>
        <p className="version mp-counter ">mail: <span className='cursor-pointer mp-accent' onClick={onEmailClick}>ilyaizrailyan@gmail.com</span></p>
        <p className="version mp-counter">{TEXT.thanksTo}: <a href="nominatim.org" className='mp-counter'>nominatim api</a></p>
      </div>
    </div>
  )
}
