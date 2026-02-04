import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import messageRouter from './routes/message.route.js'
import connectDb from './lib/db.js'
import { app, server } from './lib/socket.js'
dotenv.config()
const port = process.env.PORT || 8080

app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
)
app.use(cookieParser())
app.use(express.json({ limit: '30mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.get('/', (req, res) => {
  console.log('root route')
  res.send('route working')
})

app.use('/api/auth', authRouter)
app.use('/api/messages', messageRouter)
server.listen(port, () => {
  console.log(`server is running in port ${port}`)
  connectDb()
})
