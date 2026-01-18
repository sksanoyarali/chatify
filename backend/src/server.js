import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.routes.js'
import messageRouter from './routes/message.route.js'
dotenv.config()
const app = express()
const port = process.env.PORT || 8080

app.use(
  cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
)
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  console.log('root route')
  res.send('route working')
})

app.use('/api/auth', authRouter)
app.use('/api/messages', messageRouter)
app.listen(port, () => {
  console.log(`server is running in port ${port}`)
})
