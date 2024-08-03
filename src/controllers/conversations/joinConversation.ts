import { Socket } from 'socket.io'
import createConversation from '../../controllers/conversations/createConversation'
import prismadb from '../../lib/prismadb'
import { Message } from '@prisma/client'

const joinConversation = async (socket: Socket, userId: string) => {
  try {
    let conversation = await prismadb.conversation.findFirst({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
        }
      },
    })
    if (!conversation) {
      conversation = await createConversation(userId)
    }

    socket.join(conversation.id)
    socket.emit('joinedConversation', conversation.messages)
    console.log(`User ${userId} joined conversation ${conversation.id}`)
  } catch (error) {
    console.error('Error joining conversation:', error)
    socket.emit('error', 'Failed to join conversation')
  }
}

export default joinConversation
