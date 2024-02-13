import env from '@config/env'
import { User } from '@prisma/client'
import { RegisterUserDto } from '@src/dtos/auth/register-user.dto'
import { SigninUserDto } from '@src/dtos/auth/signin-user.dto'
import { TokenResponseDto } from '@src/dtos/auth/token-response.dto'
import { JwtService } from '@src/services/jwt.service'
import { UserService } from '@src/services/user.service'
import { ProviderIds } from '@src/types/enums'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { add } from 'date-fns'
import { JwtPayload } from 'jsonwebtoken'
import { Action, BadRequestError } from 'routing-controllers'
import { Service } from 'typedi'

import { RefreshTokenService } from './refresh-token.service'

@Service()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private refreshTokenService: RefreshTokenService
  ) {}

  async authenticateUser(action: Action): Promise<User | null> {
    try {
      const authHeader = action.request.headers['authorization']
      const accessToken = this.extractAuthTokenFromHeader(authHeader)
      if (!accessToken) return null

      const payload = this.jwtService.verifyToken(accessToken) as JwtPayload
      if (!payload || !payload.user.id) return null

      return this.userService.findUserById(payload.user.id)
    } catch {
      return null
    }
  }

  async signInWithCredentials(signinUserDto: SigninUserDto): Promise<TokenResponseDto> {
    const user = await this.userService.findUserByProvider(
      ProviderIds.CREDENTIALS,
      signinUserDto.email
    )

    if (!user) {
      throw new BadRequestError('Invalid email or password')
    }

    const isPasswordValid = await bcrypt.compare(signinUserDto.password, user.passwordDigest!)

    if (!isPasswordValid) {
      throw new BadRequestError('Invalid email or password')
    }

    return this.generateAccessAndRefreshToken(user)
  }

  async registerUserWithCredentials(registerUserDto: RegisterUserDto): Promise<User> {
    if (registerUserDto.password !== registerUserDto.passwordConfirmation) {
      throw new BadRequestError('Password confirmation does not match password')
    }

    const existingUser = await this.userService.findUserByProvider(
      ProviderIds.CREDENTIALS,
      registerUserDto.email,
      false
    )

    if (existingUser) {
      throw new BadRequestError('Email is already taken')
    }

    const passwordDigest = await this.hashPassword(registerUserDto.password)
    const verificationToken = this.generateRandomToken()

    const user = await this.userService.createUserWithAccount({
      name: registerUserDto.name,
      email: registerUserDto.email,
      passwordDigest,
      verificationToken,
      account: {
        providerId: ProviderIds.CREDENTIALS,
        providerAccountId: registerUserDto.email
      }
    })

    return user
  }

  async refreshAccessTokens(refreshToken: string): Promise<TokenResponseDto> {
    const validRefreshToken = await this.refreshTokenService.findValidRefreshToken(refreshToken)

    if (!validRefreshToken) {
      throw new BadRequestError('Invalid refresh token')
    }

    await this.refreshTokenService.deleteRefreshToken(refreshToken)

    return this.generateAccessAndRefreshToken(validRefreshToken.user)
  }

  async verifyUser(verificationToken: string): Promise<User> {
    const user = await this.userService.findUserByVerificationToken(verificationToken)

    if (!user) {
      throw new BadRequestError('Invalid verification token')
    }

    user.verificationToken = null
    user.emailVerifiedAt = new Date()

    return this.userService.updateUser(user)
  }

  private async generateAccessAndRefreshToken(user: User): Promise<TokenResponseDto> {
    const accessToken = this.jwtService.generateToken({ user: { id: user.id } })
    const refreshToken = await this.generateRefreshToken(user.id)

    return {
      accessToken,
      refreshToken
    }
  }

  private async generateRefreshToken(userId: string): Promise<string> {
    const token = this.generateRandomToken()
    const expiresAt = add(new Date(), { days: env.refreshTokenExpiryInDays })

    await this.refreshTokenService.createRefreshToken({ userId, token, expiresAt })

    return token
  }

  private hashPassword(input: string): Promise<string> {
    return bcrypt.hash(input, 10)
  }

  private generateRandomToken(): string {
    return crypto.randomBytes(16).toString('hex')
  }

  private extractAuthTokenFromHeader(authHeader: string | null) {
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.split(' ')[1]
    }

    return null
  }
}
