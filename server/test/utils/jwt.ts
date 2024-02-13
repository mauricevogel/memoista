import { User } from '@prisma/client'
import { JwtService } from '@src/services/jwt.service'
import { RefreshTokenService } from '@src/services/refresh-token.service'
import Container from 'typedi'

export const createAccessTokens = async (user: User) => {
  const jwtService = Container.get(JwtService)
  const refreshTokenService = Container.get(RefreshTokenService)
  const refreshToken = crypto.randomUUID()

  const accessToken = jwtService.generateToken({
    user: { id: user.id }
  })

  await refreshTokenService.createRefreshToken({
    userId: user.id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)
  })

  return { accessToken, refreshToken }
}
