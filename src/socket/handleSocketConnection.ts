import { Socket } from 'socket.io'
import { deleteConversationsJob } from '..'
import joinConversation from '../controllers/conversations/joinConversation'
import getMessages from '../controllers/messages/getMessages'
import sendMessage from '../controllers/messages/sendMessage'
import setNotificationsToken from '../controllers/notifications/setNotificationsToken'
import EncryptedMessage from '../types/EncryptedMessage'
import getRemainingTimeInSeconds from '../utils/getRemainingTimeInSeconds'
import checkNotificationsToken from '../controllers/notifications/checkNotificationsToken'

export const handleSocketConnection = async (socket: Socket) => {
  const userId = socket.data.userId

  socket.emit('userId', userId)

  const notificationsToken = await checkNotificationsToken(socket)
  if (!notificationsToken) {
    socket.emit('getNotificationsToken')
  }

  socket.on('setNotificationsToken', (notificationsToken: string) => {
    setNotificationsToken(socket, notificationsToken)
  })

  socket.on('getCountdown', (callback) => {
    callback(getRemainingTimeInSeconds(deleteConversationsJob))
  })

  socket.on('joinConversation', () => joinConversation(socket))

  socket.on('getMessages', async (limit: number, offset: number, callback) => {
    const messages = await getMessages(socket, limit, offset)
    callback(messages)
  })

  socket.on('sendMessage', (encryptedMessage: EncryptedMessage) =>
    sendMessage(socket, encryptedMessage)
  )

  socket.on('disconnect', () => {
  })
}
