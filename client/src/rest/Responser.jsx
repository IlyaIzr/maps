import React from 'react'

export const Responser = ({ message = '', setMessage, color = 'accent', title = '' }) => {
  function onClick() {
    setMessage('')
  }

  if (!message) return null

  const cn = `responser mp-${color} mp-border-${color}`

  return (
    <div className={cn}>
      <div className="header">
        <h6>{title}</h6>
        <div className={`close-cross cursor-pointer mp-${color}`} onClick={onClick}>&#10006;</div>
      
      </div>
      <p>{message}</p>
    </div>
  )
}
