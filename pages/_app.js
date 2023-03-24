import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux'
import store from '../redux/store'
import Layout from 'components/Layout'
import 'react-tippy/dist/tippy.css'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Provider store={store}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </ThemeProvider>
  )
}

export default MyApp
