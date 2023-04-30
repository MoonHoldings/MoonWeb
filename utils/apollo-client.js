import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GRAPHQL_URL, SUPERUSER_KEY } from 'app/constants/api'
import encrypt from './encrypt'

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
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
  credentials: 'include',
})

export default client
