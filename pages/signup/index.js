import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useDispatch } from 'react-redux'
import Router from 'next/router'
import {} from 'redux/reducers/authSlice'

import { REGISTER_USER, DISCORD_AUTH } from 'utils/mutations'
import { GENERATE_DISCORD_URL } from 'utils/queries.js'
import { useLazyQuery, useMutation } from '@apollo/client'
import { MOON_HOLDINGS } from 'app/constants/copy'
import BannerModal from 'components/modals/BannerModal'
import { getServerSidePropsWithAuth } from '../withAuth.js'

const SignUp = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [signUp, { loading: signingUp, data: signUpData }] =
    useMutation(REGISTER_USER)
  const [discordAuth, { loading: gettingDiscordUrl, data: discordUrl }] =
    useLazyQuery(GENERATE_DISCORD_URL)

  //handle signup response
  useEffect(() => {
    if (signUpData) {
      setModal(
        'You have successfully signed up. Please verify your email to login.',
        false,
        true
      )
      Router.push('/login')
    }
  }, [signUpData, dispatch])

  //handle discord url
  useEffect(() => {
    if (discordUrl) {
    }
  }, [discordUrl, dispatch])

  useEffect(() => {
    if (signUpData) {
      setModal(
        'You have successfully signed up. Please verify your email to login.',
        false,
        true
      )
      Router.push('/login')
    }
  }, [signUpData, dispatch])

  const register = async () => {
    if (
      email.length == 0 ||
      password.length == 0 ||
      confirmPassword.length == 0
    ) {
      setModal('Please fill up all fields', true, true)
    } else {
      try {
        await signUp({
          variables: { email: email, password: password },
        })
      } catch (error) {
        setModal(error.message, true, true)
      }
    }
  }

  const setModal = (message, error, show) => {
    setShowModal(show)
    setMessage(message)
    setError(error)
  }

  const discordSignUp = () => {
    const authWindow = window.open(
      'https://discord.com/oauth2/authorize?client_id=1096313631894933544&redirect_uri=http%3A%2F%2Flocalhost%3A80%2Fauth%2Fdiscord&response_type=code&scope=identify%20email&state=c13971630a36f5b727eee2b9ed84c4d1'
    )

    // Handle the window's load event to detect when the user is finished with the authentication flow
    authWindow.addEventListener('load', () => {
      // If the window's URL includes the access token, the user has authenticated successfully
      if (authWindow.location.href.includes('access_token')) {
        // Extract the access token from the URL hash
        const accessToken = authWindow.location.hash.split('=')[1]

        // Close the authentication window
        authWindow.close()

        // Redirect the user back to your web app with the access token in the URL query string
        res.redirect(`/dashboard?access_token=${accessToken}`)
      }
    })
  }
  const loginInstead = () => {
    Router.push('/login')
  }

  return (
    <>
      <div className="pmt-8 flex h-screen flex-col bg-white md:flex-row">
        <div className="form z-30 flex h-screen flex-col items-center justify-center bg-gray-500 pl-8 pt-8 md:w-1/2">
          <div className="absolute left-0 top-0 pl-8 pt-8">
            <div className="block flex items-center self-start md:hidden lg:block lg:flex">
              <div className=" flex h-[2.3rem] w-[2.3rem] items-center justify-center xl:h-[4rem] xl:w-[4rem]">
                <Image
                  className="h-[1.8Rem] w-[1.8Rem] xl:h-[3rem] xl:w-[3rem]"
                  src="/images/svgs/moon-holdings-logo-white.svg"
                  width={40}
                  height={40}
                  alt=""
                />
              </div>
              <div className="text-[1.6rem] font-semibold text-[#FFFFFF] xl:text-[1.8rem] xl:font-semibold ">
                {MOON_HOLDINGS}
              </div>
            </div>
          </div>
          <div
            className="mb-[1rem] flex w-[27.4rem] flex-col items-center justify-center rounded-[1.5rem] border
          border-[#50545A] px-4 py-[1.1rem]"
          >
            <input
              className="form-field w-full"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="form-field w-full"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className="form-field w-full"
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className=" mb-[1rem] text-[1.2rem] text-[#A6A6A6]">
              Minimum 8 characters long, at least 1 special, 1 number and 1
              letter
            </div>
            <button
              onClick={register}
              disable={signingUp}
              className={`primary-btn-gradient relative mx-[1.1rem] h-[5rem] w-full rounded-[1rem] text-[1.8rem] text-black ${
                signingUp ? 'cursor-wait opacity-50' : ''
              }`}
            >
              {signingUp && (
                <div className="absolute right-0 top-1/2 mr-4 -translate-y-1/2 transform">
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-10 w-10 animate-spin fill-teal-400 text-gray-200 dark:text-gray-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                </div>
              )}
              Complete Sign Up
            </button>
          </div>
          <div
            className="mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
          border border-[#50545A] px-4 py-[1.1rem]"
          >
            <button
              onClick={discordSignUp}
              className="mx-[1.1rem] h-[5rem] w-full rounded-[1rem] bg-[#5865F2] text-[1.8rem] text-white"
            >
              Sign up with Discord
            </button>
          </div>
          <div className="mb-[1rem] block text-[1.6rem] sm:hidden">or</div>
          <button
            onClick={loginInstead}
            className="mx-[1.1rem] block h-[5rem] w-[25.2rem] rounded-[1rem] border  text-[1.8rem] text-white sm:hidden"
          >
            Login
          </button>
        </div>
        <div className="flex hidden h-full w-3/4 flex-col bg-black pt-8 md:flex">
          <div className="flex flex-row justify-end ">
            <button
              onClick={register}
              className="primary-btn-gradient mx-[1.1rem] h-[5rem] w-[12.2rem] rounded-[1rem] text-[1.8rem] text-black"
            >
              Sign Up
            </button>
            <button
              onClick={loginInstead}
              className="mx-[1.1rem] h-[5rem] w-[12.2rem] rounded-[1rem] border text-[1.8rem] text-white"
            >
              Login
            </button>
          </div>
          <div className="mx-10 mt-20">
            <h1 className="text-[3rem] font-bold">
              Skyrocketing portfolio decision-making
            </h1>
            <h4 className="mt-20 bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-[6rem] font-bold text-transparent">
              Track.
            </h4>
            <h4 className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-[6rem] font-bold text-transparent">
              Compare.
            </h4>
            <h4 className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-[6rem] font-bold text-transparent">
              Compete.
            </h4>
            <p className="mt-20 text-justify text-[1.8rem]">
              MoonHolding's purpose is to make investing engaging, not just for
              current investors but for newcomers alike We believe in utilizing
              atomic habits to make portfolio management obvious, attractive,
              and rewarding.
            </p>
          </div>
          <footer className="fixed bottom-0 flex hidden h-64 w-full bg-gray-900 md:block">
            <div className="h-full w-full ">
              <Image
                src="/images/gifs/moon-holdings-banner-wide.gif"
                alt=""
                height={0}
                width={0}
                className=" h-full w-2/3 "
              />
            </div>
          </footer>
        </div>
      </div>
      <BannerModal
        showModal={showModal}
        message={message}
        hasError={error}
        closeModal={() => {
          setModal('', false, false)
        }}
      />
    </>
  )
}

export default SignUp

export const getServerSideProps = getServerSidePropsWithAuth
