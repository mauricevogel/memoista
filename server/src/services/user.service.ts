import { User } from '@prisma/client'
import { UserWithAccountDto } from '@src/dtos/auth/user-with-account.dto'
import prisma from '@src/prisma'

export class UserService {
  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async createUserWithAccount(userWithAccountDto: UserWithAccountDto) {
    const { account, ...user } = userWithAccountDto

    return prisma.user.create({
      data: {
        ...user,
        accounts: {
          create: {
            ...account
          }
        }
      }
    })
  }
}
