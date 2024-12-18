import React from 'react'

import { messageContainerStyle, usernameStyle , messageStyle } from '../styles/message_style.js'

export const Message = ({userName, message}) => {
  return (
  <div style={messageContainerStyle}>
    <div style={usernameStyle(userName)}>{userName}</div>
    <div style={messageStyle}>{message}</div>
  </div>
  )
}