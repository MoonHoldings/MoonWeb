import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client'
import { GRAPHQL_URL } from 'application/constants/api'

const client = new ApolloClient({
  ssrMode: true,
  link: createHttpLink({
    uri: GRAPHQL_URL,
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache(),
})

export default client
