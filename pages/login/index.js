import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from 'redux/reducers/authSlice'

const index = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user } = useSelector((state) => state.auth)

  const loginUser = () => {
    dispatch(login({ email, password }))
  }

  useEffect(() => {
    if (user !== {}) {
      console.log(user)
    }
  }, [user])

  return (
    <div className="flex flex-col items-center pt-[4.6rem]">
      <h1 className="mt-[4rem] mb-[2rem] text-[3rem] font-bold text-teal-500">
        Login
      </h1>
      <div className="mb-[1rem] bg-gray-800 p-2">
        <input
          className="mb-[1rem] block text-[1.6rem]"
          type="email"
          placeholder="Enter Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="block text-[1.6rem]"
          type="password"
          placeholder="Enter Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={loginUser}
          className="m-2 bg-teal-600 p-2 text-[1.6rem]"
        >
          Submit
        </button>
      </div>
      <button className="m-2 block bg-indigo-600 p-2 text-[1.6rem]">
        Discord
      </button>
      <button className="m-2 block bg-blue-600 p-2 text-[1.6rem]">
        Twitter
      </button>
    </div>
  )
}

export default index
