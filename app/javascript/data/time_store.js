import { create } from 'zustand';

const useTimeStore = create((set) => {
  let eventSource; // eventSource is set in the store but not callable outside this file

  const connect = () => {
    if (!eventSource) { // ensure we don't open the same connection twice
      eventSource = new EventSource('/api/time'); // connect to the SSE
      eventSource.onmessage = (message) => { set({ currentTime: message.data });}; // decide what to do when we receive a message
      console.log('connected')
    }
  }

  const disconnect = () => {
    if (eventSource == null) { return } // ensure we have a eventSource open

    eventSource.close(); // close the connection
    eventSource = null;
    console.log('disconnected')
  }
  // provide connect, disconnect and the current time within the hook
  return { currentTime: null, connect, disconnect};
});

export default useTimeStore;
