import cloudinary from '../lib/cloudinary.js'
import { getReceiverSocketId, io } from '../lib/socket.js'
import Message from '../models/message.model.js'
import User from '../models/user.model.js'

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id

    const contacts = await User.find({ _id: { $ne: loggedInUserId } }).select(
      '-password'
    )

    return res.status(200).json(contacts)
  } catch (error) {
    console.log('Error in getAllContacts', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    })
  }
}

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id
    const receiverId = req.params.id

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: receiverId },
        { senderId: receiverId, receiverId: myId },
      ],
    })

    return res.status(200).json(messages)
  } catch (error) {
    console.log('Error in getMessagesByUserId', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body

    const senderId = req.user._id
    const { id: receiverId } = req.params
    if (!text && !image) {
      return res.status(400).json({
        success: false,
        message: 'text or image is required',
      })
    }

    if (senderId.equals(receiverId)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot send messages to yourself',
      })
    }
    const receiverExist = await User.exists({ _id: receiverId })
    if (!receiverExist) {
      return res.status(400).json({
        success: false,
        message: 'Receiver Not Found',
      })
    }

    let imageUrl

    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })
    await newMessage.save()
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('newMessage', newMessage)
    }
    res.status(201).json(newMessage)
  } catch (error) {
    console.log('Error in Send message', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    })
  }
}

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id

    const messages = await Message.find({
      $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
    })

    const chatPartnerIds = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedInUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ]
    const chatPartners = await User.find({
      _id: { $in: chatPartnerIds },
    }).select('-password')

    res.status(200).json(chatPartners)
  } catch (error) {
    console.log('Error in Send message', error)
    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    })
  }
}
