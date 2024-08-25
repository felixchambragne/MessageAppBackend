import prismadb from '../../lib/prismadb'

const createConversation = async (userId: string) => {
  const newContact = await prismadb.user.findFirst({
    where: {
      id: { not: userId },
      conversationId: null,
    },
    orderBy: {
      lastActivityAt: 'desc',
    },
  })

  if (!newContact) {
    return null
  }

  const conversation = await prismadb.conversation.create({
    data: {
      users: {
        connect: [{ id: userId }, { id: newContact.id }],
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      users: {
        select: {
          id: true,
          publicKey: true,
        },
      },
    },
  })

  return conversation
}

export default createConversation
