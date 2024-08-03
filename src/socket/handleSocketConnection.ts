import { Socket } from 'socket.io'
import joinConversation from '../controllers/conversations/joinConversation'
import sendMessage from '../controllers/messages/sendMessage'

export const handleSocketConnection = (socket: Socket) => {
  const userId = socket.data.userId

  console.log(`User ${userId} connected`)

  joinConversation(socket, userId)

  socket.on('getUserId', (callback) => {
    callback(userId)
  })

  socket.on('sendMessage', (content: string) =>
    sendMessage(socket, content, userId)
  )

  socket.on('disconnect', () => {
    console.log(`User ${userId} disconnected`)
  })
}
