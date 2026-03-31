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
import projectsRouter from './src/routes/projects'
import quoteRouter from './src/routes/quote'

const app = express()
const port = process.env.PORT || 5000

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json())

// Prevent search engines from indexing backend API endpoints
app.use((req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow');
  next();
});

// Explicit robots.txt for the backend to disallow all crawlers
app.get('/robots.txt', (req, res) => {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})

// Routes
app.use('/api/quote', quoteRouter)
app.use('/api/auth', authRouter)
app.use('/api/waitlist', waitlistRouter)
app.use('/api/newsletter', newsletterRouter)
app.use('/api/contact', contactRouter)
app.use('/api/stats', verifyToken, statsRouter)
app.use('/api/projects', projectsRouter)

app.get('/', (req, res) => {
  res.json({ status: 'Freude Dev API running ✅' })
})

app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`)
})