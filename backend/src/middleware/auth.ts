import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'No token provided' })
    return
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!)
    ;(req as any).admin = decoded
    next()
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' })
  }
}