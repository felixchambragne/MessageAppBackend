import { Socket } from 'socket.io'
import prismadb from '../../lib/prismadb'
import setNotificationsToken from './setNotificationsToken'

const checkNotificationsToken = async (socket: Socket) => {
  const userId = socket.data.userId

  console.log(`Checking notifications token for user ${userId}`)

  const user = await prismadb.user.findUnique({
    where: {
      id: userId,
    },
  })

  if (!user) {
    socket.emit('error', 'Failed to check notifications token')
    return
  }

  if (!user.notificationsToken) {
    socket.emit('getNotificationsToken', (notificationsToken: string) => {
      console.log(
        `User ${userId} update notifications token ${notificationsToken}`
      )
      setNotificationsToken(socket, notificationsToken)
    })
    return
  }
}

export default checkNotificationsToken
