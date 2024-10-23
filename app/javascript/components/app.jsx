// app/javascript/components/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './home';
import BasicExample from './basic_example';
import Chatroom from './chatroom';

export default () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/basic_example" element={<BasicExample />} />
      <Route path="/chatroom/:chatroomName" element={<Chatroom />} />
    </Routes>
  );
};

