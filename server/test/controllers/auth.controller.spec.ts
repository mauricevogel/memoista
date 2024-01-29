import { AuthController } from '@src/controllers/auth.controller'
import { AuthService } from '@src/services/auth.service'
import { AuthServiceMock } from '@test/mocks/auth.service.mock'
import Container from 'typedi'

Container.set(AuthService, AuthServiceMock)

describe('AuthController', () => {
  const authController = new AuthController()

  describe('POST signin', () => {
    it('should signin a user', async () => {
      const signinDto = {
        email: 'test@example.com',
        password: 'testpassword'
      }

      AuthServiceMock.signInWithCredentials.mockResolvedValue('testtoken')

      const response = await authController.signInWithCredentials(signinDto)

      expect(AuthServiceMock.signInWithCredentials).toHaveBeenCalledWith(signinDto)
      expect(response).toEqual({ accessToken: 'testtoken' })
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
})
