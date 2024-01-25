import { User } from '@prisma/client'
import { UserWithAccountDto } from '@src/dtos/auth/user-with-account.dto'
import { UserService } from '@src/services/user.service'
import { prismaMock } from '@test/utils/prisma.mock'

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

  describe('createUserWithAccount', () => {
    it('should create a user with an account', async () => {
      const userWithAccount: UserWithAccountDto = {
        name: 'John Doe',
        email: 'test@example.com',
        account: {
          providerId: 'credentials',
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
