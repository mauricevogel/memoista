import { RegisterUserDto } from '@src/dtos/auth/register-user.dto'
import { AuthService } from '@src/services/auth.service'
import { RefreshTokenService } from '@src/services/refresh-token.service'
import { UserService } from '@src/services/user.service'
import { RefreshTokenServiceMock } from '@test/mocks/refresh-token.service.mock'
import { mockUser, UserServiceMock } from '@test/mocks/user.service.mock'
import bcrypt from 'bcrypt'
import { Action } from 'routing-controllers'
import Container from 'typedi'

import { JwtService } from './../../src/services/jwt.service'

describe('AuthService', () => {
  Container.set(UserService, UserServiceMock)
  Container.set(RefreshTokenService, RefreshTokenServiceMock)
  const authService = Container.get(AuthService)

  describe('authenticateUser', () => {
    const jwtService = Container.get(JwtService)

    it('should return authenticated user', async () => {
      const user = mockUser
      const authToken = jwtService.generateToken({ user: { id: user.id } })

      const action = {
        request: {
          headers: {
            authorization: `Bearer ${authToken}`
          }
        }
      } as Action

      UserServiceMock.findUserById.mockResolvedValue(user)

      expect(authService.authenticateUser(action)).resolves.toEqual(user)
    })

    it('should return null if token is invalid', async () => {
      const action = {
        request: {
          headers: {
            authorization: `Bearer invalid-token`
          }
        }
      } as Action

      expect(authService.authenticateUser(action)).resolves.toEqual(null)
    })
  })

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
      RefreshTokenServiceMock.createRefreshToken.mockResolvedValue(true)

      const tokenResponseDto = await authService.signInWithCredentials(signinUserDto)

      expect(tokenResponseDto).toHaveProperty('accessToken')
      expect(tokenResponseDto).toHaveProperty('refreshToken')
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
