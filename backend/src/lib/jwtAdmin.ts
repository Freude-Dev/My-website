import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { isRevoked } from './revocationStore'

const ISS = process.env.JWT_ISS || 'freudedev-api'
const AUD = process.env.JWT_AUD || 'freudedev-admin'
const ACCESS_TTL = process.env.ADMIN_ACCESS_TTL || '15m'
const REFRESH_TTL = process.env.ADMIN_REFRESH_TTL || '7d'

export type AdminJwtPayload = {
  email: string
  role: string
  typ: 'access' | 'refresh'
  jti: string
  iss?: string
  aud?: string
  exp?: number
  iat?: number
}

function secret() {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET missing')
  return s
}

export function signAccessToken(email: string, role: string) {
  const jti = crypto.randomBytes(16).toString('hex')
  return jwt.sign({ email, role, typ: 'access', jti }, secret(), {
    expiresIn: ACCESS_TTL,
    issuer: ISS,
    audience: AUD,
  })
}

export function signRefreshToken(email: string, role: string) {
  const jti = crypto.randomBytes(16).toString('hex')
  return jwt.sign({ email, role, typ: 'refresh', jti }, secret(), {
    expiresIn: REFRESH_TTL,
    issuer: ISS,
    audience: AUD,
  })
}

export function verifyAccessToken(token: string): AdminJwtPayload {
  const decoded = jwt.verify(token, secret(), {
    issuer: ISS,
    audience: AUD,
  }) as AdminJwtPayload
  if (decoded.typ !== 'access') {
    throw new Error('Invalid token type')
  }
  if (isRevoked(decoded.jti)) {
    throw new Error('Token revoked')
  }
  return decoded
}

export function verifyRefreshToken(token: string): AdminJwtPayload {
  const decoded = jwt.verify(token, secret(), {
    issuer: ISS,
    audience: AUD,
  }) as AdminJwtPayload
  if (decoded.typ !== 'refresh') {
    throw new Error('Invalid token type')
  }
  if (isRevoked(decoded.jti)) {
    throw new Error('Token revoked')
  }
  return decoded
}
