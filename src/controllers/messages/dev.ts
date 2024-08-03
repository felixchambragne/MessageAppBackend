import { io } from '../../'
import prismadb from '../../lib/prismadb'

const createReply = async (conversationId: string, userId: string) => {
  const conversation = await prismadb.conversation.findFirst({
    where: {
      id: conversationId,
    },
    include: {
      messages: {
        select: {
          content: true,
        },
      },
      users: {
        select: {
          id: true,
        },
      },
    },
  })

  if (!conversation) {
    console.error(`Conversation ${conversationId} not found`)
    return
  }

  const otherUser = conversation.users.find((user) => user.id !== userId)

  if (otherUser) {
    const reply = await prismadb.message.create({
      data: {
        content:
          conversation.messages[
            Math.floor(Math.random() * conversation.messages.length)
          ].content,
        senderId: otherUser.id,
        conversationId,
      },
    })

    io.to(conversationId).emit('message', reply)
    console.log(
      `User ${otherUser.id} sent message to conversation ${conversationId}`
    )
  }
}

export default createReply
