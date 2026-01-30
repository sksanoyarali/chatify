import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
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
}))
