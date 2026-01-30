import React from 'react'
import { useChatStore } from '../store/useChatStore'

const ActiveTabSwitch = () => {
  const { activeTab, setActiveTab } = useChatStore()
  return (
    <div className=" tabs tabs-box bg-transparent p-2 m-2">
      <button
        onClick={() => setActiveTab('chats')}
        className={`px-12 tab ${activeTab === 'chats' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
      >
        Chats
      </button>
      <button
        className={`tab px-12 ${activeTab === 'contacts' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'}`}
        onClick={() => setActiveTab('contacts')}
      >
        Contacts
      </button>
    </div>
  )
}

export default ActiveTabSwitch
