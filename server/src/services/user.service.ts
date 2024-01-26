import { User } from '@prisma/client'
import { UserWithAccountDto } from '@src/dtos/auth/user-with-account.dto'
import prisma from '@src/prisma'
import { ProviderIds } from '@src/types/enums'
import { Service } from 'typedi'

@Service()
export class UserService {
  async findUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: {
        id
      }
    })
  }

  async findUserByProvider(
    providerId: ProviderIds,
    providerAccountId: string
  ): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        accounts: {
          some: {
            providerId,
            providerAccountId: {
              equals: providerAccountId,
              mode: 'insensitive'
            }
          }
        }
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
