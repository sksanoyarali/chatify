import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { useAuthStore } from './useAuthStore'
export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: 'chats',
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoding: false,
  isSoundEnabled: JSON.parse(localStorage.getItem('isSoundEnabled')) === true,

  toggleSound: () => {
    localStorage.setItem('isSoundEnabled', !get().isSoundEnabled)
    set({ isSoundEnabled: !get().isSoundEnabled })
  },
  setActiveTab: (tab) => {
    set({ activeTab: tab })
  },
  setSelecetedUser: (selectedUser) => {
    set({ selectedUser: selectedUser })
  },
  getAllContact: async () => {
    set({ isUsersLoading: true })

    try {
      const res = await axiosInstance.get('/messages/contacts')
      set({ allContacts: res.data })
    } catch (error) {
      const msg = error.response.data.message || 'Something went wrong'
      toast.error(msg)
    } finally {
      set({ isUsersLoading: false })
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true })

    try {
      const res = await axiosInstance.get('/messages/chats')
      set({ chats: res.data })
    } catch (error) {
      const msg = error.response.data.message || 'Something went wrong'
      toast.error(msg)
    } finally {
      set({ isUsersLoading: false })
    }
  },
  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoding: true })
    try {
      const res = await axiosInstance.get(`/messages/${userId}`)
      set({ messages: res.data })
    } catch (error) {
      const msg = error?.response?.data?.message || 'Error in getting messages'
      toast.error(msg)
    } finally {
      set({ isMessagesLoding: false })
    }
  },
  sendMessage: async (messagedata) => {
    const { selectedUser, messages } = get()
    const { authUser } = useAuthStore.getState()

    const tempId = `temp-${Date.now()}`
    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messagedata.text,
      image: messagedata.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    }
    set({ messages: [...messages, optimisticMessage] })
    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messagedata
      )
      set({ messages: messages.concat(res.data) })
    } catch (error) {
      set({ messages: messages })
      const msg = error?.response?.data?.message || 'Unable to send message'
      toast.error(msg)
    }
  },
  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get()
    if (!selectedUser) {
      return
    }
    const socket = useAuthStore.getState().socket
    socket.on('newMessage', (newMessage) => {
      const isMessageSentFromSelectedUser =
        newMessage.senderId === selectedUser._id

      if (!isMessageSentFromSelectedUser) return

      const currrentMessages = get().messages
      set({ messages: [...currrentMessages, newMessage] })
      if (isSoundEnabled) {
        const notificationSound = new Audio('/sound/notification.mp3')
        notificationSound.currentTime = 0
        notificationSound
          .play()
          .catch((e) => console.log('Audio play failed', e))
      }
    })
  },
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket
    socket.off('newMessage')
  },
}))
