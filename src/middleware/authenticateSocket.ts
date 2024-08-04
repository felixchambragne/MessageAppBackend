import { Socket } from 'socket.io'
import authenticateUser from './authenticateUser'

const authenticateSocket = async (socket: Socket, next: Function) => {
  const token = socket.handshake.auth.token

  console.log('token', token)

  if (!token) {
    return next(new Error('Unauthorized'))
  }

  try {
    const userId = await authenticateUser(token)
    console.log('userId', userId)
    socket.data.userId = userId
    next()
  } catch (err) {
    next(new Error('Unauthorized'))
  }
}

export default authenticateSocket
