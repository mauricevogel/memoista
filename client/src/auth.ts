import NextAuth from 'next-auth'

import authConfig from '@/auth.config'

export const {
  handlers: { GET, POST },
  auth,
  signIn
} = NextAuth({
  pages: {
    signIn: '/auth/login'
  },
  callbacks: {
    // Add additional data to the JWT
    jwt: async ({ token, user }) => {
      if (user) {
        token.userId = user.id
        token.accessToken = user.accessToken
        token.accessTokenExpires = user.accessTokenExpires
        token.refreshToken = user.refreshToken
      }

      /**
       * Handle token expiry
       * Date.now() returns timestamp in milliseconds, the expiry date is in seconds
       */
      if (token.accessTokenExpires && Date.now() >= token.accessTokenExpires * 1000) {
        return null
      }

      return token
    },
    // Expose additional data on the session
    session: async ({ session, token }) => {
      session.user.id = token.userId
      session.accessToken = token.accessToken
      session.accessTokenExpires = token.accessTokenExpires

      return session
    }
  },
  session: { strategy: 'jwt' },
  ...authConfig
})
