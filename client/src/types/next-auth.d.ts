import { DefaultJWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface User {
    id: string
    accessToken: string
    accessTokenExpires: number
    refreshToken: string
  }

  interface Session {
    user: DefaultSession['user']
    accessToken?: string
    accessTokenExpires?: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    userId?: string
    accessToken?: string
    accessTokenExpires?: number
    refreshToken?: string
  }
}
