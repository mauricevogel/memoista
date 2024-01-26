import { User } from '@prisma/client'
import { UserWithAccountDto } from '@src/dtos/auth/user-with-account.dto'
import { UserService } from '@src/services/user.service'
import { ProviderIds } from '@src/types/enums'
import { prismaMock } from '@test/mocks/prisma.mock'

describe('UserService', () => {
  const userService = new UserService()

  describe('findUserById', () => {
    it('should return a user', async () => {
      const user: User = {
        id: '5ba0aa26-32ac-451a-a7be-929db2e7d48d',
        name: 'John Doe',
        email: 'test@example.com'
      } as User

      prismaMock.user.findUnique.mockResolvedValue(user)

      expect(userService.findUserById(user.id)).resolves.toEqual(user)
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: user.id
        }
      })
    })
  })

  describe('findUserByProvider', () => {
    it('should return a user account', async () => {
      const providerId = ProviderIds.CREDENTIALS
      const providerAccountId = '1234567890'

      const user: User = {
        id: '5ba0aa26-32ac-451a-a7be-929db2e7d48d',
        name: 'John Doe',
        email: 'test@example.com'
      } as User

      prismaMock.user.findFirst.mockResolvedValue(user)

      expect(
        userService.findUserByProvider(ProviderIds.CREDENTIALS, providerAccountId)
      ).resolves.toEqual(user)

      expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
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
    })
  })

  describe('createUserWithAccount', () => {
    it('should create a user with an account', async () => {
      const userWithAccount: UserWithAccountDto = {
        name: 'John Doe',
        email: 'test@example.com',
        account: {
          providerId: ProviderIds.CREDENTIALS,
          providerAccountId: 'test@example.com'
        }
      }

      const { account, ...user } = userWithAccount

      prismaMock.user.create.mockResolvedValue(user as User)

      expect(userService.createUserWithAccount(userWithAccount)).resolves.toEqual(user)

      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          ...user,
          accounts: {
            create: {
              ...account
            }
          }
        }
      })
    })
  })
})
