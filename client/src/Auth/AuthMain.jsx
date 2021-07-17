import { useState } from 'react'
/* eslint-disable */
import { TEXT } from '../rest/lang'
import { Login } from './Login'
import { Register } from './Register'
import './Auth.css'

export const AuthMain = () => {
  const [isLogging, setIsLogging] = useState(true)
  return (
    <div className="auth-container relative">
      <div className="absolute center auth-subcontainer">

        <h3 className="align-center">{isLogging ? TEXT.login : TEXT.register}</h3>

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
    </div>
  )
}
