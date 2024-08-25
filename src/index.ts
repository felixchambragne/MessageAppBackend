import compression from 'compression'
import express from 'express'
import admin from 'firebase-admin'
import helmet from 'helmet'
import schedule from 'node-schedule'
import { Server } from 'socket.io'
import signUp from './controllers/auth/signUp'
import authenticateRequest from './middleware/authenticateRequest'
import authenticateSocket from './middleware/authenticateSocket'
import { devRouter } from './routes/dev'
import { handleSocketConnection } from './socket/handleSocketConnection'
import deleteConversations from './tasks/deleteConversations'

const app = express()

app.use(helmet())
app.use(express.json())
app.use(compression())

admin.initializeApp({
  credential: admin.credential.cert(
    JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string)
  ),
})

if (process.env.NODE_ENV !== 'production') {
  app.use('/dev', devRouter)
}

app.post('/auth/signUp', signUp)

app.use(authenticateRequest)

const PORT = process.env.PORT
export const server = app.listen(PORT, () => {
  console.log(
    process.env.NODE_ENV == 'production'
      ? 'Server is running in production mode.'
      : 'Server is running in development mode.'
  )
  console.log(`Server is running on port ${PORT}.`)
})

export const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.use(authenticateSocket)
io.on('connection', (socket) => handleSocketConnection(socket))

// Every day at 10:00 AM
export const SPEC = '0 10 * * *'
export const deleteConversationsJob = schedule.scheduleJob(SPEC, async () => {
  await deleteConversations()
})
