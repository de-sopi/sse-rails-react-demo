import { create } from 'zustand';

const useChatStore = create((set) => {
  let eventSource // eventSource is set in the store but not callable outside this file
  let messages = []

  const connect = (chatroomName) => {
    if (!eventSource) { // ensure we don't open the same connection twice
      eventSource = new EventSource(`/api/chatrooms/${chatroomName}`) // connect to the SSE
      eventSource.onmessage = (message) => {
        set({ messages: [...messages, JSON.parse(message.data)] })
      } // decide what to do when we receive a message
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
  return { messages: [], connect, disconnect};
});

export default useChatStore;
