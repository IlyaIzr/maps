import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { TEXT } from '../rest/lang';
import { logIntoApp, logOutOfApp } from '../store/user';

export const Login = () => {
  const [username, setUsername] = useState('')
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const app = useSelector(state => state.app)

  function onInput(e) {
    setUsername(e.target.value)
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
    const prevUser = window.localStorage.getItem('usernameTemp')
    if (prevUser) {
      setUsername(prevUser)
      logIntoApp(dispatch, username, username, username + '-' + Math.floor(Math.random() * 1000))
    }
  }, [])

  return (
    <div>{
      app.isLogged ? <div>
        <h4>{TEXT.greetings}, {username}</h4>

        <button className="primary" onClick={logOut}>{TEXT.logout}</button>
      </div>
        :
        <>
          <label htmlFor="name">{TEXT.yourName}</label>
          <input type="text" name="name" value={username} onInput={onInput} />
          <button className="primary" onClick={onSubmit}>{TEXT.confirm}</button>
        </>
    }
    </div>
  )
}
