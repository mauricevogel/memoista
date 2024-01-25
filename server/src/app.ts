import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import env from '@config/env'
import { useExpressServer } from 'routing-controllers'
import { SampleController } from '@src/controllers/sample.controller'

const PORT = env.port || 3000
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

useExpressServer(app, {
  controllers: [SampleController],
  routePrefix: '/api',
  development: false,
  defaultErrorHandler: false,
  validation: {
    validationError: {
      target: false
    }
  }
})

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})