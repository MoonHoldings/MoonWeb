import '../styles/globals.css'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from 'next-themes'
import { useStore } from 'react-redux'
import { wrapper } from '../redux/store'
import Layout from 'components/Layout'

export default wrapper.withRedux(({ Component, pageProps }) => {
  const store = useStore()

  return (
    <PersistGate persistor={store.__persistor}>
      <ThemeProvider enableSystem={true} attribute="class">
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </PersistGate>
  )
})
