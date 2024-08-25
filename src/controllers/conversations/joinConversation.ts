import { Socket } from 'socket.io'
import createConversation from '../../controllers/conversations/createConversation'
import prismadb from '../../lib/prismadb'

const joinConversation = async (socket: Socket) => {
  const userId = socket.data.userId
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
        users: {
          select: {
            id: true,
            publicKey: true,
          },
        },
      },
    })
    if (!conversation) {
      conversation = await createConversation(userId)
    }

    if (!conversation || !conversation.users) {
      socket.emit('error', 'Failed to join conversation')
      return
    }

    const otherUserPublicKey = conversation.users.find(
      (user) => user.id !== userId
    )?.publicKey
    if (!otherUserPublicKey) {
      socket.emit('error', 'Failed to join conversation')
      return
    }

    const user = await prismadb.user.findUnique({
      where: {
        id: userId,
      },
    })
    if (!user) {
      socket.emit('error', 'Failed to join conversation')
      return
    }
    const isNewConversation = user.lastJoinAt < conversation.createdAt

    await prismadb.user.update({
      where: {
        id: userId,
      },
      data: {
        lastJoinAt: new Date(),
      },
    })

    socket.join(conversation.id)
    socket.emit('joinedConversation', {
      otherUserPublicKey,
      isNewConversation,
    })
  } catch (error) {
    console.error('Error joining conversation:', error)
    socket.emit('error', 'Failed to join conversation')
  }
}

export default joinConversation
