import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Router from 'next/router'

import { useDispatch, useSelector } from 'react-redux'
import { useLazyQuery, useMutation } from '@apollo/client'
import { MOON_HOLDINGS } from 'app/constants/copy'
import {
  authenticateComplete,
  authenticatePending,
} from 'redux/reducers/authSlice'
import { REGISTER_USER } from 'utils/mutations'
import { GENERATE_DISCORD_URL } from 'utils/queries.js'
import { getServerSidePropsWithAuth } from 'utils/withAuth'

import client from 'utils/apollo-client'
import LoadingModal from 'components/modals/LoadingModal'
import BannerModal from 'components/modals/BannerModal'
import { GeneralButton } from 'components/forms/GeneralButton'

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
  const [discordAuth, { loading: gettingDiscordUrl, data: discordData }] =
    useLazyQuery(GENERATE_DISCORD_URL)

  const { modalLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(authenticateComplete())
  }, [dispatch])

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
        console.log(error)
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
    dispatch(authenticatePending())
    await client.resetStore()
    const res = await discordAuth()

    if (res.data) {
      openDiscordWindow(res.data.generateDiscordUrl)
    }
  }

  const openDiscordWindow = (discordUrl) => {
    const windowFeatures =
      'height=800,width=800,resizable=yes,scrollbars=yes,status=yes'

    const discordWindow = window.open(discordUrl, '_blank', windowFeatures)

    const intervalId = setInterval(async () => {
      if (discordWindow.closed) {
        //session
        if (false) {
          Router.push('/')
        }
        clearInterval(intervalId)
        dispatch(authenticateComplete())
      }
    }, 1000)
  }

  const loginInstead = () => {
    Router.push('/login')
  }

  return (
    <>
      <div className="flex h-screen flex-col md:flex-row">
        <div className="form z-30 flex h-screen flex-col items-center justify-center bg-gray-900 pl-8 pt-8 md:w-1/2">
          <div className="absolute left-0 top-0 pl-8 pt-8">
            <div
              onClick={() => Router.push('/')}
              className="block flex items-center self-start hover:cursor-pointer md:hidden lg:block lg:flex"
            >
              <div
                onClick={() => Router.push('/')}
                className=" flex h-[2.3rem] w-[2.3rem] items-center justify-center xl:h-[4rem] xl:w-[4rem]"
              >
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
              Minimum 8 characters long, at least 1 special, 1 number, and 1
              uppercase and lowercase letter
            </div>
            <GeneralButton
              onSubmit={register}
              loading={signingUp}
              title={'Complete Sign Up'}
              bgColor={
                'bg-gradient-to-b from-teal-400 to-teal-300 hover:from-teal-500 hover:to-teal-400'
              }
            />
          </div>

          <div className="wflex-col mb-[1rem] flex w-[27.4rem] items-center rounded-[1.5rem] border border-[#50545A] px-4 py-[1.1rem]">
            <GeneralButton
              onSubmit={generateDiscordUrl}
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
                onSubmit={loginInstead}
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
          setModal('', error, false)
        }}
      />
      {modalLoading && <LoadingModal showMessage />}
    </>
  )
}

export default SignUp
export const getServerSideProps = getServerSidePropsWithAuth
