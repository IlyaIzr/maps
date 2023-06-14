import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { loginByGoogle, loginWithCreds, logout } from '../requests/auth';
import { googleCreds } from '../rest/config';
import { TEXT } from '../rest/lang';
import { Responser } from '../rest/Responser';
import { closeModal, setToast } from '../store/app';
import { setLogInCreds, setLogOutCreds } from '../store/user';
import { getFriendsInfo } from '../rest/helperFuncs'
import { GoogleLogin } from '@react-oauth/google';
import { AppLink } from '~components/Link/AppLink'


export const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const path = useLocation().pathname

  const [login, setLogin] = useState('')
  const [pword, setPword] = useState('')
  const [msg, setMsg] = useState('')

  function onInput(e) {
    setLogin(e.target.value)
  }
  function onPword(e) {
    setPword(e.target.value)
  }
  async function onSubmit() {
    setMsg(TEXT.loading + '...')
    const res = await loginWithCreds({ login, pword })
    if (res.status === 'WRONG') {
      return setMsg(TEXT.wrongAuth)
    }
    if (res.status === 'OK') {
      closeModal(dispatch)
      setToast(dispatch, {
        message: TEXT.greetings + ', ' + res.data.name,
        status: 'complete',
        title: null
      })
      setMsg('')
      await getFriendsInfo(dispatch)
      history.push('/')
      return setLogInCreds(dispatch, res.data)
    }
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))

    // window.localStorage.setItem('usernameTemp', login)
  }
  async function logOut() {
    const res = await logout()
    if (res.status === 'OK') {
      setToast(dispatch, {
        message: TEXT.farewell + ', ' + user.name,
        status: 'complete',
        title: null
      })
      setLogin('')
      setPword('')
      setMsg('')
      return setLogOutCreds(dispatch)
    }
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))
  }


  async function onSuccessGoogleAuth(auth) {
    const res = await loginByGoogle(auth.credential)

    if (res.status === 'FIRSTTIME') {
      setGoogleCredsForRegistration(res)
      closeModal(dispatch)
      return history.push('/googleConfirm')
    }
    if (res.status === 'OK') {
      closeModal(dispatch)
      setToast(dispatch, {
        message: TEXT.greetings + ', ' + res.data.name,
        status: 'complete',
        title: null
      })
      setMsg('')
      await getFriendsInfo(dispatch)
      history.push('/')
      return setLogInCreds(dispatch, res.data)
    }
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))
  }
  function onFail(e) {
    console.log('%c⧭ google auth failed', 'color: #00a3cc', e);
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + JSON.stringify(e))
  }

  function onInitReg() {
    closeModal(dispatch)
  }

  return (
    <div>{
      app.isLogged ? <div>
        <h4>{TEXT.greetings}, {user.name}</h4>

        <button className="primary" onClick={logOut}>{TEXT.logout}</button>
      </div>
        :
        <div>
          <div className={path !== '/auth' ? 'login-form login-form-bordered mp-border-secondary' : 'login-form'}>
            <label htmlFor="name">{TEXT.yourLogin}:</label>
            <input type="text" name="login" value={login} onInput={onInput} autoFocus />
            <br />
            <label htmlFor="pword">{TEXT.yourPword}:</label>
            <input type="password" name="pword" value={pword} onInput={onPword} />

            <Responser message={msg} setMessage={setMsg} />

            <button className="primary mp-border-accent loginBtn" onClick={onSubmit}>{TEXT.confirm}</button>

            <GoogleLogin
              shape='rectangular'
              onSuccess={onSuccessGoogleAuth}
              onError={onFail}
              width='200'
              theme={(app.theme === 'dark') ? 'filled_black' : 'outline'}
            ></GoogleLogin>
          </div>
          {
            path !== '/auth' &&
            <div className="align-center">
              <AppLink to="/auth?reg=true" onClick={onInitReg}>
                <button className="button">{TEXT.register}</button>
              </AppLink>
            </div>
          }

        </div>
    }
    </div>
  )
}

function setGoogleCredsForRegistration(res) {
  googleCreds.name = res.data.name
  googleCreds.login = res.data.login
  if (!res.data.login) googleCreds.occupiedLogin = res.data.email
  googleCreds.avatar = res.data.avatar
  googleCreds.id = res.data.id
}