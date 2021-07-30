import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginbyGoogle, loginWithCreds, logout } from '../requests/auth';
import { googleCreds } from '../rest/config';
import { TEXT } from '../rest/lang';
import { Responser } from '../rest/Responser';
import { closeModal, setToast } from '../store/app';
import { logIntoApp, logOutOfApp } from '../store/user';

export const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)

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
      logIntoApp(dispatch, res.data)
      closeModal(dispatch)

      setMsg(TEXT.greetings + ', ' + user.name)
      return setTimeout(() => {
        history.push('/')
      }, 1000);
    }
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))

    // window.localStorage.setItem('usernameTemp', login)
  }
  async function logOut() {
    const res = await logout()
    if (res.status === 'OK') {
      setLogin('')
      setPword('')
      setMsg('')
      return logOutOfApp(dispatch)
    }
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))
  }

  useEffect(() => {
    const { gapi } = window
    if (!gapi) return setToast(dispatch, {
      message: TEXT.networkError
    })

    gapi.load('auth2', () => {
      gapi.auth2.init().then((auth) => {
        auth.signOut().then(() => {
          gapi.signin2.render('google-signin-button', {
            width: 232,
            height: 40,
            longtitle: true,
            onsuccess: onOAuth,
            onfailure: onFail,
          });
        });
      });

    });
    // eslint-disable-next-line
  }, [])

  async function onOAuth(googleUser) {
    var profile = googleUser.getBasicProfile();
    // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    // console.log('Name: ' + profile.getName());
    // console.log('Image URL: ' + profile.getImageUrl());
    // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    const data = {
      name: profile.getName(),
      avatar: profile.getImageUrl(),
      gmail: profile.getEmail()
    }
    const res = await loginbyGoogle(data, googleUser.getAuthResponse().id_token)

    if (res.status === 'FIRSTTIME') {
      console.log('%c⧭', 'color: #731d6d', res);
      googleCreds.token = googleUser.getAuthResponse().id_token
      googleCreds.name = res.data.name
      googleCreds.login = res.data.login
      if (!res.data.login) googleCreds.occupiedLogin = profile.getEmail().split('@')[0]
      googleCreds.avatar = res.data.avatar
      googleCreds.id = profile.getId()
      closeModal(dispatch)
      return history.push('/googleConfirm')
    }
    if (res.status === 'OK') {
      logIntoApp(dispatch, res.data)
      closeModal(dispatch)

      setMsg(TEXT.greetings + ', ' + user.name)
      return setTimeout(() => {
        history.push('/')
      }, 1000);
    }
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))
  }
  function onFail(a) {
    console.log('%c⧭ failed', 'color: #00a3cc', a);
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + JSON.stringify(a))
  }


  return (
    <div>{
      app.isLogged ? <div>
        <h4>{TEXT.greetings}, {user.name}</h4>

        <button className="primary" onClick={logOut}>{TEXT.logout}</button>
      </div>
        :
        <div className="login-form">
          <label htmlFor="name">{TEXT.yourLogin}:</label>
          <input type="text" name="login" value={login} onInput={onInput} autoFocus />
          <br />
          <label htmlFor="pword">{TEXT.yourPword}:</label>
          <input type="password" name="pword" value={pword} onInput={onPword} />

          <Responser message={msg} setMessage={setMsg} />

          <button className="primary mp-border-accent loginBtn" onClick={onSubmit}>{TEXT.confirm}</button>
          {/* <button className="mp-border-secondary oauthBtn" onClick={oauth}>{'Google'}</button> */}
          <div id="google-signin-button"
            className="google-signin-button g-signin2 google-oauthBtn" data-onsuccess="onSignIn"></div>
        </div>
    }
    </div>
  )
}
