import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { loginbyGoogle, loginWithCreds, logout } from '../requests/auth';
import { googleCreds } from '../rest/config';
import { TEXT } from '../rest/lang';
import { Responser } from '../rest/Responser';
import { closeModal, setToast } from '../store/app';
import { logIntoApp, logOutOfApp } from '../store/user';
import { getFriendsInfo } from '../rest/helperFuncs'
import { GoogleLogin } from '@react-oauth/google';


export const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  const loc = useLocation().pathname

  const [login, setLogin] = useState('')
  const [pword, setPword] = useState('')
  const [msg, setMsg] = useState('')

  // useEffect(() => {
  //   const { gapi } = window
  //   console.log('%c⧭ gapi', 'color: #733d00', gapi);
  //   if (!gapi) return setToast(dispatch, {
  //     message: TEXT.networkError
  //   })

  //   gapi.load('auth2', () => {
  //     gapi.auth2.init().then((auth) => {
  //       auth.signOut().then(() => {
  //         gapi.signin2.render('google-signin-button', {
  //           width: 200,
  //           height: 32,
  //           longtitle: true,
  //           onsuccess: onOAuth,
  //           onfailure: onFail,
  //           theme: (app.theme === 'dark' || app.theme === 'blueprint') ? 'dark' : 'white'
  //         });
  //       });
  //     });

  //   });
  //   // eslint-disable-next-line
  // }, [])


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
      return logIntoApp(dispatch, res.data)
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
      return logOutOfApp(dispatch)
    }
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))
  }


  async function onOAuth(auth) {
    const res = await loginbyGoogle(auth.credential)

    if (res.status === 'FIRSTTIME') {
      // TODO get that from library as <App> wrapped in a google context
      googleCreds.token = auth.credential
      googleCreds.name = res.data.name
      googleCreds.login = res.data.login
      if (!res.data.login) googleCreds.occupiedLogin = res.data.email
      googleCreds.avatar = res.data.avatar
      googleCreds.id = res.data.id
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
      return logIntoApp(dispatch, res.data)
    }
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))
  }
  function onFail(a) {
    console.log('%c⧭ failed', 'color: #00a3cc', a);
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + JSON.stringify(a))
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
          <div className={loc !== '/auth' ? 'login-form login-form-bordered mp-border-secondary' : 'login-form'}>
            <label htmlFor="name">{TEXT.yourLogin}:</label>
            <input type="text" name="login" value={login} onInput={onInput} autoFocus />
            <br />
            <label htmlFor="pword">{TEXT.yourPword}:</label>
            <input type="password" name="pword" value={pword} onInput={onPword} />

            <Responser message={msg} setMessage={setMsg} />

            <button className="primary mp-border-accent loginBtn" onClick={onSubmit}>{TEXT.confirm}</button>
            {/* <button className="mp-border-secondary oauthBtn" onClick={onOAuth}>{'Google'}</button> */}
            {/* <div id="google-signin-button"
              className="google-signin-button g-signin2 google-oauthBtn" data-onsuccess="onSignIn"></div> */}
              <GoogleLogin onSuccess={onOAuth} onError={onFail} width='200'></GoogleLogin>
          </div>
          {loc !== '/auth' &&
            <div className="align-center">
              <Link to="/auth?reg=true" onClick={onInitReg}>
                <button className="button">{TEXT.register}</button>
              </Link>
            </div>}

        </div>
    }
    </div>
  )
}
