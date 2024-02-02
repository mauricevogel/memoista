import 'reflect-metadata'

import env from '@config/env'
import { AuthController } from '@src/controllers/auth.controller'
import { loggerOptions } from '@src/logger'
import { AuthService } from '@src/services/auth.service'
import bodyParser from 'body-parser'
import express from 'express'
import expressWinston from 'express-winston'
import { useExpressServer } from 'routing-controllers'
import Container from 'typedi'

const PORT = env.port || 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(expressWinston.logger(loggerOptions))

useExpressServer(app, {
  controllers: [AuthController],
  cors: true,
  routePrefix: '/api',
  development: false,
  defaultErrorHandler: true,
  validation: {
    validationError: {
      target: false
    }
  },
  currentUserChecker: async (action) => {
    const authService = Container.get(AuthService)
    return authService.authenticateUser(action)
  }
})

export const server = app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
