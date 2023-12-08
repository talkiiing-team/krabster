// @ts-expect-error
import { createServer } from 'cors-anywhere'
import { Router } from 'express'

const proxy = createServer({
  originWhitelist: [],
  requireHeader: [],
  removeHeaders: [],
})

const proxyRouter = Router()

proxyRouter.use('/api/cors/:proxyUrl*', (req, res) => {
  console.log(req.originalUrl)

  req.url = req.originalUrl.replace('/api/cors', '')

  proxy.emit('request', req, res)
})

export { proxyRouter }
