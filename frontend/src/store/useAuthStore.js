import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check')
      set({ authUser: res.data })
    } catch (error) {
      console.log('Error in authCheck', error)
      set({ authUser: null })
    } finally {
      set({ isCheckingAuth: false })
    }
  },
  signUp: async (data) => {
    set({ isSigningUp: true })
    try {
      const res = await axiosInstance.post('/auth/signup', data)
      set({ authUser: res.data })

      toast.success('Account created successfully')
    } catch (error) {
      const msg = error.response.data.message || 'Something went wrong'
      console.log('Error in signing up')
      toast.error(msg)
    } finally {
      set({ isSigningUp: false })
    }
  },
}))
