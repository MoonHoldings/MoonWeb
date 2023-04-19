import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import Router from 'next/router'
import { getSession } from 'next-auth/react'
import { loginUser } from 'redux/reducers/authSlice'
import BannerModal from 'components/modals/BannerModal'
import { isValidEmail } from 'utils/string'

const Login = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const { loading } = useSelector((state) => state.auth)

  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setModal('', false, false)
      }, 2000)
      return () => {
        clearTimeout(timer)
      }
    }
  }, [showModal])

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
        const timer = setTimeout(() => {
          Router.push('/')
        }, 3500)
        return () => {
          clearTimeout(timer)
        }
      } else if (res.payload.error) {
        setModal(res.payload.error, true, true)
      }
    }
  }

  const signupInstead = () => {
    Router.push('/signup')
  }

  const discordAuth = () => {
    dispatch(changeLoginType('discord'))
    window.open(
      `${process.env.NEXT_PUBLIC_MOON_SERVER_URL}/api/auth/discord`,
      '_self'
    )
  }

  const setModal = (message, error, show) => {
    setShowModal(show)
    setMessage(message)
    setTimeout(
      () => {
        setError(error)
      },
      show ? 0 : 300
    )
  }

  return (
    <>
      <div className="flex h-screen flex-col items-center bg-black pt-[4.6rem]">
        <div className="form z-30 flex flex-col items-center">
          <h1 className="mb-[2rem] mt-[4rem] text-[6.4rem] font-bold text-[#63ECD2]">
            Login
          </h1>
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
            <button
              onClick={login}
              disable={loading}
              className={`primary-btn-gradient relative mx-[1.1rem] h-[5rem] w-full rounded-[1rem] text-[1.8rem] text-black ${
                loading ? 'cursor-wait opacity-50' : ''
              }`}
            >
              {loading && (
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
              Login
            </button>
          </div>
          <div
            className="mb-[1rem] flex w-[27.4rem] flex-col items-center rounded-[1.5rem]
            border border-[#50545A] px-4 py-[1.1rem]"
          >
            <button
              onClick={discordAuth}
              className="mx-[1.1rem] h-[5rem] w-[25.2rem] w-full rounded-[1rem] bg-[#5865F2] text-[1.8rem] text-white"
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
          setModal('', false, false)
        }}
      />
    </>
  )
}

export default Login

export async function getServerSideProps(context) {
  const session = await getSession(context)

  //if user is logged in
  if (session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  } else {
    return { props: {} }
  }
}
