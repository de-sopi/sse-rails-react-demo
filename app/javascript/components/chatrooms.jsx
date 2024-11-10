import React from 'react'
import { useEffect, useState } from 'react'
import { chatroomsStyle, chatroomsIntroStyle, chatroomsListStyle } from '../styles/styles.js'
import { useNavigate } from 'react-router-dom'

const Chatrooms = () => {
  const [chatrooms, setChatrooms] = useState([])
  const [userName, setUserName] = useState(sessionStorage.getItem('userName') ?? '')
  const [newChatroom, setNewChatromm] = useState('')

  const navigate = useNavigate()

  const goToNewChatroom = () => { navigate(`${newChatroom.trim()}`)}

  useEffect(() => {
    const fetchChatrooms = async () => {
      const response = await fetch(new URL('http://localhost:3000/api/chatrooms'))
      if(!response.ok) {
        return
      }
      const existingChatrooms = await response.json()
      setChatrooms(existingChatrooms.map((item) => item.toString()))
    }
    fetchChatrooms()
  },[])

  const updateUserName = (event) => {
    sessionStorage.setItem('userName', event.target.value ?? '')
    setUserName(event.target.value)
  };

  const updateNewChatroom = (event) => {
    setNewChatromm(event.target.value)
  };

  const hasUserName = userName !== ''
  const hasNewChatroom = newChatroom !== ''

  const somethingIsWrong = () => {
    if(newChatroom === '') { return '' }
    if(newChatroom.trim() == 'sudo') { return 'this chatroom name is not allowed' }
    if(chatrooms.includes(newChatroom.trim())) { return 'chatroom with this name already exists, join by double clicking the room on the left' }
  }

  return(
    <div>
      <h1>Enter a chatroom or create a new one</h1>
      <div style={chatroomsStyle}>
        <div style={chatroomsIntroStyle}>
          <p>first, choose your user name </p>
          <input type="text" placeholder="user name" value={userName} onChange={updateUserName}/>
          {hasUserName && (
            <div>
              <p>create new chatroom </p>
              <input type="text" placeholder="chatroom" value={newChatroom} onChange={updateNewChatroom}/>
              <p>{somethingIsWrong() || <button onClick={goToNewChatroom}>create new chatroom</button>}</p>
            </div>)
          }
        </div>
        { hasUserName && (
          <div style={chatroomsListStyle}>
            <h2>Join Existing Chatrooms</h2>
            {chatrooms.map((item, index) => <div key={index} onDoubleClick={()=> {navigate(item.toString())}}>{item}</div>)}
          </div>)
        }
      </div>
    </div>
  )
};

export default Chatrooms;
