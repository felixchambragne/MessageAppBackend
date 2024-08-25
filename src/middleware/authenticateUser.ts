import jwt from 'jsonwebtoken'
import prismadb from '../lib/prismadb'

const authenticateUser = async (token: string) => {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any
    const userId = payload.userId

    const user = await prismadb.user.findUnique({ where: { id: userId } })

    if (!user) {
      throw new Error('Unauthorized')
    }

    await prismadb.user.update({
      where: {
        id: userId,
      },
      data: {
        lastActivityAt: new Date(),
      },
    })

    return userId
  } catch (err) {
    throw new Error('Unauthorized')
  }
}

export default authenticateUser
