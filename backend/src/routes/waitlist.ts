import { Router, Request, Response } from 'express'
import { supabase } from '../lib/supabase'

const router = Router()

router.post('/', async (req: Request, res: Response) => {
  const { name, email } = req.body

  if (!email) {
    res.status(400).json({ error: 'Email is required' })
    return
  }

  const { error } = await supabase
    .from('waitlist')
    .insert([{ name, email }])

  if (error) {
    if (error.code === '23505') {
      res.status(409).json({ error: 'Email already on waitlist' })
      return
    }
    res.status(500).json({ error: 'Server error' })
    return
  }

  res.status(201).json({ message: 'Added to waitlist successfully 🎉' })
})

export default router