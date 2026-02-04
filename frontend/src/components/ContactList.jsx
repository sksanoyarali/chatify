import React from 'react'
import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import UsersLoadingSkeleton from './UsersLoadingSkeleton'
import NoChatsFound from './NoChatsFound'
import { useAuthStore } from '../store/useAuthStore'

const ContactList = () => {
  const { getAllContact, allContacts, setSelecetedUser, isUsersLoading } =
    useChatStore()

  const { onlineUsers } = useAuthStore()
  useEffect(() => {
    getAllContact()
  }, [getAllContact])

  if (isUsersLoading) return <UsersLoadingSkeleton />
  return (
    <>
      {allContacts.map((contact) => (
        <div
          key={contact._id}
          className="bg-cyan-500/10 p-4 rounded-lg cursor-pointer hover:bg-cyan-500/20 transition-colors"
          onClick={() => setSelecetedUser(contact)}
        >
          <div className="flex items-center gap-3">
            <div
              className={`avatar ${onlineUsers.includes(contact._id) ? 'avatar-online' : 'avatar-offline'}`}
            >
              <div className="size-12 rounded-full">
                <img
                  src={contact.profilePic || '/avatar.png'}
                  alt={contact.fullName}
                />
              </div>
            </div>
            <h4 className="text-slate-200 font-medium truncate">
              {contact.fullName}
            </h4>
          </div>
        </div>
      ))}
    </>
  )
}

export default ContactList
