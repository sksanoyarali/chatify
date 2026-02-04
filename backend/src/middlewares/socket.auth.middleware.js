import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()
export const socketAuthMiddleware = async (socket, next) => {
  try {
    if (socket.handshake.method === 'OPTIONS') {
      return next()
    }
    const token = socket.handshake.headers.cookie
      ?.split('; ')
      .find((row) => row.startsWith('jwt='))
      ?.split('=')[1]

    if (!token) {
      console.log('Socket connection rejected :no token provided')
      return next(new Error('Unuthorized -No token provided'))
    }
    //   verify jwt token

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded) {
      console.log('Socket connection rejected :Invalid token')
      return next(new Error('Unuthorized -Invalid token'))
    }

    const user = await User.findById(decoded.userId).select('-password')

    if (!user) {
      console.log('Socket connection rejected :user not found')
      return next(new Error('User not found'))
    }
    socket.user = user
    socket.userId = user._id.toString()
    console.log(`Socket authenticated for user:${user.fullName} (${user._id})`)

    next()
  } catch (error) {
    console.log('Error in socket authentication', error.message)
    next(new Error('Unauthorized authentication failed'))
  }
}
