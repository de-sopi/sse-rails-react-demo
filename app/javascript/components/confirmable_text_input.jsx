import React from 'react'
import { useRef } from 'react'
import '../styles/confirmable_text_input.css'

export const ConfirmableTextInput = ({confirm, buttonText, confirmText }) => {
  const inputRef = useRef('')

  const callConfirm = () => {
    const newText = inputRef.current.value;
    confirm(newText)
    inputRef.current.value = ''
  }

  const handleKeyDown = (event) => {
    if(event.key == 'Enter'){
      callConfirm()
    }
  }

  return (
    <div className='new-input'>
    <input className='input-text' type="text" placeholder={`${confirmText}`} ref={inputRef} onKeyDown={handleKeyDown}/>
    <button className='input-confirm-button' onClick={callConfirm}>{buttonText}</button>
  </div>
  )
}