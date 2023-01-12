import '../styles/globals.css'
import { ThemeProvider } from 'next-themes'
import { Provider } from 'react-redux'
import store from '../redux/store'
import Navbar from '../components/Navbar'

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <Provider store={store}>
        <Navbar />
        <Component {...pageProps} />
      </Provider>
    </ThemeProvider>
  )
}

export default MyApp
