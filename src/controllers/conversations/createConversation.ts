import prismadb from '../../lib/prismadb'

const createConversation = async (userId: string) => {
  const newContact = await prismadb.user.findFirst({
    where: {
      id: { not: userId },
      conversationId: null,
    },
    orderBy: {
      lastActivityAt: 'asc',
    },
  })

  const users = [{ id: userId }]
  if (newContact) {
    users.push({ id: newContact.id })
  }

  const conversation = await prismadb.conversation.create({
    data: {
      users: {
        connect: users,
      },
    },
    include: {
      messages: {
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  return conversation
}

export default createConversation
