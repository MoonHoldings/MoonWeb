import '../styles/globals.css'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from 'next-themes'
import { useStore } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import { wrapper } from '../redux/store'
import Layout from 'components/Layout'
import 'react-tippy/dist/tippy.css'
import useSolUsdPrice from 'hooks/useSolUsdPrice'
import client from '../utils/apollo-client'
import { SessionProvider } from 'next-auth/react'

export default wrapper.withRedux(
  ({ Component, pageProps: { session, ...pageProps } }) => {
    useSolUsdPrice()
    const store = useStore()
    console.log(session)
    return (
      <ApolloProvider client={client}>
        {/* <SessionProvider session={session}> */}
        <PersistGate persistor={store.__persistor}>
          <ThemeProvider enableSystem={true} attribute="class">
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </ThemeProvider>
        </PersistGate>
        {/* </SessionProvider> */}
      </ApolloProvider>
    )
  }
)
