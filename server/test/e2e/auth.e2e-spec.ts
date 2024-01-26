import { server } from '@src/app'
import prisma from '@src/prisma'
import { ProviderIds } from '@src/types/enums'
import request from 'supertest'

describe('Auth (e2e)', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(() => {
    server.close()
  })

  describe('POST /api/auth/register', () => {
    it('should register a user', async () => {
      const registerUserDto = {
        name: 'new-user',
        email: 'new-user@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword'
      }

      const response = await request(server)
        .post('/api/auth/register')
        .send(registerUserDto)
        .expect(201)

      expect(
        prisma.user.count({
          where: {
            email: registerUserDto.email
          }
        })
      ).resolves.toBe(1)

      expect(
        prisma.account.count({
          where: {
            providerId: ProviderIds.CREDENTIALS,
            providerAccountId: registerUserDto.email
          }
        })
      ).resolves.toBe(1)

      expect(response.body.name).toEqual(registerUserDto.name)
      expect(response.body.email).toEqual(registerUserDto.email)
    })
  })
})
