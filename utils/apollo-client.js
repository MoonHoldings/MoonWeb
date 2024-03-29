import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GRAPHQL_URL, SUPERUSER_KEY } from 'application/constants/api'
import encrypt from './encrypt'

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
  credentials: 'include',
})

const authLink = setContext((_, { headers }) => {
  const encryptedKey = encrypt(SUPERUSER_KEY)

  return {
    headers: {
      ...headers,
      authorization: encryptedKey ? `Bearer ${encryptedKey}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
