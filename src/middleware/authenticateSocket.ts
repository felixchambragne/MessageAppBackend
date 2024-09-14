import { Socket } from 'socket.io'
import authenticateUser from './authenticateUser'

const authenticateSocket = async (socket: Socket, next: Function) => {
  try {
    const token = socket.handshake.auth.token
    if (!token) {
      next(new Error('unauthorized'))
    }
    const userId = await authenticateUser(token)
    socket.data.userId = userId
    next()
  } catch (error: any) {
    if (error.message === 'user-not-found' || error.message === 'unauthorized') {
      next(new Error(error.message))
    }
    next(new Error('error'))
  }
}

export default authenticateSocket
