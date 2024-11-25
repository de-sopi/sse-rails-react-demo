import { create } from 'zustand'

const useChatStore = create((set, get) => {
  let eventSources = new Map() // eventSource is set in the store but not callable outside this file
  let messages = new Map()

  const connect = (chatroomName) => {
    const messages = { ...get().messages };
    const eventSources = { ...get().eventSources };






    // don't create a new connection if we allread listen to the chatroom
    if (useChatroomsStore.state.getChatroom(chatroomName)){
      return
    }

    set((state) => {
      const currentMessages = state.messages
      currentMessages[chatroomName] = []

      return { messages: currentMessages }
    })

    let eventSource = new EventSource(`/api/chatrooms/${chatroomName}`)
    eventSource.addEventListener('chat_message', (event) => {
      const parsedData = JSON.parse(event.data)
      set((state) => ({
        messages: {
          ...state.messages,
            // add new message
          [chatroomName]: [...(state.messages[chatroomName] || []), parsedData],
        },
      }))
    })

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
  return { messages: new Map(), connect, disconnect}
})

export default useChatStore


const useChatroomsStore = create((set, get) => ({
  chatrooms: new Map(), // A Map to store chatroom stores by their ID

  // Create a new chatroom store
  createChatroom: (id) => {
    const chatrooms = new Map(get().chatrooms) // Clone the existing map
    if (!chatrooms.has(id)) {
      const newChatroom = createChatroomStore(id) // Create a new chatroom store
      chatrooms.set(id, newChatroom) // Add it to the map
      set({ chatrooms }) // Update the state
    }
  },

  // Get an existing chatroom store by ID
  getChatroom: (id) => get().chatrooms.get(id),

  // Delete a chatroom store by ID
  deleteChatroom: (id) => {
    const chatrooms = new Map(get().chatrooms) // Clone the existing map
    if (chatrooms.has(id)) {
      chatrooms.delete(id) // Remove the chatroom from the map
      set({ chatrooms }) // Update the state
    }
  }
}))
