const NextAuth = require('next-auth')
const CredentialsProvider = require('next-auth/providers/credentials')

module.exports = NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {},
      async authorize(credentials, _) {
        const { email, password } = credentials
        if (!email || !password) {
          throw new Error('Missing username or password')
        }
        const user = null
        // if user doesn't exist or password doesn't match
        if (!user) {
          throw new Error('Invalid username or password')
        }
        return user
      },
    }),
  ],
  session: { strategy: 'jwt' },
})
