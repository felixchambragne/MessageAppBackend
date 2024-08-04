import { Socket } from 'socket.io'
import joinConversation from '../controllers/conversations/joinConversation'
import sendMessage from '../controllers/messages/sendMessage'
import { deleteConversationsJob } from '..'
import getRemainingTimeInSeconds from '../utils/getRemainingTimeInSeconds'

export const handleSocketConnection = (socket: Socket) => {
  const userId = socket.data.userId

  console.log(`User ${userId} connected`)
  socket.emit('userId', userId)

  socket.on('getCountdown', (callback) => {
    callback(getRemainingTimeInSeconds(deleteConversationsJob))
  })

  socket.on('joinConversation', () => joinConversation(socket))

  socket.on('sendMessage', (content: string) => sendMessage(socket, content))

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`)
  })
}
