import { RefreshToken } from '@prisma/client'
import { RefreshTokenService } from '@src/services/refresh-token.service'
import { prismaMock } from '@test/mocks/prisma.mock'
import { add } from 'date-fns'
import Container from 'typedi'

describe('RefreshTokenService', () => {
  const refreshTokenService = Container.get(RefreshTokenService)

  describe('createRefreshToken', () => {
    it('should create a refresh token', async () => {
      const refreshToken = {
        userId: crypto.randomUUID(),
        tokenDigest: 'token-digest',
        expiresAt: add(new Date(), { days: 7 })
      } as RefreshToken

      prismaMock.refreshToken.create.mockResolvedValue(refreshToken)

      expect(
        refreshTokenService.createRefreshToken({
          userId: refreshToken.userId,
          token: 'test-token',
          expiresAt: refreshToken.expiresAt
        })
      ).resolves.toEqual(refreshToken)
    })
  })
})
