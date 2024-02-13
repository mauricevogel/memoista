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
  refreshTokenExpiryInDays: Number(process.env.REFRESH_TOKEN_EXPIRY_IN_DAYS) || 30,
  port: Number(process.env.PORT) || 8080
}

export default env
