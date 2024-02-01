import { RegisterUserDto } from '@src/dtos/auth/register-user.dto'
import { AuthService } from '@src/services/auth.service'
import { UserService } from '@src/services/user.service'
import { mockUser, UserServiceMock } from '@test/mocks/user.service.mock'
import bcrypt from 'bcrypt'
import Container from 'typedi'

describe('AuthService', () => {
  Container.set(UserService, UserServiceMock)
  const authService = Container.get(AuthService)

  describe('signInWithCredentials', () => {
    it('should return a token on successful sign in', async () => {
      const user = {
        ...mockUser,
        passwordDigest: await bcrypt.hash('testpassword', 10)
      }

      const signinUserDto = {
        email: user.email!,
        password: 'testpassword'
      }

      UserServiceMock.findUserByProvider.mockResolvedValue(user)

      const token = await authService.signInWithCredentials(signinUserDto)

      expect(token).toBeDefined()
    })

    it('should throw an error if user does not exist', async () => {
      const signinUserDto = {
        email: 'any-email@example.com',
        password: 'testpassword'
      }

      UserServiceMock.findUserByProvider.mockResolvedValue(null)

      expect(authService.signInWithCredentials(signinUserDto)).rejects.toThrow(
        'Invalid email or password'
      )
    })

    it('should throw an error if password is invalid', async () => {
      const user = {
        ...mockUser,
        passwordDigest: await bcrypt.hash('testpassword', 10)
      }

      const signinUserDto = {
        email: user.email!,
        password: 'test'
      }

      UserServiceMock.findUserByProvider.mockResolvedValue(user)

      expect(authService.signInWithCredentials(signinUserDto)).rejects.toThrow(
        'Invalid email or password'
      )
    })
  })

  describe('registerUserWithCredentials', () => {
    it('should register a user', async () => {
      const registerUserDto: RegisterUserDto = {
        name: 'user',
        email: 'test@example.com',
        password: 'testpassword',
        passwordConfirmation: 'testpassword'
      }

      UserServiceMock.findUserByProvider.mockResolvedValue(null)
      UserServiceMock.createUserWithAccount.mockResolvedValue(registerUserDto)

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

      UserServiceMock.findUserByProvider.mockResolvedValue(mockUser)

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

  describe('verifyUser', () => {
    it('should verify a user', async () => {
      UserServiceMock.findUserByVerificationToken.mockResolvedValue(mockUser)
      UserServiceMock.updateUser.mockResolvedValue(mockUser)

      const user = await authService.verifyUser('verification-token')
      expect(user).toEqual(mockUser)
    })

    it('should throw an error if the verification token is invalid', async () => {
      UserServiceMock.findUserByVerificationToken.mockResolvedValue(null)

      expect(authService.verifyUser('invalid-token')).rejects.toThrow('Invalid verification token')
    })
  })
})
