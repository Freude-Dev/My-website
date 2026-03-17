import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

const router = Router()

router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  const jwtSecret = process.env.JWT_SECRET

  if (!jwtSecret || !adminEmail || !adminPassword) {
    res.status(500).json({ message: 'Server configuration error' })
    return
  }

  if (email !== adminEmail || password !== adminPassword) {
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const token = jwt.sign(
    { email, role: 'admin' },
    jwtSecret,
    { expiresIn: '24h' }
  )

  res.json({ token })
})

export default router