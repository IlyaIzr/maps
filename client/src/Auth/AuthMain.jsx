import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useEffect } from "react";
import { hideMain } from "../store/app";
import { TEXT } from '../rest/lang'
import { Login } from './Login'
import { Register } from './Register'
import './Auth.css'
import { useLocation } from 'react-router-dom';

export const AuthMain = () => {
  const dispatch = useDispatch()
  const reg = new URLSearchParams(useLocation().search).get('reg')
  
  const [isLogging, setIsLogging] = useState(true)
  
  useEffect(() => {
    hideMain(dispatch)    
    if (reg) setIsLogging(false)
    // eslint-disable-next-line
  }, [])
  
  return (
    <div className="auth-container relative">
      <div className="absolute center auth-subcontainer">

      {isLogging ? <h3 className="align-center">{TEXT.login}</h3> : null}
      {/* TODO uptop label is good when form is borderless, else put header inside borders like in reg component */}

        <div className="auth-action-wrap mp-border-secondary">
          {isLogging ? <Login /> : <Register />}
        </div>
        <div className="align-center">
          {!isLogging ?
            <button className="small" onClick={() => setIsLogging(true)}>{TEXT.login}</button> :
            <button className="small" onClick={() => setIsLogging(false)}>{TEXT.register}</button>
          }
        </div>
      </div>
      
      <div className="bottom"></div>
    </div>
  )
}
/* eslint-disable */
