import mongoose from 'mongoose'

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)

    console.log('Database connected successfully')
  } catch (error) {
    console.log('Error in db connection')

    process.exit(1)//1 status code means fail.0 means connected
  }
}

export default connectDb
