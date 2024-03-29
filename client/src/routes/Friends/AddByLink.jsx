import { useEffect } from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { addByLink } from '~requests/friends'
import { TEXT } from '~rest/lang'
import { Loading } from '~rest/Loading'
import { setToast } from '~store/app'
import { AppLink } from '~components/Link/AppLink'

export const AddByLink = () => {
  const paramId = new URLSearchParams(useLocation().search).get('id')
  const dispatch = useDispatch()

  const [id, setId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [link, setLink] = useState('')
  function onInput(e) {
    const val = e.target.value
    setLink(val)
    if (val?.includes('id')) {
      const q = new URLSearchParams(val.split('?')[1])
      if (q.get('id')) setId(q.get('id'))
    }
  }
  const [readOnly, setReadOnly] = useState(false)

  useEffect(() => {
    if (paramId) setId(paramId)
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    (async function () {
      if (!id) return;

      console.log('%c⧭ id run', 'color: #733d00', id);

      await addFriend()
      setLoading(false)
    })()
    // eslint-disable-next-line
  }, [id]);

  async function addFriend() {
    const res = await addByLink(id)
    console.log('%c⧭', 'color: #00e600', res);
    if (res.status !== 'OK') return setToast(dispatch, { message: TEXT.requestError + ' #adBLi1'});
    setToast(dispatch, { message: TEXT.yourFriendsNow, status: 'complete' })
    setReadOnly(true)
  }

  if (paramId && loading) return (
    <Loading loading={loading} />
  )

  return (
    <div className="addByLink">
      <h4>{TEXT.addByLink}</h4>
      {!readOnly ?
        <div className="field">
          <label htmlFor="link">{TEXT.pasteAddLink}</label>
          <input type="text" value={link} onInput={onInput} readOnly={readOnly} />
        </div> :
        <div>
          <AppLink to="/friends">
            <button className="button">{TEXT.goBack}</button>
          </AppLink>
        </div>}
    </div>
  )
}
