import env from '@config/env'
import { RefreshToken } from '@prisma/client'
import prisma from '@src/prisma'
import crypto from 'crypto'
import { Service } from 'typedi'

@Service()
export class RefreshTokenService {
  async createRefreshToken({
    userId,
    token,
    expiresAt
  }: {
    userId: string
    token: string
    expiresAt: Date
  }): Promise<RefreshToken> {
    const tokenDigest = await this.createTokenDigest(token)

    return await prisma.refreshToken.create({
      data: {
        tokenDigest,
        expiresAt,
        user: {
          connect: { id: userId }
        }
      }
    })
  }

  private async createTokenDigest(token: string): Promise<string> {
    return crypto
      .createHmac('sha256', env.tokenSecret as string)
      .update(token)
      .digest('hex')
  }
}
