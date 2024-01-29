import env from '@config/env'
import { PrismaClient } from '@prisma/client'
import { logger } from '@src/logger'

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query'
    }
  ]
})

if (env.isDevelopment) {
  prisma.$on('query', async (event) => {
    logger.info('Query executed', {
      data: {
        query: event.query,
        params: event.params,
        duration: `${event.duration}ms`
      }
    })
  })
}

export default prisma
