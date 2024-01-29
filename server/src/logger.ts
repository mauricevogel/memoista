import { FilterRequest } from 'express-winston'
import winston from 'winston'

const REQUEST_BLACKLIST = ['headers', 'httpVersion']

export const loggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(winston.format.json(), winston.format.prettyPrint()),
  requestFilter: (req: FilterRequest, propName: string) => {
    if (REQUEST_BLACKLIST.includes(propName)) {
      return undefined
    }

    return req[propName]
  }
}

export const logger = winston.createLogger(loggerOptions)
