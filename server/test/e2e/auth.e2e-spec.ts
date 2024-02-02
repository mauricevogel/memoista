import { User } from '@prisma/client'
import { server } from '@src/app'
import prisma from '@src/prisma'
import { ProviderIds } from '@src/types/enums'
import { UserFactory } from '@test/factories/user.factory'
import { createAccessToken } from '@test/utils/jwt'
import jwt from 'jsonwebtoken'
import request from 'supertest'

describe('Auth (e2e)', () => {
  const userFactory = new UserFactory()
  let user: User

  beforeAll(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(() => {
    server.close()
  })

  describe('GET /api/auth/whoami', () => {
    it('should return the current user', async () => {
      const user = await userFactory.createUserWithAccount()
      const accessToken = createAccessToken({ user: { id: user.id } })

      const response = await request(server)
        .get('/api/auth/whoami')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body).toMatchObject({
        name: user.name,
        email: user.email
      })
    })

    it('should return 401 with invalid token', async () => {
      await request(server)
        .get('/api/auth/whoami')
        .set('Authorization', `Bearer invalid-token`)
        .expect(401)
    })

    it('should return 401 with missing token', async () => {
      await request(server).get('/api/auth/whoami').expect(401)
    })
  })

  describe('POST /api/auth/signin', () => {
    beforeAll(async () => {
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
        user: { id: user.id }
      })
    })

    it('should return 400 with invalid credentials', async () => {
      const signinUserDto = {
        email: user.email,
        password: 'invalid-password'
      }

      await request(server).post('/api/auth/signin').send(signinUserDto).expect(400)
    })

    it('should return 400 with unverified user', async () => {
      const unverifiedUser = await userFactory.createUserWithAccount(false)
      const signinUserDto = {
        email: unverifiedUser.email,
        password: 'testpassword'
      }

      await request(server).post('/api/auth/signin').send(signinUserDto).expect(400)
    })
  })

  describe('POST /api/auth/register', () => {
    it('should register a unverified user', async () => {
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

      const registeredUser = await prisma.user.findUnique({
        where: {
          email: registerUserDto.email,
          accounts: {
            some: {
              providerId: ProviderIds.CREDENTIALS,
              providerAccountId: {
                equals: registerUserDto.email
              }
            }
          }
        }
      })

      expect(registeredUser).toBeDefined()
      expect(registeredUser?.emailVerifiedAt).toBeNull()
      expect(registeredUser?.verificationToken).toBeDefined()
      expect(response.body).toMatchObject({
        name: registeredUser?.name,
        email: registeredUser?.email
      })
    })
  })

  describe('POST /api/auth/verify', () => {
    it('should verify a user account', async () => {
      const unverifiedUser = await userFactory.createUserWithAccount(false)

      const response = await request(server)
        .post('/api/auth/verify')
        .send({ verificationToken: unverifiedUser.verificationToken })
        .expect(200)

      expect(response.body).toMatchObject({
        name: unverifiedUser.name,
        email: unverifiedUser.email
      })
    })

    it('should return 400 with invalid verification token', async () => {
      await request(server)
        .post('/api/auth/verify')
        .send({ verificationToken: 'invalid-token' })
        .expect(400)
    })
  })
})
