import React from 'react'
import { useEffect } from 'react'
import useTimeStore from '../data/time_store.js'
import '../styles/time.css'

const Time = () => {
  const connect = useTimeStore((state) => state.connect)
  const disconnect = useTimeStore((state) => state.disconnect)
  const currentTime = useTimeStore((state) => state.currentTime)

  useEffect(() => {
    connect() // open connection when component is rendered

    window.addEventListener('beforeunload', disconnect)
    return () => {
      disconnect() // close the connection when component is not rendered anymore
    }
  }, [connect, disconnect])


  return <div className={'time'}>{currentTime}</div>
}

export default Time