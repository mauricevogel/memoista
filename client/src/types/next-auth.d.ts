import { DefaultJWT } from 'next-auth/jwt'

export type ExtendedUser = DefaultSession['user'] & {
  accessToken?: string
  accessTokenExpires?: number
}

declare module 'next-auth' {
  interface Session {
    user: ExtendedUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user?: ExtendedUser
  }
}
