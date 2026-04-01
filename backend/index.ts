import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

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
app.set('trust proxy', 1)

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
})

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many login attempts, please try again later.' },
})

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
)
app.use(globalLimiter)

// ─── CORS ────────────────────────────────────────────────────────────────────

const envOrigins = [
  process.env.FRONTEND_URL,
  process.env.FRONTEND_URLS,
]
  .filter(Boolean)
  .flatMap((value) => (value as string).split(","))
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean)

const allowedOrigins = Array.from(new Set(envOrigins))
const vercelPreviewPattern = /^https:\/\/my-website(-[a-z0-9]+)?\.vercel\.app$/i

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    const normalizedOrigin = origin.replace(/\/$/, "")
    const isAllowedByList = allowedOrigins.includes(normalizedOrigin)
    const isAllowedVercelPreview = vercelPreviewPattern.test(normalizedOrigin)

    if (isAllowedByList || isAllowedVercelPreview) {
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

app.use('/api/auth',       authLimiter, authRouter)
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