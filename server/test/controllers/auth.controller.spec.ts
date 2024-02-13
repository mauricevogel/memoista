import { User } from '@prisma/client'
import { AuthController } from '@src/controllers/auth.controller'
import { AuthService } from '@src/services/auth.service'
import { AuthServiceMock } from '@test/mocks/auth.service.mock'
import { mockUser } from '@test/mocks/user.service.mock'
import Container from 'typedi'

describe('AuthController', () => {
  Container.set(AuthService, AuthServiceMock)
  const authController = new AuthController()

  describe('GET whoami', () => {
    it('should return the current user', async () => {
      const currentUser = mockUser

      const response = await authController.whoAmI(currentUser as User)

      expect(response).toEqual(currentUser)
    })
  })

  describe('POST signin', () => {
    it('should signin a user', async () => {
      const signinDto = {
        email: 'test@example.com',
        password: 'testpassword'
      }

      const tokenResponseDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      }

      AuthServiceMock.signInWithCredentials.mockResolvedValue(tokenResponseDto)

      const response = await authController.signInWithCredentials(signinDto)

      expect(AuthServiceMock.signInWithCredentials).toHaveBeenCalledWith(signinDto)
      expect(response).toEqual(tokenResponseDto)
    })
  })

  describe('POST register', () => {
    it('should register a user', async () => {
      const registerUserDto = {
        name: 'NewUser',
        email: 'test@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword'
      }

      AuthServiceMock.registerUserWithCredentials.mockResolvedValue(registerUserDto)

      await authController.registerUserWithCredentials(registerUserDto)

      expect(AuthServiceMock.registerUserWithCredentials).toHaveBeenCalledWith(registerUserDto)
    })
  })

  describe('POST refresh-tokens', () => {
    it('should refresh tokens', async () => {
      const tokenResponseDto = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      }
      AuthServiceMock.refreshAccessTokens.mockResolvedValue(tokenResponseDto)

      expect(authController.refreshTokens({ refreshToken: 'token' })).resolves.toEqual(
        tokenResponseDto
      )
    })
  })

  describe('POST verify', () => {
    it('should verify a user account', async () => {
      AuthServiceMock.verifyUser.mockResolvedValue(mockUser)

      await authController.verifyUser({ verificationToken: 'testtoken' })

      expect(AuthServiceMock.verifyUser).toHaveBeenCalledWith('testtoken')
    })
  })
})
