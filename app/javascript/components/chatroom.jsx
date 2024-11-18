import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import useChatStore from '../data/chat_store.js'
import { Message } from './message.jsx'
import  { QrCode }  from './qr.jsx'
import { ConfirmableTextInput } from './confirmable_text_input.jsx'
import '../styles/chatroom.css'

const Chatroom = () => {
  const [currentUser, setCurrentUser] = useState(sessionStorage.getItem('userName'))
  const { chatroomName } = useParams()

  const connect = useChatStore((state) => state.connect)
  const disconnect = useChatStore((state) => state.disconnect)
  const messages = useChatStore((state) => state.messages)

  const navigate = useNavigate()

  const updateMessage = (event) => {
    setMessage(event.target.value)
  }

  const sendMessage = (async (message) => {
    if(message === ''|| message === null) {
      return
    }

    const response = await fetch(new URL('http://localhost:3000/api/messages'), {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        connection_id: chatroomName,
        user: sessionStorage.getItem('userName'),
        message: message
      })
    })
  })

  const updateUserName = (newUsername) => {
    sessionStorage.setItem('userName', newUsername)
    setCurrentUser(newUsername)
  }

  useEffect(() => {
    if(currentUser) { connect(chatroomName) }
    window.addEventListener('beforeunload',disconnect)

    return () => {
      disconnect(chatroomName) // close the connection when component is not rendered anymore
    }
  }, [connect, disconnect, currentUser])

  if(currentUser == null) {
    return (
      <div className='chatroom'>
        <h1>Please add username and press enter to join the chatroom {chatroomName}</h1>
        <ConfirmableTextInput confirm={updateUserName} buttonText={'confirm'}/>
      </div>
    )
  }

  return (
  <div className='chatroom'>
    <h1>Hi {currentUser}, welcome to the chatroom {chatroomName}</h1>
    <QrCode/>
    <ConfirmableTextInput confirm={sendMessage} buttonText={'send'}/>
    <div>
      { messages.sort((a, b) => b.time - a.time).map((message, index) => <Message key={index} userName={message.user} message={message.message} index={index}/>)}
    </div>
  </div>
  )
}

export default Chatroom
