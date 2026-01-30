import express from 'express'
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from '../controllers/message.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'

const messageRouter = express.Router()

messageRouter.get('/contacts', protectRoute, getAllContacts)

messageRouter.get('/chats', protectRoute, getChatPartners)

messageRouter.get('/:id', protectRoute, getMessagesByUserId)

messageRouter.post('/send/:id', protectRoute, sendMessage)

export default messageRouter
