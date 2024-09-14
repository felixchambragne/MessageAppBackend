import { Socket } from 'socket.io'
import prismadb from '../../lib/prismadb'

const setNotificationsToken = async (
  socket: Socket,
  notificationsToken: string
) => {
  const userId = socket.data.userId
  
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
