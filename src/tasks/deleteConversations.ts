import prismadb from '../lib/prismadb'

const deleteConversations = async () => {
  await prismadb.conversation.deleteMany()
}

export default deleteConversations
