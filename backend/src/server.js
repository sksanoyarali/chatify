import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/auth.routes.js'
import messageRouter from './routes/message.route.js'
dotenv.config()
const app = express()
const port = process.env.PORT || 8080

app.get('/', (req, res) => {
  console.log('root route')
  res.send('route working')
})

app.use('/api/auth', authRouter)
app.use('/api/messages', messageRouter)
app.listen(port, () => {
  console.log(`server is running in port ${port}`)
})
