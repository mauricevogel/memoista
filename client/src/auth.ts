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
      user && (token.user = user)
      return token
    },
    // Expose additional data on the session
    session: async ({ session, token }) => {
      session.user = token.user
      return session
    }
  },
  session: { strategy: 'jwt' },
  ...authConfig
})
