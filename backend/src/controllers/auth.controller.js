import { sendWelcomeEmail } from '../emails/emailHandler.js'
import cloudinary from '../lib/cloudinary.js'
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
      password: hashedPassword,
    })

    if (!user) {
      return res.status(401).json({
        message: 'Error in user creation',
      })
    }
    await user.save()
    generateToken(user._id, res)
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
    try {
      await sendWelcomeEmail(user.email, user.fullName, process.env.CLIENT_URL)
    } catch (error) {
      console.log('Failed to send welcome email', error)
    }
  } catch (error) {
    console.log('Error in signup', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials',
      })
    }

    generateToken(user.id, res)

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    })
  } catch (error) {
    console.log('Error in login controler', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export const logout = async (req, res) => {
  res.cookie('jwt', '', { maxAge: 0 })
  res.status(200).json({
    message: 'Logged out successfully',
  })
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body

    if (!profilePic) {
      return res.status(400).json({
        message: 'Profile pic is required',
        success: false,
      })
    }

    const userId = req.user._id
    const uploadResponse = await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadResponse.secure_url,
      },
      { new: true }
    )

    return res.status(200).json(updatedUser)
  } catch (error) {
    console.log('Error in Update profile', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}

export const checkAuth = (req, res) => {
  return res.status(200).json(req.user)
}
