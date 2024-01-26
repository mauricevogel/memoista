import { User } from '@prisma/client'
import { RegisterUserDto } from '@src/dtos/auth/register-user.dto'
import { UserService } from '@src/services/user.service'
import { ProviderIds } from '@src/types/enums'
import bcrypt from 'bcrypt'
import { BadRequestError } from 'routing-controllers'
import { Service } from 'typedi'

@Service()
export class AuthService {
  constructor(private userService: UserService) {}

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
    const user = await this.userService.createUserWithAccount({
      name: registerUserDto.name,
      email: registerUserDto.email,
      passwordDigest,
      account: {
        providerId: ProviderIds.CREDENTIALS,
        providerAccountId: registerUserDto.email
      }
    })

    return user
  }

  private hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }
}
