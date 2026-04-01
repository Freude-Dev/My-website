import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../lib/jwtAdmin'

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  try {
    const decoded = verifyAccessToken(token)
    ;(req as Request & { admin: { email: string; role: string } }).admin = {
      email: decoded.email,
      role: decoded.role,
    }
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = (req as Request & { admin?: { role: string } }).admin
    if (!admin?.role || !roles.includes(admin.role)) {
      res.status(403).json({ message: 'Forbidden' })
      return
    }
    next()
  }
}
