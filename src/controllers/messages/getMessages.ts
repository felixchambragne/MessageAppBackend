import { Socket } from 'socket.io'
import prismadb from '../../lib/prismadb'

const getMessages = async (socket: Socket, limit: number, offset: number) => {
  const userId = socket.data.userId
  const conversation = await prismadb.conversation.findFirst({
    where: {
      users: {
        some: {
          id: userId,
        },
      },
    },
  })
  if (!conversation) {
    socket.emit('error', 'Failed to get messages')
    return
  }
  const messages = await prismadb.message.findMany({
    where: {
      conversationId: conversation.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    skip: offset,
  })

  return messages
}

export default getMessages
