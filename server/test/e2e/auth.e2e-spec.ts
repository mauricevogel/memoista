import { User } from '@prisma/client'
import { server } from '@src/app'
import prisma from '@src/prisma'
import { ProviderIds } from '@src/types/enums'
import { UserFactory } from '@test/factories/user.factory'
import jwt from 'jsonwebtoken'
import request from 'supertest'

describe('Auth (e2e)', () => {
  let user: User

  beforeAll(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(() => {
    server.close()
  })

  describe('POST /api/auth/signin', () => {
    beforeAll(async () => {
      const userFactory = new UserFactory()
      user = await userFactory.createUserWithAccount()
    })

    it('should sign in a user', async () => {
      const signinUserDto = {
        email: user.email,
        password: 'testpassword'
      }

      const response = await request(server)
        .post('/api/auth/signin')
        .send(signinUserDto)
        .expect(200)

      const accessToken = response.body.accessToken

      expect(accessToken).toBeDefined()
      expect(jwt.decode(accessToken)).toMatchObject({
        userId: user.id
      })
    })

    it('should return 400 with invalid credentials', async () => {
      const signinUserDto = {
        email: user.email,
        password: 'invalid-password'
      }

      await request(server).post('/api/auth/signin').send(signinUserDto).expect(400)
    })
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
