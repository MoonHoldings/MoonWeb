import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { changeLoginType, signup } from 'redux/reducers/authSlice'

const index = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const { signUpSuccess } = useSelector((state) => state.auth)

  const register = () => {
    if (password === confirmPassword) {
      dispatch(signup({ email, password }))
    }
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

  const loginInstead = () => {
    router.push('/login')
  }

  //=== TIP: you have to add NEXT_PUBLIC_ before any env variable (nextjs rule)
  useEffect(() => {
    console.log('signUpSuccess', signUpSuccess)
  }, [signUpSuccess])

  return (
    <div className="flex h-screen flex-col items-center bg-black pt-[4.6rem]">
      <div className="form z-30 flex flex-col items-center">
        <h1 className="mt-[4rem] mb-[2rem] text-[6.4rem] font-bold text-[#63ECD2]">
          Sign Up
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
          <input
            className="form-field"
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <div className="mx-[1.1rem] mb-[1rem] text-[1.2rem] text-[#A6A6A6]">
            Minimum 8 characters long, at least 1 special, 1 number and 1 letter
          </div>
          <button
            onClick={register}
            className="primary-btn-gradient mx-[1.1rem] h-[5rem] w-[25.2rem] rounded-[1rem] text-[1.8rem] text-black"
          >
            Complete Sign Up
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
            Sign up with Twitter
          </button>
          <button
            onClick={discordAuth}
            className="mx-[1.1rem] h-[5rem] w-[25.2rem] rounded-[1rem] bg-[#5865F2] text-[1.8rem] text-white"
          >
            Sign up with Discord
          </button>
        </div>
        <div className="mb-[1rem] text-[1.6rem]">or</div>
        <button
          onClick={loginInstead}
          className="mx-[1.1rem] h-[5rem] w-[25.2rem] rounded-[1rem] border text-[1.8rem] text-white"
        >
          Login
        </button>
      </div>

      <div className="flex justify-center">
        <img
          src="/images/gifs/moon-holdings-banner-wide.gif"
          alt=""
          className="z-{25} fixed bottom-0 hidden w-full max-w-[144rem] md:-bottom-[5rem] md:block md:w-full lg:-bottom-[8rem]"
        />
        <img
          src="/images/gifs/moon-holdings-banner-cropped.gif"
          alt=""
          className="z-{25} fixed bottom-0 w-full max-w-[144rem] md:hidden"
        />
      </div>
    </div>
  )
}

export default index
