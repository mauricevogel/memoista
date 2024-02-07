import { jwtDecode } from 'jwt-decode'
import { NextAuthConfig } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

interface IAccessTokenData {
  user: {
    id: string
  }
  exp: number
}

export default {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: 'Username', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials)
        })
        const responsePayload = await response.json()

        if (response.ok && responsePayload) {
          const accessTokenData: IAccessTokenData = jwtDecode(responsePayload.accessToken)

          return {
            id: accessTokenData.user.id,
            accessToken: responsePayload.accessToken,
            accessTokenExpires: accessTokenData.exp
          }
        }

        return null
      }
    })
  ]
} satisfies NextAuthConfig
