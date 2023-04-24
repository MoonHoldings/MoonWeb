import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Router from 'next/router'

import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from 'redux/reducers/authSlice'
import { isValidEmail } from 'utils/string'
import { getServerSidePropsWithAuth } from '../../utils/withAuth'
import {
  authenticateComplete,
  authenticatePending,
} from 'redux/reducers/authSlice'
import { GENERATE_DISCORD_URL, GET_PASSWORD_RESET } from 'utils/queries.js'
import { getSession } from 'next-auth/react'
import { useLazyQuery } from '@apollo/client'

import client from '../../utils/apollo-client'
import BannerModal from 'components/modals/BannerModal'
import LoadingModal from 'components/modals/LoadingModal'
import { GeneralButton } from 'components/forms/GeneralButton'
import { MOON_HOLDINGS } from 'app/constants/copy'

const Login = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [forgetEmail, setForgetEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [isForgetPass, setIsForgetPass] = useState(false)
  const { loading: signingIn, modalLoading } = useSelector(
    (state) => state.auth
  )

  const [discordAuth, { loading: gettingDiscordUrl }] =
    useLazyQuery(GENERATE_DISCORD_URL)

  const [getPasswordResetUrl, { loading: gettingUrl }] =
    useLazyQuery(GET_PASSWORD_RESET)

  useEffect(() => {
    dispatch(authenticateComplete())
  }, [dispatch])

  const login = async () => {
    if (email.length == 0 || password.length == 0) {
      setModal('Please fill up all fields', true, true)
    } else if (!isValidEmail(email)) {
      setModal('Please use a valid email', true, true)
    } else {
      const res = await dispatch(
        loginUser({
          email,
          password,
        })
      )

      if (res.payload.ok) {
        setModal('You have successfully signed in', false, true)
        Router.push('/')
      } else if (res.payload.error) {
        setModal(res.payload.error, true, true)
      }
    }
  }

  const signupInstead = () => {
    Router.push('/signup')
  }

  const generateDiscordUrl = async () => {
    try {
      dispatch(authenticatePending())
      await client.resetStore()
      const res = await discordAuth()

      if (res.data) {
        openDiscordWindow(res.data.generateDiscordUrl)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getPasswordReset = async () => {
    try {
      const res = await getPasswordResetUrl({
        variables: { email: forgetEmail },
      })

      if (res.data) {
        setModal(
          'Successfully sent reset link to your email. Please check yout inbox.',
          false,
          true
        )
        setIsForgetPass(false)
      } else if (res.payload.error) {
        setModal(res.payload.error, true, true)
      }
    } catch (error) {
      setModal(error, true, true)
    }
  }

  const openDiscordWindow = (discordUrl) => {
    const windowFeatures =
      'height=800,width=800,resizable=yes,scrollbars=yes,status=yes'

    const discordWindow = window.open(discordUrl, '_blank', windowFeatures)

    const intervalId = setInterval(async () => {
      if (discordWindow.closed) {
        const session = await getSession()

        if (session) {
          Router.push('/')
        }

        clearInterval(intervalId)
        dispatch(authenticateComplete())
      }
    }, 1000)
  }

  const setModal = (message, error, show) => {
    setShowModal(show)
    setMessage(message)
    setError(error)
  }

  return (
    <>
      <div className="flex h-screen flex-col items-center">
        <div
          onClick={() => Router.push('/')}
          className="flex items-center self-start pl-8 pt-8 hover:cursor-pointer md:block lg:block lg:flex"
        >
          <div className="flex h-[2.3rem] w-[2.3rem] items-center justify-center xl:h-[4rem] xl:w-[4rem]">
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
        <div className="form z-30 flex h-screen flex-col items-center justify-center md:justify-start">
          <h1 className="mb-[2rem] text-[6.4rem] font-bold text-[#63ECD2]">
            Login
          </h1>
          {isForgetPass ? (
            <>
              <div
                className="mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
                 border border-[#50545A] px-4 py-[1.1rem]"
              >
                <input
                  className="form-field w-full"
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setForgetEmail(e.target.value)}
                />

                <GeneralButton
                  onSubmit={getPasswordReset}
                  loading={gettingUrl}
                  title={'Confirm'}
                  bgColor={
                    'bg-gradient-to-b from-teal-400 to-teal-300 hover:from-teal-500 hover:to-teal-400'
                  }
                />
              </div>
              <div className={'flex w-[27.4rem] px-4'}>
                <GeneralButton
                  onSubmit={() => setIsForgetPass(false)}
                  title={'Back'}
                  bgColor={'bg-black hover:bg-gray-900'}
                  isWhite
                  hasBorder
                />
              </div>
            </>
          ) : (
            <>
              <div
                className="mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
            border border-[#50545A] px-4 py-[1.1rem]"
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
                <GeneralButton
                  onSubmit={login}
                  loading={signingIn}
                  title={'Login'}
                  bgColor={
                    'bg-gradient-to-b from-teal-400 to-teal-300 hover:from-teal-500 hover:to-teal-400'
                  }
                />
              </div>
              <div
                className="mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
            border border-[#50545A] px-4 py-[1.1rem]"
              >
                <GeneralButton
                  onSubmit={generateDiscordUrl}
                  loading={gettingDiscordUrl}
                  title={'Login With Discord'}
                  bgColor={'bg-blue-600 hover:bg-blue-700'}
                  isWhite
                />
              </div>
              <div
                onClick={() => setIsForgetPass(true)}
                className="group mb-[1rem] text-[1.6rem] hover:cursor-pointer hover:text-gray-200 hover:underline"
              >
                Forgot Password?
              </div>
              <div className="mb-[1rem] text-[1.6rem]">or</div>
              <div className={'flex w-[27.4rem] px-4'}>
                <GeneralButton
                  onSubmit={signupInstead}
                  title={'Signup'}
                  bgColor={'bg-black hover:bg-gray-900'}
                  isWhite
                  hasBorder
                />
              </div>
            </>
          )}
        </div>
        <footer className="h-84 fixed bottom-0 flex hidden   w-full bg-gray-900 md:block">
          <div className="h-full w-full ">
            <Image
              src="/images/gifs/moon-holdings-banner-wide.gif"
              alt=""
              height={0}
              width={0}
              className=" h-full w-full "
            />
          </div>
        </footer>
      </div>
      <BannerModal
        showModal={showModal}
        message={message}
        hasError={error}
        closeModal={() => {
          setModal('', error, false)
        }}
      />
      {modalLoading && <LoadingModal showMessage />}
    </>
  )
}

export default Login

// export const getServerSideProps = getServerSidePropsWithAuth
