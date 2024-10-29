import React from 'react';
import { useEffect } from 'react';
import useTimeStore from '../data/time_store.js'

const Time = () => {

  const connect = useTimeStore((state) => state.connect)
  const disconnect = useTimeStore((state) => state.disconnect)
  const currentTime = useTimeStore((state) => state.currentTime)

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    };
  }, [connect, disconnect])


  return <div>
   {currentTime}
    </div>
};

export default Time;