import express, { Router } from 'express'
import {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} from '../controllers/auth.controller.js'
import { protectRoute } from '../middlewares/auth.middleware.js'
import { arcjetProtection } from '../middlewares/arcjet.middleware.js'

const authRouter = express.Router()

// authRouter.use(arcjetProtection)

authRouter.post('/signup', signup)

authRouter.post('/login', login)

authRouter.post('/logout', logout)

authRouter.put('/update-profile', protectRoute, updateProfile)

authRouter.get('/check', protectRoute, checkAuth)

export default authRouter
