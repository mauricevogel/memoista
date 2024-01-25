import { User } from '@prisma/client'
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
})
