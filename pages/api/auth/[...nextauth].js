import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  // Configure one or more authentication providers
  providers: [
    Providers.Credentials({
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
        return null
      },
    }),
    // ...add more providers here
  ],
}

export default NextAuth(authOptions)
