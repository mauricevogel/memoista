// eslint-disable-next-line simple-import-sort/imports
import { PrismaClient } from '@prisma/client'
import { DeepMockProxy, mockDeep, mockReset } from 'jest-mock-extended'
import prisma from '@src/prisma'

jest.mock('../../src/prisma', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>()
}))

beforeEach(() => {
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
