import React, { useState } from 'react'
import { TEXT } from '../rest/lang'
import { Login } from './Login'
import { Register } from './Register'

export const AuthMain = () => {
  const [isLogging, setIsLogging] = useState(true)
  return (
    <div>
      {/* <h5>Login or register?</h5>
      <div>
        <button onClick={() => setIsLogging(true)}>{TEXT.login}</button>
        <button onClick={() => setIsLogging(false)}>{TEXT.register}</button>
      </div> */}
      {isLogging ? <Login /> : <Register />}
    </div>
  )
}
