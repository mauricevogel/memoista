import 'reflect-metadata'
import bodyParser from 'body-parser'
import express from 'express'
import env from '@config/env'
import { useExpressServer } from 'routing-controllers'
import { AuthController } from './controllers/auth.controller'

const PORT = env.port || 3000
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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
  }
})

export const server = app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
