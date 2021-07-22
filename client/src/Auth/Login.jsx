import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { loginWithCreds } from '../requests/auth';
import { TEXT } from '../rest/lang';
import { Responser } from '../rest/Responser';
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
    const res = await loginWithCreds({ login, pword })
    if (res.status === 'WRONG') {
      return setMsg(TEXT.wrongAuth)
    }
    if (res.status === 'OK') {
      await logIntoApp(dispatch, res.data)

      setMsg(TEXT.greetings + ', ' + user.name)
      return setTimeout(() => {
        history.push('/')
      }, 1000);
    }
    setMsg(TEXT.errorReg + ', ' + TEXT.errCode + ': ' + (res.msg || res))

    // window.localStorage.setItem('usernameTemp', login)
  }
  function logOut() {
    setLogin('')
    logOutOfApp(dispatch)
  }

  // useEffect(() => {
  //   if (login !== user.name && app.isLogged) setLogin(user.name)
  // }, [user.name, login, app.isLogged])


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

          <button className="primary mp-border-accent" onClick={onSubmit}>{TEXT.confirm}</button>
        </div>
    }
    </div>
  )
}
