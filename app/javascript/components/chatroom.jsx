import React from 'react';
import { useParams } from 'react-router-dom';

const Chatroom = () => {
  const { chatroomName } = useParams();
  return <h1>Welcome to the Chatroom: {chatroomName}</h1>;
};

export default Chatroom;
