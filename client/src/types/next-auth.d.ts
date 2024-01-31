// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { DefaultSession } from 'next-auth'

export type ExtendedUser = DefaultSession['user'] & {
  accessToken?: string
  accessTokenExpires?: number
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
