// app/javascript/components/App.jsx
import React from 'react';
import Home from './home';
import Time from './time';
import Chatroom from './chatroom';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
          <Link to="/">Home</Link>
          <Link to="/time">First example: Get Time from Server</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/time" element={<Time/>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
