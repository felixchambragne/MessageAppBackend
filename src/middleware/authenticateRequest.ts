import { NextFunction, Request, Response } from 'express'
import authenticateUser from './authenticateUser'

const authenticateRequest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'unauthorized' })
  }
  try {
    const userId = await authenticateUser(token)
    req.body.userId = userId
    next()
  } catch (err: any) {
    return res.status(401).json({ message: 'error' })
  }
}

export default authenticateRequest
