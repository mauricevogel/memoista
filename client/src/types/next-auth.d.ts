export type ExtendedUser = DefaultSession['user'] & {
  accessToken?: string
  accessTokenExpires?: number
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}
