import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TEXT } from '../rest/lang';
import { logIntoApp, logOutOfApp } from '../store/user';

export const Login = () => {
  const [username, setUsername] = useState('')
  const [pword, setPword] = useState('')
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)
  

  function onInput(e) {
    setUsername(e.target.value)
  }
  function onPword(e) {
    setPword(e.target.value)
  }
  function onSubmit() {
    logIntoApp(dispatch, username, username, username + '-' + Math.floor(Math.random() * 1000))
    window.localStorage.setItem('usernameTemp', username)
  }
  function logOut() {
    window.localStorage.clear()
    setUsername('')
    logOutOfApp(dispatch)
  }

  useEffect(() => {
    if (username !== user.name && app.isLogged) setUsername(user.name)
  }, [user.name, username, app.isLogged])


  return (
    <div>{
      app.isLogged ? <div>
        <h4>{TEXT.greetings}, {username}</h4>

        <button className="primary" onClick={logOut}>{TEXT.logout}</button>
      </div>
        :
        <div className="login-form">
          <label htmlFor="name">{TEXT.yourLogin}:</label>
          <input type="text" name="name" value={username} onInput={onInput} autoFocus />
          <br />
          <label htmlFor="pword">{TEXT.yourPword}:</label>
          <input type="password" name="pword" value={pword} onInput={onPword} />
          <button className="primary small" onClick={onSubmit}>{TEXT.confirm}</button>
        </div>
    }
    </div>
  )
}
