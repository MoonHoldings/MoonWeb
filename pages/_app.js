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
import SidebarsLayout from 'components/partials/SidebarsLayout'
import { ConfigProvider } from 'antd'
import HeapAnalytics from 'components/HeapAnalytics'

export default wrapper.withRedux(
  ({ Component, pageProps: { session, ...pageProps } }) => {
    useSolUsdPrice()
    const store = useStore()
    return (
      <ConfigProvider
        theme={{
          token: {
            colorFill: '#9BEFE4',
            colorFillContent: '#62EAD2',
          },
        }}
      >
        <ApolloProvider client={client}>
          <PersistGate persistor={store.__persistor}>
            <ThemeProvider enableSystem={true} attribute="class">
              <Layout>
                <SidebarsLayout>
                  <Component {...pageProps} />
                  <HeapAnalytics />
                </SidebarsLayout>
              </Layout>
            </ThemeProvider>
          </PersistGate>
        </ApolloProvider>
      </ConfigProvider>
    )
  }
)
