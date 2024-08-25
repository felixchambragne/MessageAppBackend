import { Socket } from 'socket.io'
import prismadb from '../../lib/prismadb'

const setNotificationsToken = async (
  socket: Socket,
  notificationsToken: string
) => {
  const userId = socket.data.userId

  console.log(`User ${userId} set notifications token to ${notificationsToken}`)

  await prismadb.user.update({
    where: {
      id: userId,
    },
    data: {
      notificationsToken,
    },
  })
}

export default setNotificationsToken
