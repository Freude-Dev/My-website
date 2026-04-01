import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import waitlistRouter from './src/routes/waitlist'
import newsletterRouter from './src/routes/newsletter'
import contactRouter from './src/routes/contact'
import authRouter from './src/routes/auth'
import statsRouter from './src/routes/stats'
import projectsRouter from './src/routes/projects'
import quoteRouter from './src/routes/quote'
import { verifyToken } from './src/middleware/auth'

const app = express()
const port = process.env.PORT || 5000

// ─── CORS ────────────────────────────────────────────────────────────────────

const allowedOrigins = [
  process.env.FRONTEND_URL,
].filter(Boolean) as string[]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, server-to-server, UptimeRobot)
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`CORS blocked: ${origin}`)
      callback(new Error(`CORS: origin ${origin} not allowed`))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))


// ─── BODY PARSER ─────────────────────────────────────────────────────────────

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// ─── HEALTH CHECK (ping this via UptimeRobot to keep Render alive) ───────────

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

app.get('/', (req, res) => {
  res.json({ status: 'Freude Dev API running ✅' })
})

// ─── ROUTES ──────────────────────────────────────────────────────────────────

app.use('/api/auth',       authRouter)
app.use('/api/waitlist',   waitlistRouter)
app.use('/api/newsletter', newsletterRouter)
app.use('/api/contact',    contactRouter)
app.use('/api/stats',      verifyToken, statsRouter)
app.use('/api/projects',   projectsRouter)
app.use('/api/quote',      quoteRouter)

// ─── 404 HANDLER ─────────────────────────────────────────────────────────────

app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.path} not found` })
})

// ─── GLOBAL ERROR HANDLER ────────────────────────────────────────────────────

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err.message)
  res.status(500).json({ message: err.message || 'Internal server error' })
})

// ─── START ───────────────────────────────────────────────────────────────────

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
  console.log(`📋 Allowed origins: ${allowedOrigins.join(', ')}`)
})