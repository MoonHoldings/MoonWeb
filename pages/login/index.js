import axios from 'axios'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { changeLoginType, getUser, login } from 'redux/reducers/authSlice'

const Index = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const { user, loginSuccess, loginType } = useSelector((state) => state.auth)

  const signupInstead = () => {
    router.push('/signup')
  }

  const loginUser = () => {
    dispatch(changeLoginType('local'))
    dispatch(login({ email, password }))
  }

  const twitterAuth = () => {
    dispatch(changeLoginType('twitter'))
    window.open(
      `${process.env.NEXT_PUBLIC_MOON_SERVER_URL}/api/auth/twitter`,
      '_self'
    )
  }

  const discordAuth = () => {
    dispatch(changeLoginType('discord'))
    window.open(
      `${process.env.NEXT_PUBLIC_MOON_SERVER_URL}/api/auth/discord`,
      '_self'
    )
  }

  useEffect(() => {
    console.log('user', user)
    console.log('loginType', loginType)

    if (loginType !== 'local') {
      dispatch(getUser())
    }
  }, [dispatch, user, loginSuccess, loginType])

  return (
    <div className="flex h-screen flex-col items-center bg-black pt-[4.6rem]">
      <div className="form z-30 flex flex-col items-center">
        <h1 className="mt-[4rem] mb-[2rem] text-[6.4rem] font-bold text-[#63ECD2]">
          Login
        </h1>
        <div
          className="mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
border border-[#50545A] py-[1.1rem]"
        >
          <input
            className="form-field"
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form-field"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={loginUser}
            className="primary-btn-gradient mx-[1.1rem] h-[5rem] w-[25.2rem] rounded-[1rem] text-[1.8rem] text-black"
          >
            Login
          </button>
        </div>
        <div
          className="mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
border border-[#50545A] py-[1.1rem]"
        >
          <button
            onClick={twitterAuth}
            className="mx-[1.1rem] ml-[1.1rem] mb-[1rem] h-[5rem] w-[25.2rem] rounded-[1rem] bg-[#55ACEE] text-[1.8rem] text-white"
          >
            Login with Twitter
          </button>
          <button
            onClick={discordAuth}
            className="mx-[1.1rem] h-[5rem] w-[25.2rem] rounded-[1rem] bg-[#5865F2] text-[1.8rem] text-white"
          >
            Login with Discord
          </button>
        </div>
        <div className="mb-[1rem] text-[1.6rem]">or</div>
        <button
          onClick={signupInstead}
          className="mx-[1.1rem] h-[5rem] w-[25.2rem] rounded-[1rem] border bg-black text-[1.8rem] text-white"
        >
          Sign Up
        </button>
      </div>

      <div className="flex justify-center">
        <Image
          src="/images/gifs/moon-holdings-banner-wide.gif"
          alt=""
          className="z-{25} fixed bottom-0 hidden w-full max-w-[144rem] md:-bottom-[5rem] md:block md:w-full lg:-bottom-[8rem]"
        />
        <Image
          src="/images/gifs/moon-holdings-banner-cropped.gif"
          alt=""
          className="z-{25} fixed bottom-0 w-full max-w-[144rem] md:hidden"
        />
      </div>
    </div>
  )
}

export default Index
