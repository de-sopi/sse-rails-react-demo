import React from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useState, useEffect } from 'react'

export const QrCode = () => {
  const [showQrCode, setShowQrCode] = useState(true)

  const [isQPressed, setIsQPressed] = useState(false)
  const [isRPressed, setIsRPressed] = useState(false)
  const holdDuration = 1000

  useEffect(() => {
    let timer

    const handleKeyDown = (event) => {
      if (event.key === 'q') setIsQPressed(true)
      if (event.key === 'r') setIsRPressed(true)
    }

    const handleKeyUp = (event) => {
      if (event.key === 'q') setIsQPressed(false)
      if (event.key === 'r') setIsRPressed(false)
    }

    if (isQPressed && isRPressed) {
      timer = setTimeout(() => {
        setShowQrCode(true)
      }, holdDuration)
    } else {
      clearTimeout(timer)
      setShowQrCode(false)
    }

    // Attach keydown and keyup event listeners to the document
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    // Cleanup event listeners and clear the timer on component unmount
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
      clearTimeout(timer)
    }
  }, [isQPressed, isRPressed])

  return (
    <div>
    {
      showQrCode && (
        <QRCodeSVG value={window.location.href} />
      )
    }
    </div>
  )
}
