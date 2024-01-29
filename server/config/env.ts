import dotenv from 'dotenv'
import path from 'path'

if (process.env.NODE_ENV === 'test') {
  dotenv.config({
    path: path.resolve(__dirname, '../.env.test')
  })
} else if (process.env.NODE_ENV !== 'production') {
  dotenv.config()
}

const env = {
  node: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  tokenSecret: process.env.TOKEN_SECRET,
  port: Number(process.env.PORT) || 3000
}

export default env
