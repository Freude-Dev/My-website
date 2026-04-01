import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase'
import nodemailer from 'nodemailer'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { name, email, subject, message, phone } = req.body

  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email and message are required' })
    return
  }

  const { error } = await supabase
    .from('contact_messages')
    .insert([{ name, email, subject, message }])

  if (error) {
    res.status(500).json({ error: 'Server error' })
    return
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || 'freudedev@gmail.com'

    await transporter.sendMail({
      from: `"FreudeDev Website" <${process.env.GMAIL_USER}>`,
      to: toEmail,
      replyTo: email,
      subject: subject || `New contact message from ${name}`,
      text: `
New contact form submission

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}
      `.trim(),
    })

    res.status(201).json({ message: 'Message sent successfully 🙌' })
  } catch (mailError) {
    console.error('Contact email send error:', mailError)
    res.status(500).json({ error: 'Message saved, but email send failed' })
  }
})

export default router