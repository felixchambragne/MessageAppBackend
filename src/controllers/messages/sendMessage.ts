import { Socket } from 'socket.io'
import prismadb from '../../lib/prismadb'
import containsBannedWord from '../../utils/containsBannedWord'
import createReply from './dev'
import { io } from '../..'

const sendMessage = async (socket: Socket, content: string, userId: string) => {
  const conversation = await prismadb.conversation.findFirst({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!conversation) {
    socket.emit(
      'error',
      'You are not authorized to send messages to this conversation'
    )
    return
  }

  if (containsBannedWord(content)) {
    socket.emit('error', 'Message contains banned word')
    return
  }

  const message = await prismadb.message.create({
    data: {
      content,
      senderId: userId,
      conversationId: conversation.id,
    },
  })

  io.to(conversation.id).emit('message', message)
  console.log(`User ${userId} sent message to conversation ${conversation.id}`)

  if (process.env.NODE_ENV !== 'production') {
    setTimeout(
      async () => {
        await createReply(conversation.id, userId)
      },
      Math.floor(Math.random() * 4000) + 1000
    )
  }
}

export default sendMessage
