import { Router } from 'express'
import deleteConversations from '../tasks/deleteConversations'

export const devRouter: Router = Router()

devRouter.use((req, _res, next) => {
  console.log(req.method, req.url)
  next()
})

devRouter.get('/delete', async (_req, res) => {
  await deleteConversations()
  res.status(200).json({ message: 'Conversations deleted' })
})
