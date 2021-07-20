import React from 'react'

export const Responser = ({ message = '', setMessage }) => {
  function onClick() {
    setMessage('')
  }
  
  if (!message) return null
  return (
    <div className="responser cursor-pointer mp-accent mp-border-accent" onClick={onClick}>
      <p>{message}</p>
    </div>
  )
}
