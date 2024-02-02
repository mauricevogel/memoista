import { JwtService } from '@src/services/jwt.service'
import Container from 'typedi'

export const createAccessToken = (payload: string | object) => {
  const jwtService = Container.get(JwtService)
  return jwtService.generateToken(payload)
}
