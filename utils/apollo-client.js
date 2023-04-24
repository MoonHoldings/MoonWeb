import { ApolloClient, InMemoryCache } from '@apollo/client'
import { GRAPHQL_URL } from 'app/constants/be'

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
  credentials: 'include',
})

export default client
