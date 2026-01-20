import dotenv from 'dotenv'
import { createWelcomeEmailTemplate } from './emailTemplate.js'
import transporter from './nodemailer.js'

dotenv.config()
export const sendWelcomeEmail = async (email, name, clientUrl) => {
  const mailOptions = {
    from: `${process.env.SENDER_NAME} <${process.env.SENDER_EMAIL}`,
    to: email,
    subject: 'Welcome to Chatify',
    html: createWelcomeEmailTemplate(name, clientUrl),
  }
  try {
    await transporter.sendMail(mailOptions)
    console.log('Email send successfully')
  } catch (error) {
    console.log('error in sending email', error)
  }
}
