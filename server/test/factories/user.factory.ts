import { faker } from '@faker-js/faker'
import { User } from '@prisma/client'
import { UserService } from '@src/services/user.service'
import { ProviderIds } from '@src/types/enums'
import bcrypt from 'bcrypt'

export class UserFactory {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  async createUserWithAccount(): Promise<User> {
    const userData = await this.randomUserData()
    return this.userService.createUserWithAccount(userData)
  }

  private async randomUserData() {
    const email = faker.internet.email()

    return {
      name: faker.internet.userName(),
      email,
      passwordDigest: await bcrypt.hash('testpassword', 10),
      account: {
        providerId: ProviderIds.CREDENTIALS,
        providerAccountId: email
      }
    }
  }
}
