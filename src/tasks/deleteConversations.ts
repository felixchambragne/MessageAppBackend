import admin from 'firebase-admin'
import { io } from '..'
import prismadb from '../lib/prismadb'

const deleteConversations = async () => {
  await prismadb.conversation.deleteMany()
  io.emit('conversationsDeleted')

  const notificationMessage = {
    notification: {
      title: 'New Contact Available!',
      body: "You've been paired with a new contact. Start the conversation now!",
    },
    topic: 'all',
  }
  admin
    .messaging()
    .send(notificationMessage)
}

export default deleteConversations
