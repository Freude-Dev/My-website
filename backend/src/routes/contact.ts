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
  console.log('=== Backend Contact API Called ===')
  console.log('Request body:', req.body)
  
  const parsed = contactSchema.safeParse(req.body)
  if (!parsed.success) {
    console.log('Validation failed:', parsed.error.issues)
    res.status(400).json({
      error: 'Invalid request payload',
      details: parsed.error.issues.map((i) => i.message),
    })
    return
  }
  const { name, email, subject, message, phone } = parsed.data
  console.log('Parsed data:', { name, email, subject: subject?.substring(0, 50), message: message?.substring(0, 50) + '...', phone })

  console.log('Environment check:')
  console.log('SUPABASE_URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('SUPABASE_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_SECRET_KEY)

  try {
    const { error, data } = await supabase
      .from('contact_messages')
      .insert([{ name, email, subject, message }])
      .select()

    console.log('Supabase response:', { error, data })

    if (error) {
      console.error('Supabase error details:', error)
      res.status(500).json({ 
        error: 'Database error',
        details: error.message 
      })
      return
    }

    console.log('Data saved to database successfully')
  } catch (dbError: any) {
    console.error('Database connection error:', dbError)
    res.status(500).json({ 
      error: 'Database connection error',
      details: dbError.message 
    })
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
      from: `"${name}" <${process.env.GMAIL_USER}>`,  
      to: toEmail,
      replyTo: email,  
      subject: subject || `Contact from ${name} via FreudeDev Website`,
      text: `
You have received a new message from ${name} via the FreudeDev website.

Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}

Message:
${message}

---
This message was sent from the FreudeDev contact form.
To reply, simply reply to this email and it will go directly to ${email}.
      `.trim(),
    })

    console.log('Email sent successfully to:', toEmail)
    res.status(201).json({ message: 'Message sent successfully ' })
  } catch (mailError) {
    console.error('Contact email send error:', mailError)
    res.status(500).json({ error: 'Message saved, but email send failed' })
  }
})

export default router