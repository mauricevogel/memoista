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
        id,
        NOT: {
          emailVerifiedAt: null
        }
      }
    })
  }

  async findUserByProvider(
    providerId: ProviderIds,
    providerAccountId: string,
    verfified = true
  ): Promise<User | null> {
    let query: object = {
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

    if (verfified) {
      query = {
        ...query,
        NOT: {
          emailVerifiedAt: null
        }
      }
    }

    return prisma.user.findFirst({ where: query })
  }

  async findUserByVerificationToken(verificationToken: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        verificationToken
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

  async updateUser(user: User): Promise<User> {
    return prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        ...user
      }
    })
  }
}
