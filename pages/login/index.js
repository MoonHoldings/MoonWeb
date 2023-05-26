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
  authenticateLoading,
  discordAuthenticationComplete,
} from 'redux/reducers/authSlice'
import {
  GENERATE_DISCORD_URL,
  GET_PASSWORD_RESET,
  RESEND_EMAIL_CONFIRMATION,
} from 'utils/queries.js'

import { useLazyQuery } from '@apollo/client'
import BannerModal from 'components/modals/BannerModal'
import LoadingModal from 'components/modals/LoadingModal'
import { GeneralButton } from 'components/forms/GeneralButton'
import { MOON_HOLDINGS } from 'application/constants/copy'
import { NEXT_WEBAPP_URL } from 'application/constants/api'

const Login = (props) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [discordEmail, setDiscordEmail] = useState('')
  const [forgetEmail, setForgetEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [isForgetPass, setIsForgetPass] = useState(false)
  const { loading: signingIn, modalLoading } = useSelector(
    (state) => state.auth
  )

  const [discordAuth, { loading: gettingDiscordUrl }] = useLazyQuery(
    GENERATE_DISCORD_URL,
    {
      fetchPolicy: 'no-cache',
    }
  )

  const [getPasswordResetUrl, { loading: gettingUrl }] = useLazyQuery(
    GET_PASSWORD_RESET,
    {
      fetchPolicy: 'no-cache',
    }
  )

  const [resend] = useLazyQuery(RESEND_EMAIL_CONFIRMATION, {
    fetchPolicy: 'no-cache',
  })

  useEffect(() => {
    dispatch(authenticateComplete())
  }, [dispatch])

  useEffect(() => {
    if (props.errorMessage) {
      setModal(decodeURIComponent(props.errorMessage), true, true)
    } else if (props.successMessage) {
      setModal(decodeURIComponent(props.successMessage), false, true)
    }
  }, [props])

  const login = async (event) => {
    event.preventDefault()
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
      if (res.payload.username) {
        Router.push('/dashboard')
      } else if (res.payload.message) {
        console.log(res.payload.message)
        setModal(res.payload.message, true, true)
      }
    }
  }

  const signupInstead = () => {
    Router.push('/signup')
  }

  const generateDiscordUrl = async () => {
    const windowFeatures =
      'height=800,width=900,resizable=yes,scrollbars=yes,status=yes'
    let discordWindow = window.open('', '_blank', windowFeatures)
    try {
      dispatch(authenticatePending())
      setDiscordEmail('')
      const res = await discordAuth()

      if (res.data) {
        openDiscordWindow(res.data.generateDiscordUrl, discordWindow)
      }
    } catch (error) {
      discordWindow.close()
      console.log(error)
    }
  }

  const getPasswordReset = async (event) => {
    event.preventDefault()
    if (forgetEmail.length == 0) {
      setModal('Please fill up the field', true, true)
    } else {
      try {
        const res = await getPasswordResetUrl({
          variables: { email: forgetEmail },
        })

        if (res.data) {
          setModal(
            'Successfully sent reset link to your email. Please check your inbox.',
            false,
            true
          )
          setIsForgetPass(false)
        } else if (res.error.message) {
          setModal(res.error.message, true, true)
        }
      } catch (error) {
        setModal(error.message, true, true)
      }
    }
  }

  const openDiscordWindow = (discordUrl, discordWindow) => {
    discordWindow.location.href = discordUrl
    try {
      window.addEventListener('message', receiveMessage, false)
      async function receiveMessage(event) {
        const valueReceived = event.data
        if (valueReceived.payload) {
          if (valueReceived.payload.ok) {
            Router.push('/dashboard')
            dispatch(
              discordAuthenticationComplete({
                username: valueReceived.payload.username ?? null,
              })
            )
          } else if (valueReceived.payload.message) {
            setModal(valueReceived.payload.message, true, true)
          }
          discordWindow.close()
        } else if (valueReceived.errorMessage) {
          setModal(
            valueReceived.errorMessage ?? 'Please try again later.',
            true,
            true
          )
          discordWindow.close()
        } else if (valueReceived.successMessage) {
          setModal(
            valueReceived.successMessage ?? 'Please try again later.',
            false,
            true
          )
          if (valueReceived.email) {
            setDiscordEmail(valueReceived.email)
          }
          discordWindow.close()
        } else if (valueReceived.error) {
          setModal(valueReceived.error ?? 'Please try again later.', true, true)
          discordWindow.close()
        }
      }
    } catch (error) {
      setModal(error.message ?? 'Please try again later.', true, true)
      discordWindow.close()
    }
    const intervalId = setInterval(async () => {
      if (discordWindow.closed) {
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

  function handleComplete(isComplete) {
    dispatch(authenticateLoading(isComplete))
  }

  const resendEmail = async () => {
    handleComplete(true)
    let finalEmail = discordEmail ? discordEmail : email ? email : false

    if (finalEmail) {
      try {
        const res = await resend({ variables: { email: finalEmail } })
        if (res.error) {
          setModal(res.error.message, true, true)
        } else {
          setModal(
            'Successfully resent link to your email. Please check your inbox.',
            false,
            true
          )
        }
      } catch (error) {
        setModal(error.message, true, false)
      }
    } else {
      setModal('Email is not found. Please try again.', true, true)
    }
    handleComplete(false)
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
              <form
                onSubmit={getPasswordReset}
                className="form mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
                 border border-[#50545A] px-4 py-[1.1rem]"
              >
                <input
                  key={'forgetEmail'}
                  className="form-field w-full"
                  type="email"
                  placeholder="Forget Email"
                  value={forgetEmail}
                  onChange={(e) => setForgetEmail(e.target.value)}
                />

                <GeneralButton
                  onClick={getPasswordReset}
                  loading={gettingUrl}
                  title={'Confirm'}
                  bgColor={
                    'bg-gradient-to-b from-teal-400 to-teal-300 hover:from-teal-500 hover:to-teal-400'
                  }
                />
              </form>
              <div className={'flex w-[27.4rem] px-4'}>
                <GeneralButton
                  onClick={() => setIsForgetPass(false)}
                  title={'Back'}
                  bgColor={'bg-black hover:bg-gray-900'}
                  isWhite
                  hasBorder
                />
              </div>
            </>
          ) : (
            <>
              <form
                onSubmit={login}
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
                  onClick={login}
                  loading={signingIn}
                  title={'Login'}
                  bgColor={
                    'bg-gradient-to-b from-teal-400 to-teal-300 hover:from-teal-500 hover:to-teal-400'
                  }
                />
              </form>
              <div
                className="mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
            border border-[#50545A] px-4 py-[1.1rem]"
              >
                <GeneralButton
                  onClick={() => {
                    generateDiscordUrl()
                  }}
                  loading={gettingDiscordUrl}
                  title={'Login With Discord'}
                  bgColor={'bg-blue-600 hover:bg-blue-700'}
                  isWhite
                />
              </div>
              <div
                onClick={() => {
                  setIsForgetPass(true)
                  setEmail('')
                  setForgetEmail('')
                }}
                className="group mb-[1rem] text-[1.6rem] hover:cursor-pointer hover:text-gray-200 hover:underline"
              >
                Forgot Password?
              </div>
              <div className="mb-[1rem] text-[1.6rem]">or</div>
              <div className={'flex w-[27.4rem] px-4'}>
                <GeneralButton
                  onClick={signupInstead}
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
              height={10}
              width={10}
              className=" h-full w-full "
            />
          </div>
        </footer>
      </div>
      <BannerModal
        resendEmail={resendEmail}
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
export const getServerSideProps = getServerSidePropsWithAuth
