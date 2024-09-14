import { Request, Response } from 'express'
import prismadb from '../../lib/prismadb'
import { generateJWT } from '../../lib/jwt'

const signUp = async (req: Request, res: Response) => {
  const publicKey = req.body.publicKey
  if (!publicKey) {
    return res.status(400).json({ error: 'Invalid public key' })
  }
  const user = await prismadb.user.create({
    data: {
      publicKey,
    },
  })
  const token = generateJWT(user.id)
  return res.status(200).json(token)
}

export default signUp
