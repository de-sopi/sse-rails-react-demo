// src/store/useTimeStore.js
import { create } from 'zustand';

const useTimeStore = create((set) => {
  let eventSource;

  const connect = () => {
    if (!eventSource) {
      eventSource = new EventSource('http://localhost:3000/api/time');

      eventSource.onmessage = (message) => {
        set({ currentTime: message.data });
      };

      console.log('connected')
    }
  }

  const disconnect = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    console.log('disconnected')
  }


  return {
    currentTime: null,
    connect,
    disconnect
  };
});

export default useTimeStore;
