import { Server } from 'socket.io'
import http from 'http'
import express from 'express'
import dotenv from 'dotenv'
import { socketAuthMiddleware } from '../middlewares/socket.auth.middleware.js'
dotenv.config()

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173'],
    credentials: true,
  },
})

io.use(socketAuthMiddleware)

export function getReceiverSocketId(userId) {
  return userSocketMap[userId]
}
// this is for online status check userId:socketId
const userSocketMap = {}

io.on('connection', (socket) => {
  console.log('A user connected', socket.user.fullName)

  const userId = socket.userId
  userSocketMap[userId] = socket.id

  io.emit('getOnlineUsers', Object.keys(userSocketMap))

  socket.on('disconnect', () => {
    console.log('A user disconnected', socket.user.fullName)
    delete userSocketMap[userId]
    io.emit('getOnlineUsers', Object.keys(userSocketMap))
  })
})

export { io, app, server }
