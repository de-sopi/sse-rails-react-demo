import React from 'react';
import { useParams } from 'react-router-dom';
import { chatroomStyle, messagesStyle, newMessageStyle } from '../styles/styles.js'
import { useState, useEffect } from 'react'
import useChatStore from '../data/chat_store.js'
import { Message } from './message.jsx'

const Chatroom = () => {
  const { chatroomName } = useParams();
  const [message, setMessage]  = useState('')

  const connect = useChatStore((state) => state.connect)
  const disconnect = useChatStore((state) => state.disconnect)
  const messages = useChatStore((state) => state.messages)

  const currentUser = localStorage.getItem('userName')

  // TODO: redirect unless currentUser

  const updateMessage = (event) => {
    setMessage(event.target.value)
  }

  const sendMessage = (async (event) => {
    if(event.key != 'Enter') { return }

    const response = await fetch(new URL('http://localhost:3000/api/messages'), {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        connection_id: chatroomName,
        user: localStorage.getItem('userName'),
        message: message
      })
    }).then(() => setMessage(''))
  })


  useEffect(() => {
    connect(chatroomName) // open connection when component is rendered

    return () => {
      disconnect(chatroomName) // close the connection when component is not rendered anymore
    };
  }, [connect, disconnect])

  return (
  <div style={chatroomStyle}>
    <h1>Welcome to the Chatroom: {chatroomName}</h1>
    <div>
      { messages.map((message, index) => <Message key={index} userName={message.user} message={message.message}/>)}
    </div>
    <input style={newMessageStyle} type='text' placeholder='what do you want to say?' value={message} onChange={updateMessage} onKeyPress={sendMessage} />
  </div>
  )
};

export default Chatroom;
