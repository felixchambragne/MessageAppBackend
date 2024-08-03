import { Request, Response } from 'express'
import prismadb from '../../lib/prismadb'
import { generateJWT } from '../../lib/jwt'

const auth = async (_req: Request, res: Response) => {
  const user = await prismadb.user.create({
    data: {},
    select: {
      id: true,
    },
  })

  const token = generateJWT(user.id)

  return res.status(200).json({ token, userId: user.id })
}

export default auth
