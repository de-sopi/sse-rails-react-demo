// app/javascript/components/App.jsx
import React from 'react'
import Home from './home'
import Time from './time'
import Chatrooms from './chatrooms'
import Chatroom from './chatroom'
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import '../styles/global_styles.css'
import '../styles/navigation.css'

const App = () => {
  return (
    <Router>
      <div>
        <nav className={'navbar'}>
          <Link to="/" className={'navlink'}>Home</Link>
          <Link to="/time" className={'navlink'}>Server Sends Time</Link>
          <Link to="/chatrooms" className={'navlink'}>Server Sends Chat</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/time" element={<Time/>} />
          <Route path="/chatrooms" element={<Chatrooms/>} />
          <Route path="/chatrooms/:chatroomName" element={<Chatroom/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
