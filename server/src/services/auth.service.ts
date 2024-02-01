import { User } from '@prisma/client'
import { RegisterUserDto } from '@src/dtos/auth/register-user.dto'
import { SigninUserDto } from '@src/dtos/auth/signin-user.dto'
import { JwtService } from '@src/services/jwt.service'
import { UserService } from '@src/services/user.service'
import { ProviderIds } from '@src/types/enums'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { BadRequestError } from 'routing-controllers'
import { Service } from 'typedi'

@Service()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async signInWithCredentials(signinUserDto: SigninUserDto): Promise<string> {
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

    return this.jwtService.generateToken({ userId: user.id })
  }

  async registerUserWithCredentials(registerUserDto: RegisterUserDto): Promise<User> {
    if (registerUserDto.password !== registerUserDto.passwordConfirmation) {
      throw new BadRequestError('Password confirmation does not match password')
    }

    const existingUser = await this.userService.findUserByProvider(
      ProviderIds.CREDENTIALS,
      registerUserDto.email
    )

    if (existingUser) {
      throw new BadRequestError('Email is already taken')
    }

    const passwordDigest = await this.hashPassword(registerUserDto.password)
    const verificationToken = this.generateVerificationToken()

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

  async verifyUser(verificationToken: string): Promise<User> {
    const user = await this.userService.findUserByVerificationToken(verificationToken)

    if (!user) {
      throw new BadRequestError('Invalid verification token')
    }

    user.verificationToken = null
    user.emailVerifiedAt = new Date()

    return this.userService.updateUser(user)
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  private generateVerificationToken(): string {
    return crypto.randomBytes(16).toString('hex')
  }
}
