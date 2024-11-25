import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Message } from './message.jsx'
import  { QrCode }  from './qr.jsx'
import { ConfirmableTextInput } from './confirmable_text_input.jsx'
import '../styles/chatroom.css'

const Chatroom = () => {
  const [currentUser, setCurrentUser] = useState(sessionStorage.getItem('userName'))
  const { chatroomName } = useParams()
  const [ messages, setMessages ] = useState([])

  const navigate = useNavigate()

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

  const prependMessage = (data) => {
    setMessages([data, ...messages])
  }

  const updateUserName = (newUsername) => {
    sessionStorage.setItem('userName', newUsername)
    setCurrentUser(newUsername)
  }

  useEffect(() => {
    if(currentUser) {
      const eventSource = new EventSource(`/api/chatrooms/${chatroomName}`)
      eventSource.addEventListener('chat_message', (event) => {
        setMessages((previousMessages) => [JSON.parse(event.data), ...previousMessages])
      })
      eventSource.onerror = (err) => {
        console.log(err.message)
      }
    }
  }, [currentUser])

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
      { messages.map((message, index) =>
        <Message key={index} userName={message.user} message={message.message} index={index}/>)
      }
    </div>
  </div>
  )
}

export default Chatroom
