import env from '@config/env'
import { JwtService } from '@src/services/jwt.service'
import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken'
import tk from 'timekeeper'
import Container from 'typedi'

describe('JwtService', () => {
  const jwtService = Container.get(JwtService)

  describe('generateToken', () => {
    it('should return a signed token', () => {
      const payload = { test: 'test' }
      const token = jwtService.generateToken(payload)

      expect(token).toBeDefined()

      const decoded = jwt.verify(token, process.env.TOKEN_SECRET!) as JwtPayload
      expect(decoded.test).toEqual(payload.test)
    })
  })

  describe('verifyToken', () => {
    it('should return a decoded token', () => {
      const payload = { test: 'test' }
      const token = jwt.sign(payload, env.tokenSecret!, {})

      const decoded = jwtService.verifyToken(token) as JwtPayload
      expect(decoded.test).toEqual(payload.test)
    })

    it('should throw an error if token is invalid', () => {
      expect(() => jwtService.verifyToken('invalid-token')).toThrow(JsonWebTokenError)
    })

    it('should throw an error if token is expired', () => {
      const expiredDate = new Date()
      expiredDate.setDate(expiredDate.getDate() + 2)

      const token = jwt.sign({ test: '123' }, env.tokenSecret!, {
        expiresIn: '1d'
      })

      tk.freeze(expiredDate)
      expect(() => jwtService.verifyToken(token)).toThrow(JsonWebTokenError)
      tk.reset()
    })

    it('should throw an error if token signature does not match', () => {
      const token = jwt.sign('test', 'some-secret', {})
      expect(() => jwtService.verifyToken(token)).toThrow(JsonWebTokenError)
    })
  })
})
