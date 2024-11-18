import React from 'react'

export const messageContainerStyle = {
  border: '1px solid black',
  borderRadius: '10px',
  marginTop: '5px',
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

function fillColor(userName) {
  let hash = 0
    for (let i = 0; i < userName.length; i++) {
        hash = userName.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Use the hash to generate a hue (0 - 360)
    const hue = Math.abs(hash) % 360

    // Set saturation and lightness to fixed values for more consistent, visually distinct colors
    const saturation = 30 // 30% saturation
    const lightness = 60  // 60% lightness

    // Return HSL color string
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
