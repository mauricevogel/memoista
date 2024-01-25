import bodyParser from 'body-parser'
import express, { Express, Request, Response } from 'express'
import env from '@config/env'

const app: Express = express()
const PORT = env.port || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Hello World!' })
})

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
