import { io } from '..'
import prismadb from '../lib/prismadb'

const deleteConversations = async () => {
  await prismadb.conversation.deleteMany()
  io.emit('conversationsDeleted')
}

export default deleteConversations
