import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { GRAPHQL_URL, SUPERUSER_KEY } from 'app/constants/api'

const httpLink = createHttpLink({
  uri: GRAPHQL_URL,
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: SUPERUSER_KEY ? `Bearer ${SUPERUSER_KEY}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  credentials: 'include',
})

export default client
