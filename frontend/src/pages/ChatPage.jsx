import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {
  const { logout } = useAuthStore()
  return (
    <div className="z-10">
      <button onClick={logout} className="border text-2xl bg-white">
        logout
      </button>
    </div>
  )
}

export default ChatPage
