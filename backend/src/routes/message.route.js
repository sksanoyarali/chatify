import express from 'express'

const messageRouter = express.Router()

messageRouter.get('/get', (req, res) => {
  console.log('got the message')
})

export default messageRouter
