import { User } from '@prisma/client'

export const mockUser: Partial<User> = {
  id: '23f3fa12-2f42-4697-9aa4-477a577dc99c',
  name: 'test-user',
  email: 'test-user@example.com'
}

export const UserServiceMock = {
  findUserById: jest.fn(),
  findUserByProvider: jest.fn(),
  findUserByVerificationToken: jest.fn(),
  createUserWithAccount: jest.fn(),
  updateUser: jest.fn()
}
