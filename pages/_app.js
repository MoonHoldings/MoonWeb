import '../styles/globals.css'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from 'next-themes'
import { useStore } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import { wrapper } from '../redux/store'
import Layout from 'components/Layout'
import useSolUsdPrice from 'hooks/useSolUsdPrice'
import client from '../utils/apollo-client'

export default wrapper.withRedux(({ Component, pageProps }) => {
  useSolUsdPrice()
  const store = useStore()

  return (
    <ApolloProvider client={client}>
      <PersistGate persistor={store.__persistor}>
        <ThemeProvider enableSystem={true} attribute="class">
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </PersistGate>
    </ApolloProvider>
  )
})
