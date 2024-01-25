import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  rootDir: '.',
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/', '<rootDir>/public'],
  moduleNameMapper: {
    '^@config/(.*)$': '<rootDir>/config/$1',
    '^@src/(.*)$': '<rootDir>/src/$1',
    '^@test/(.*)$': '<rootDir>/test/$1'
  },
  testRegex: '.spec.ts$',
  setupFilesAfterEnv: ['<rootDir>/test/utils/prisma.mock.ts']
}

export default jestConfig
