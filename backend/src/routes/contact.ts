import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body

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

  res.status(201).json({ message: 'Message sent successfully 🙌' })
})

export default router