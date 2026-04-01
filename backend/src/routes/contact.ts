import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase'
import nodemailer from 'nodemailer'
import { z } from 'zod'

const router = Router()
const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  subject: z.string().trim().max(200).optional(),
  message: z.string().trim().min(5).max(3000),
  phone: z.string().trim().max(40).optional(),
})

router.post('/', async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid request payload',
      details: parsed.error.issues.map((i) => i.message),
    })
    return
  }
  const { name, email, subject, message, phone } = parsed.data

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