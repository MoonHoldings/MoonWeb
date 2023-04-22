import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Router from 'next/router'

import { useDispatch, useSelector } from 'react-redux'

import {
  authenticateComplete,
  authenticatePending,
} from 'redux/reducers/authSlice'
import { UPDATE_PASSWORD } from 'utils/mutations'
import { getSession, signOut } from 'next-auth/react'
import { useMutation } from '@apollo/client'

import BannerModal from 'components/modals/BannerModal'
import LoadingModal from 'components/modals/LoadingModal'
import { GeneralButton } from 'components/forms/GeneralButton'

const ResetPassword = (props) => {
  const dispatch = useDispatch()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const { loading, modalLoading } = useSelector((state) => state.auth)

  const [updatePassword, { loading: updatingPassword }] =
    useMutation(UPDATE_PASSWORD)

  useEffect(() => {
    if (!props.cookieValue) {
      Router.push('/login')
    }
  }, [dispatch, props.cookieValue])

  useEffect(() => {
    dispatch(authenticateComplete())
  }, [dispatch, updatingPassword])

  const submit = async () => {
    dispatch(authenticatePending())

    if (newPassword.length == 0 || confirmPassword.length == 0) {
      setModal('Please fill up all fields', true, true)
    } else {
      try {
        const res = await updatePassword({
          variables: { password: newPassword },
        })

        if (res.data) {
          setModal('You have successfully updated your password', false, true)
          Router.push('/')
        } else if (res.payload.error) {
          setModal(res.payload.error, true, true)
        }
      } catch (error) {
        setModal(error.message, true, true)

        if (error.message == 'Invalid token') {
          Router.push('/')
        }
      }
    }
  }

  const loginInstead = () => {
    Router.push('/login')
  }

  const setModal = (message, error, show) => {
    setShowModal(show)
    setMessage(message)
    setError(error)
  }

  return (
    <>
      <div className="flex h-screen flex-col items-center bg-black pt-[4.6rem]">
        <div className="form z-30 flex flex-col items-center">
          <h1 className="mb-[2rem] mt-[4rem] text-[6.4rem] font-bold text-[#63ECD2]">
            Password Reset
          </h1>
          <div
            className="mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
            border border-[#50545A] px-4 py-[1.1rem]"
          >
            <input
              className="form-field w-full"
              type="newPassword"
              placeholder="New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              className="form-field w-full"
              type="confirmNewPassword"
              placeholder="Confirm New Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <GeneralButton
              onSubmit={submit}
              loading={loading}
              title={'Submit'}
              bgColor={
                'bg-gradient-to-b from-teal-400 to-teal-300 hover:from-teal-500 hover:to-teal-400'
              }
            />
          </div>

          <div className="mb-[1rem] text-[1.6rem]">or</div>
          <div className={'flex w-[27.4rem] px-4'}>
            <GeneralButton
              onSubmit={loginInstead}
              loading={loading}
              title={'Login'}
              bgColor={'bg-black hover:bg-gray-900'}
              isWhite
              hasBorder
            />
          </div>
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

export default ResetPassword

export const getServerSideProps = async (context) => {
  const cookieValue = context.req.headers.cookie
    ?.split('; ')
    .find((row) => row.startsWith('jid='))
    .split('=')[1]

  return {
    props: {
      cookieValue,
    },
  }
}
