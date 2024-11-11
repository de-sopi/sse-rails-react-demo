import { create } from 'zustand'

const useChatStore = create((set) => {
  let eventSources = new Map // eventSource is set in the store but not callable outside this file

  const connect = (chatroomName) => {
    // don't create a new connection if we allread listen to the chatroom
    if(eventSources.hasOwnProperty('key')){
      console.log('using existing connection')
      return
    }

    let eventSource = new EventSource(`/api/chatrooms/${chatroomName}`) // connect to the SSE
    eventSource.onmessage = (message) => {
        set((state) => ({
          messages: [...state.messages,  JSON.parse(message.data)]
        })
      )// add newItem to the items array

    } // add new message to existing messages

    eventSources[chatroomName] = eventSource
    console.log('connected')
  }


  const disconnect = (chatroomName) => {
    const eventSource = eventSources[chatroomName]
    if (eventSource == null) { return } // only disconnect if connection exists

    eventSource.close() // close the connection
    console.log('disconnected')
  }

  // provide connect, disconnect and the messages within the hook
  return { messages: [], connect, disconnect}
})

export default useChatStore
