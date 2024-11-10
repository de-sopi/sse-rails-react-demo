import React from 'react';

export const timeStyle = {
  marginTop: '50px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  fontSize: '100px',
  fontWeight: 'bold'
}

export const chatroomsStyle = {
  display: 'flex',
  alignItems: 'flex-start'
}

export const chatroomsIntroStyle = {
  flex: 2
}

export const chatroomsListStyle = {
  flex: 1
}

export const messageContainerStyle = {
  border: '1px solid black',
  borderRadius: '10px',
  marginTop: '3px',
  display: 'flex',
  alignItems: 'flex-start',
}

export const usernameStyle =  (userName) => {
  return {
    paddingLeft: '10px',
    overflow: 'hidden',
    borderRadius: '10px 0px 0px 10px',
    borderLeft: '1px solid black',
    background: fillColor(userName),
    flex: 1
  }
}

export const messageStyle = {
  marginLeft: '10px',
  flex: 4
}

export const messagesStyle = {
  flex: 1,
  overflowY: 'scroll',
  overflowX: 'hidden',
  height: '100%'
}

export const newMessageStyle = {
  bottom: 0,
  left: 0,
  width: '100%',
  padding: '10px',
  margin: '10px'
}

export const chatroomStyle = {
  display: 'flex',
  flexDirection: 'column',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
}

function fillColor(userName) {
  let hash = 0;
    for (let i = 0; i < userName.length; i++) {
        hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use the hash to generate a hue (0 - 360)
    const hue = Math.abs(hash) % 360;

    // Set saturation and lightness to fixed values for more consistent, visually distinct colors
    const saturation = 30; // 60% saturation
    const lightness = 50;  // 70% lightness

    // Return HSL color string
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}





