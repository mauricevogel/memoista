import { faker } from '@faker-js/faker'
import { User } from '@prisma/client'
import { UserService } from '@src/services/user.service'
import { ProviderIds } from '@src/types/enums'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

export class UserFactory {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async createUserWithAccount(verified = true): Promise<User> {
    const userData = await this.randomUserData(verified)
    return this.userService.createUserWithAccount(userData)
  }

  private async randomUserData(verified: boolean) {
    const email = faker.internet.email()
    const emailVerifiedAt = verified ? new Date() : null
    const verificationToken = verified ? null : crypto.randomBytes(32).toString('hex')

    return {
      name: faker.internet.userName(),
      email,
      passwordDigest: await bcrypt.hash('testpassword', 10),
      emailVerifiedAt,
      verificationToken,
      account: {
        providerId: ProviderIds.CREDENTIALS,
        providerAccountId: email
      }
    }
  }
}
