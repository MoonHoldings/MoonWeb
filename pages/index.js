import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { store } from '../store'
import { signup } from '../store/userSlice'

export default function Home() {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const status = useSelector((state) => state.user.status)

  const submit = () => {
    const data = dispatch(signup({email, password}))
  }

  return (
    <Provider store={store}>
      <div className={styles.container}>
        <input type="email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={submit}>Signup</button>
      </div>
    </Provider>
  )
}
