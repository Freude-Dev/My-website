import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import waitlistRouter from './src/routes/waitlist'
import newsletterRouter from './src/routes/newsletter'
import contactRouter from './src/routes/contact'
import authRouter from './src/routes/auth'
import statsRouter from './src/routes/stats'
import { verifyToken } from './src/middleware/auth'

const app = express()
const port = process.env.PORT || 5000


const allowedOrigins = [
  'http://localhost:3000',
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, server-to-server)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true,
}))
app.use(express.json())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/waitlist', waitlistRouter)
app.use('/api/newsletter', newsletterRouter)
app.use('/api/contact', contactRouter)
app.use('/api/stats', verifyToken, statsRouter)

app.get('/', (req, res) => {
  res.json({ status: 'Freude Dev API running ✅' })
})

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})