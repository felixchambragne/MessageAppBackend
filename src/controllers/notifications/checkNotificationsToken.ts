import { Socket } from 'socket.io'
import prismadb from '../../lib/prismadb'

const checkNotificationsToken = async (socket: Socket) => {
  const userId = socket.data.userId
  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
  })
  if (!user?.notificationsToken) {
    return
  }
  return user.notificationsToken
}

export default checkNotificationsToken
