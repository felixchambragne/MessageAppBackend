import admin from 'firebase-admin'
import { Socket } from 'socket.io'
import { io } from '../..'
import prismadb from '../../lib/prismadb'
import EncryptedMessage from '../../types/EncryptedMessage'

const sendMessage = async (
  socket: Socket,
  encryptedMessage: EncryptedMessage
) => {
  const userId = socket.data.userId
  const conversation = await prismadb.conversation.findFirst({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    include: {
      users: {
        select: {
          id: true,
          notificationsToken: true,
        },
      },
    },
  })
  if (!conversation) {
    socket.emit('error', 'Failed to get messages')
    return
  }
  const message = await prismadb.message.create({
    data: {
      cipher: encryptedMessage.cipher,
      iv: encryptedMessage.iv,
      salt: encryptedMessage.salt,
      senderId: userId,
      conversationId: conversation.id,
    },
  })

  const recipient = conversation.users.find((user) => user.id !== userId)
  if (recipient && recipient.notificationsToken) {
    const notificationMessage = {
      notification: {
        title: 'New Message',
        body: 'You have received a new message!',
      },
      token: recipient.notificationsToken,
    }
    admin
      .messaging()
      .send(notificationMessage)
  }
  io.to(conversation.id).emit('message', message)
}

export default sendMessage
