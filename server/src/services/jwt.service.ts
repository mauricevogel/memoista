import env from '@config/env'
import jwt from 'jsonwebtoken'
import { Service } from 'typedi'

@Service()
export class JwtService {
  generateToken(payload: string | object) {
    return jwt.sign(payload, env.tokenSecret as string, {
      expiresIn: '1d'
    })
  }

  verifyToken(token: string) {
    return jwt.verify(token, env.tokenSecret as string)
  }
}
