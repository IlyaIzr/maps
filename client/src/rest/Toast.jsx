import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeToast } from '../store/app'
import { TEXT } from './lang'

export const Toast = () => {
  const data = useSelector(state => state.app.toast)
  const dispatch = useDispatch()
  const [visibility, setVisibility] = useState(null)
  const ref = useRef(null)

  // Make toast descending unless user hovers on in in given time
  useEffect(() => {
    const t = setTimeout(() => {
      setVisibility('opaque')
    }, 4000);
    if (ref?.current) ref.current.onmouseover = e => setVisibility(null)
    return () => {
      clearTimeout(t)
    }
  }, [])


  function onClick() {
    if (data.clickAction) data.clickAction()
    closeToast(dispatch)
  }

  if (!data.message) return null

  // Coloring
  // default status = 'error'
  let main = 'accent'
  let info = 'dark'
  let bg = 'light'
  let border = 'accent'
  let title = data.title !== undefined ? data.title : TEXT.error
  if (data.status === 'info') {
    main = 'counter'
    info = 'dark'
    bg = 'light'
    border = 'counter'
    title = ''
  }
  else if (data.status === 'warning') {
    main = 'counter'
    info = 'accent'
    bg = 'light'
    border = 'accent'
    title = data.title !== undefined ? data.title : TEXT.warning + '!'
  }
  else if (data.status === 'complete') {
    main = 'counter'
    info = 'dark'
    bg = 'light'
    border = 'counter'
    title = data.title !== undefined ? data.title : TEXT.complete + '!'
  }

  return (
    <div
      className={`mp-toast mp-${main} mp-bg-${bg} mp-border-${border} cursor-pointer ${visibility}`}
      onClick={onClick} ref={ref}
      key={data.key}
    >
      <div className="toast-header">
        {title ? <>
          <h6>{title}</h6>
          <div className={`close-cross mp-${info}`}>&#10006;</div>
        </> :
          <>
            <p className={`mp-${info}`}>{data.message}</p>
            <div className={`close-cross mp-${main}`}>&#10006;</div>
          </>
        }
      </div>
      {Boolean(title) && <div className={`toast-contetnt mp-${info}`}>
        {data.message}
      </div>}
      <div className="toast-bottom"></div>
    </div>
  )
}
