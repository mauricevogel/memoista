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
      if (token.user) {
        /**
         * Handle token expiry
         * Date.now() returns timestamp in milliseconds, the expiry date is in seconds
         */
        if (Date.now() >= token.user.accessTokenExpires * 1000) {
          return null
        }
      }

      user && (token.user = user)
      return token
    },
    // Expose additional data on the session
    session: async ({ session, token }) => {
      session.userId = token.user
      return session
    }
  },
  session: { strategy: 'jwt' },
  ...authConfig
})
