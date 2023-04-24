import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import client from '../../../utils/apollo-client'
import { LOGIN_USER } from 'utils/mutations'
import axios from 'axios'

export const authOptions = {
  // Configure one or more authentication providers
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: 'Credentials',

      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        if (credentials.refreshAccessToken) {
          return {
            email: credentials.email,
            jid: credentials.accessToken,
            name: credentials.accessToken,
          }
        } else {
          const res = await client.mutate({
            mutation: LOGIN_USER,
            variables: {
              email: credentials.email,
              password: credentials.password,
            },
          })
          const user = res.data.login

          if (user) {
            return { email: user.email, jid: user.accessToken }
          }
        }
      },
      callbacks: {
        jwt: async ({ token, user }) => {
          user && (token.user = user)
          return token
        },
        session: async ({ session, token }) => {
          session.accessToken = token.accessToken // Setting token in session
          return session
        },
      },
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)
