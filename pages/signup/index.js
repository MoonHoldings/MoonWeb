import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { useDispatch, useSelector } from 'react-redux'
import { useLazyQuery, useMutation } from '@apollo/client'
import { MOON_HOLDINGS } from 'application/constants/copy'
import {
  authenticateComplete,
  authenticateLoading,
  authenticatePending,
  discordAuthenticationComplete,
} from 'redux/reducers/authSlice'
import { REGISTER_USER } from 'utils/mutations'
import {
  GENERATE_DISCORD_URL,
  RESEND_EMAIL_CONFIRMATION,
} from 'utils/queries.js'

import LoadingModal from 'components/modals/LoadingModal'
import BannerModal from 'components/modals/BannerModal'
import { GeneralButton } from 'components/forms/GeneralButton'
import withAuth from 'hoc/withAuth'

const SignUp = () => {
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [discordEmail, setDiscordEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [signUp, { loading: signingUp, data: signUpData }] = useMutation(
    REGISTER_USER,
    {
      fetchPolicy: 'no-cache',
    }
  )
  const [discordAuth, { loading: gettingDiscordUrl, data: discordData }] =
    useLazyQuery(GENERATE_DISCORD_URL, {
      fetchPolicy: 'no-cache',
    })

  const [resend] = useLazyQuery(RESEND_EMAIL_CONFIRMATION, {
    fetchPolicy: 'no-cache',
  })

  const { modalLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(authenticateComplete())
  }, [dispatch])

  //handle signup response
  useEffect(() => {
    if (signUpData) {
      const message = signUpData.register.isVerified
        ? 'You have successfully signed up with your email. Please login to continue.'
        : 'You have successfully signed up. Please check your email to finish the signup process.'
      setModal(message, false, true)
      setTimeout(function () {
        router.push('/login')
      }, 2000)
    }
  }, [signUpData, dispatch, router])

  const register = async (event) => {
    event.preventDefault()
    if (
      email.length == 0 ||
      password.length == 0 ||
      confirmPassword.length == 0
    ) {
      setModal('Please fill up all fields', true, true)
    } else if (password != confirmPassword) {
      setModal('Passwords do not match', true, true)
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
  const generateDiscordUrl = async () => {
    const windowFeatures =
      'height=800,width=900,resizable=yes,scrollbars=yes,status=yes'
    let discordWindow = window.open('', '_blank', windowFeatures)
    dispatch(authenticatePending())
    setDiscordEmail('')
    const res = await discordAuth()

    if (res.data) {
      openDiscordWindow(res.data.generateDiscordUrl, discordWindow)
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
            router.push('/dashboard')
            discordWindow.close()
            dispatch(
              discordAuthenticationComplete({
                username: valueReceived.payload.username ?? null,
                accessToken: valueReceived.payload?.access_token ?? null,
                isLoggedIn: valueReceived.payload?.access_token && true,
              })
            )
          } else if (valueReceived.payload.message) {
            setModal(valueReceived.payload.message, true, true)
          }
        } else if (valueReceived.errorMessage) {
          discordWindow.close()
          setModal(
            valueReceived.errorMessage ?? 'Please try again later.',
            true,
            true
          )
        } else if (valueReceived.successMessage) {
          discordWindow.close()
          setModal(
            valueReceived.successMessage ?? 'Please try again later.',
            false,
            true
          )
          if (valueReceived.email) {
            discordWindow.close()
            setDiscordEmail(valueReceived.email)
          }
        } else if (valueReceived.error) {
          discordWindow.close()
          setModal(valueReceived.error ?? 'Please try again later.', true, true)
        }
      }
    } catch (error) {
      setModal(error.message ?? 'Please try again later.', true, true)
      dispatch(authenticateComplete())
      discordWindow.close()
    }

    const intervalId = setInterval(async () => {
      if (discordWindow.closed) {
        clearInterval(intervalId)
        dispatch(authenticateComplete())
      }
    }, 1000)
  }

  const loginInstead = () => {
    router.push('/login')
  }

  function handleComplete(isComplete) {
    dispatch(authenticateLoading(isComplete))
  }

  const resendEmail = async () => {
    handleComplete(true)
    if (discordEmail) {
      try {
        const res = await resend({ variables: { email: discordEmail } })
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
        setModal(error.message, true, true)
      }
    } else {
      setModal('Email is not found. Please try again.', true, true)
    }
    handleComplete(false)
  }

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row">
        <div className="form z-30 flex h-screen flex-col items-center justify-center bg-gray-900 pl-8 pt-8 md:w-1/2">
          <div className="absolute left-0 top-0 pl-8 pt-8">
            <div
              onClick={() => router.push('/')}
              className="block flex items-center self-start hover:cursor-pointer md:hidden lg:block lg:flex"
            >
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
          <h1 className="mb-[2rem] mt-[4rem] bg-gradient-to-b from-teal-400 to-teal-300 bg-clip-text text-[6.4rem] font-bold text-transparent">
            Sign Up
          </h1>
          <form
            onSubmit={register}
            className="form mb-[1rem] flex w-[27.4rem] flex-col items-center justify-center rounded-[1.5rem] border
          border-[#50545A] px-4 py-[1.1rem]"
          >
            <input
              className="form-field w-full"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative w-full">
              <input
                className="form-field w-full pr-16"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              {!showPassword ? (
                <Image
                  src="/images/svgs/eye-slash.svg"
                  width={10}
                  height={10}
                  alt=""
                  className="absolute right-[2rem] top-[1.4rem] h-[2rem] w-[2rem] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              ) : (
                <Image
                  src="/images/svgs/eye-open.svg"
                  width={10}
                  height={10}
                  alt=""
                  className="absolute right-[2rem] top-[1.4rem] h-[2rem] w-[2rem] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                />
              )}
            </div>
            <div className="relative w-full">
              <input
                className="form-field w-full pr-16"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {!showConfirmPassword ? (
                <Image
                  src="/images/svgs/eye-slash.svg"
                  width={10}
                  height={10}
                  alt=""
                  className="absolute right-[2rem] top-[1.4rem] h-[2rem] w-[2rem] cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              ) : (
                <Image
                  src="/images/svgs/eye-open.svg"
                  width={10}
                  height={10}
                  alt=""
                  className="absolute right-[2rem] top-[1.4rem] h-[2rem] w-[2rem] cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              )}
            </div>
            <GeneralButton
              onClick={register}
              loading={signingUp}
              title={'Complete Sign Up'}
              bgColor={
                'bg-gradient-to-b from-teal-400 to-teal-300 hover:from-teal-500 hover:to-teal-400'
              }
            />
          </form>

          <div className="wflex-col mb-[1rem] flex w-[27.4rem] items-center rounded-[1.5rem] border border-[#50545A] px-4 py-[1.1rem]">
            <GeneralButton
              onClick={generateDiscordUrl}
              loading={gettingDiscordUrl}
              title={'Sign Up With Discord'}
              bgColor={'bg-blue-600 hover:bg-blue-700'}
              isWhite
            />
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
          <div className="flex flex-row justify-end">
            <div className={'mr-8 w-[12.2rem]'}>
              <GeneralButton
                hasBorder
                isWhite
                onClick={loginInstead}
                title={'Login'}
                bgColor={'bg-black hover:bg-gray-900'}
              />
            </div>
          </div>
          <div className="mx-10 mt-20">
            <h1 className="text-[3rem] font-bold">
              Skyrocketing portfolio decision-making
            </h1>
            <h4 className="mt-20 bg-gradient-to-r from-teal-500 to-cyan-300 bg-clip-text text-[6rem] font-bold text-transparent">
              Track.
            </h4>
            <h4 className="bg-gradient-to-r from-teal-500 to-cyan-300 bg-clip-text text-[6rem] font-bold text-transparent">
              Compare.
            </h4>
            <h4 className="bg-gradient-to-r from-teal-500 to-cyan-300 bg-clip-text text-[6rem] font-bold text-transparent">
              Compete.
            </h4>
            <p className="mt-20 text-justify text-[1.8rem]">
              MoonHolding's purpose is to make investing engaging, not just for
              current investors but for newcomers alike We believe in utilizing
              atomic habits to make portfolio management obvious, attractive,
              and rewarding.
            </p>
          </div>
        </div>
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

export default withAuth(SignUp)
