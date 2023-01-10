import React, { useState } from 'react'
import axios from 'axios'
import { useSelector } from 'react-redux'

const index = () => {
  const { status } = useSelector((state) => state.auth)
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const register = () => {
    axios({
      method: 'POST',
      data: {
        email: registerEmail,
        password: registerPassword,
      },
      withCredentials: true,
      url: 'http://localhost:9000/api/register',
    }).then((res) => console.log(res))
  }

  const login = () => {
    axios({
      method: 'POST',
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      withCredentials: true,
      url: 'http://localhost:9000/api/login',
    }).then((res) => console.log(res))
  }

  return (
    <div>
      <h1 className="text-3xl font-bold underline text-red-500">
        Hello world!
      </h1>
      <h2>{status}</h2>
      <div>
        <h1>Register</h1>
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button onClick={register}>Register</button>
      </div>

      <div>
        <h1>Login</h1>
        <input
          type="email"
          placeholder="email"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    </div>
  )
}

export default index
