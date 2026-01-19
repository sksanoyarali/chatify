import { generateToken } from '../lib/utils.js'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
export const signup = async (req, res) => {
  const { fullName, email, password } = req.body

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields required',
      })
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 character',
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: 'Email already exist',
      })
    }

    //hashing the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = new User({
      fullName,
      email,
      password,
    })

    if (!user) {
      return res.status(401).json({
        message: 'Error in user creation',
      })
    }
    await user.save()
    generateToken(user._id, res)
    return res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.log('Error in signup', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export const login = async (req, res) => {}

export const logout = async (req, res) => {}
