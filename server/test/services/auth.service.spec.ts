import { RegisterUserDto } from '@src/dtos/auth/register-user.dto'
import { AuthService } from '@src/services/auth.service'
import { UserService } from '@src/services/user.service'
import { mockUser, UserServiceMock } from '@test/mocks/user.service.mock'
import Container from 'typedi'

describe('AuthService', () => {
  const userServiceMock = UserServiceMock
  Container.set(UserService, userServiceMock)
  const authService = Container.get(AuthService)

  describe('registerUserWithCredentials', () => {
    it('should register a user', async () => {
      const registerUserDto: RegisterUserDto = {
        name: 'user',
        email: 'test@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword'
      }

      userServiceMock.findUserByProvider.mockResolvedValue(null)
      userServiceMock.createUserWithAccount.mockResolvedValue(registerUserDto)

      const user = await authService.registerUserWithCredentials(registerUserDto)
      expect(user).toEqual(registerUserDto)
    })

    it('should throw an error if email is already taken', async () => {
      const registerUserDto: RegisterUserDto = {
        name: 'user',
        email: 'test@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword'
      }

      userServiceMock.findUserByProvider.mockResolvedValue(mockUser)

      expect(authService.registerUserWithCredentials(registerUserDto)).rejects.toThrow(
        'Email is already taken'
      )
    })

    it('should throw an error if password confirmation does not match password', () => {
      const registerUserDto: RegisterUserDto = {
        name: 'user',
        email: 'test@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword2'
      }

      expect(authService.registerUserWithCredentials(registerUserDto)).rejects.toThrow(
        'Password confirmation does not match password'
      )
    })
  })
})
