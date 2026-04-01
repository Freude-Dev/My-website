import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { z } from 'zod'
import { authenticator } from 'otplib'
import { verifyAdminPassword, hasAdminPasswordConfigured } from '../lib/passwordVerify'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../lib/jwtAdmin'
import { revokeToken } from '../lib/revocationStore'
import {
  isLocked,
  recordFailure,
  clearFailures,
  lockoutRemainingMs,
} from '../lib/loginLockout'
import { auditLog } from '../lib/auditLog'

const router = Router()

function clientIp(req: Request) {
  const x = req.headers['x-forwarded-for']
  if (typeof x === 'string' && x.length) return x.split(',')[0].trim()
  return req.socket.remoteAddress || 'unknown'
}

const loginSchema = z.object({
  email: z.string().email().max(200),
  password: z.string().min(1).max(200),
  totp: z.string().max(8).optional(),
})

const refreshSchema = z.object({
  refreshToken: z.string().min(20),
})

const logoutSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
})

router.post('/login', async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request' })
    return
  }

  const { email, password, totp } = parsed.data
  const ip = clientIp(req)
  const adminEmail = process.env.ADMIN_EMAIL
  const jwtSecret = process.env.JWT_SECRET
  const role = process.env.ADMIN_ROLE || 'admin'

  if (!jwtSecret || !adminEmail || !hasAdminPasswordConfigured()) {
    res.status(500).json({ message: 'Server configuration error' })
    return
  }

  if (isLocked(ip, adminEmail)) {
    const ms = lockoutRemainingMs(ip, adminEmail)
    auditLog('login_failure', { ip, reason: 'lockout' })
    res.status(429).json({
      message: `Too many attempts. Try again in ${Math.ceil(ms / 60000)} min.`,
    })
    return
  }

  if (email !== adminEmail) {
    auditLog('login_failure', { ip, reason: 'bad_email' })
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const ok = await verifyAdminPassword(password)
  if (!ok) {
    recordFailure(ip, adminEmail)
    auditLog('login_failure', { ip, email, reason: 'bad_password' })
    res.status(401).json({ message: 'Invalid credentials' })
    return
  }

  const totpSecret = process.env.ADMIN_TOTP_SECRET
  if (totpSecret?.length) {
    authenticator.options = { window: 1 }
    const code = totp?.trim() || ''
    if (!code) {
      res.status(400).json({
        message: 'Authenticator code required',
        requiresTotp: true,
      })
      return
    }
    if (!authenticator.verify({ token: code, secret: totpSecret })) {
      recordFailure(ip, adminEmail)
      auditLog('login_failure', { ip, email, reason: 'bad_totp' })
      res.status(401).json({ message: 'Invalid authenticator code' })
      return
    }
  }

  clearFailures(ip, adminEmail)
  const accessToken = signAccessToken(email, role)
  const refreshToken = signRefreshToken(email, role)
  auditLog('login_success', { ip, email, role })
  res.json({
    accessToken,
    refreshToken,
    tokenType: 'bearer',
    expiresIn: 900,
  })
})

router.post('/refresh', (req: Request, res: Response) => {
  const parsed = refreshSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request' })
    return
  }
  try {
    const decoded = verifyRefreshToken(parsed.data.refreshToken)
    if (decoded.exp) revokeToken(decoded.jti, decoded.exp)
    const accessToken = signAccessToken(decoded.email, decoded.role)
    const refreshToken = signRefreshToken(decoded.email, decoded.role)
    auditLog('token_refresh', { email: decoded.email })
    res.json({ accessToken, refreshToken })
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
})

router.post('/logout', (req: Request, res: Response) => {
  const parsed = logoutSchema.safeParse(req.body)
  if (!parsed.success) {
    res.status(400).json({ message: 'Invalid request' })
    return
  }
  const { accessToken, refreshToken } = parsed.data
  const a = accessToken
    ? (jwt.decode(accessToken) as { jti?: string; exp?: number } | null)
    : null
  const r = refreshToken
    ? (jwt.decode(refreshToken) as { jti?: string; exp?: number } | null)
    : null
  if (a?.jti && a.exp) {
    revokeToken(a.jti, a.exp)
    auditLog('token_revoked', { kind: 'access' })
  }
  if (r?.jti && r.exp) {
    revokeToken(r.jti, r.exp)
    auditLog('token_revoked', { kind: 'refresh' })
  }
  auditLog('logout', {})
  res.json({ message: 'Logged out' })
})

export default router
