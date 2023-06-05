import React, { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { changeLeftSideBarOpen } from 'redux/reducers/utilSlice'
import { MOON_HOLDINGS } from 'application/constants/copy'
import { LOGOUT_USER } from 'utils/mutations'
import { useMutation } from '@apollo/client'
import {
  authenticateComplete,
  authenticatePending,
  logout,
} from 'redux/reducers/authSlice'
import { LANDING_SITE } from 'application/constants/api'

const LeftSideBar = () => {
  const router = useRouter()
  const dispatch = useDispatch()

  const leftArrowClick = () => {
    dispatch(changeLeftSideBarOpen(false))
  }

  const handleClick = (url) => {
    leftArrowClick()
    router.push(`/${url}`)
  }

  const [logOut, { loading: loggingOut }] = useMutation(LOGOUT_USER)
  const { username } = useSelector((state) => state.auth)

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  // xl:max-h-[calc(100%-1.5rem)]
  return (
    <motion.div
      className="fixed left-0 top-0 z-[51] h-full w-full bg-[#191C20] md:sticky md:top-8 md:order-1 md:h-[calc(100vh-3rem)] md:w-[28.8rem] md:rounded-[2rem]"
      initial={{ x: '-101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '-101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {/* Header */}
      <div className="mb-[4.6rem] mt-[1rem] flex h-[4.6rem] justify-between px-[1.7rem] xl:mb-[1rem] xl:px-[1.5rem]">
        <button
          onClick={leftArrowClick}
          id="btn-left-sidebar-arrow"
          className="h-full xl:hidden"
        >
          <Image
            className="h-[2.5rem] w-[2.5rem]"
            src="/images/svgs/arrow-left.svg"
            width={25}
            height={24}
            alt="arrow left"
          />
        </button>

        <div className="block flex items-center md:hidden lg:block lg:flex">
          <div className="mr-3 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full bg-white xl:h-[4rem] xl:w-[4rem]">
            <Image
              className="h-[1.3rem] w-[1.3rem] xl:h-[2.25rem] xl:w-[2.25rem]"
              src="/images/svgs/moon-holdings-logo-black.svg"
              width={40}
              height={40}
              alt=""
            />
          </div>
          <div className="text-[1.6rem] font-semibold text-[#A6A6A6] xl:text-[1.4rem] xl:font-medium">
            {MOON_HOLDINGS}
          </div>
        </div>

        {/* <button className="h-full">
          <Image
            className="h-[2.4rem] w-[2.4rem] xl:h-[2.5rem] xl:w-[2.5rem]"
            src="/images/svgs/theme-btn.svg"
            alt="theme button"
          />
        </button> */}
      </div>

      {/* Menu Options */}
      <div className="sidebar-menu px-[1.7rem] text-[1.4rem] font-medium xl:px-[1.5rem]">
        <button
          id="btn-nft-portfolio"
          onClick={() => handleClick('dashboard')}
          className={`mb-[1rem] flex h-[4.1rem] w-full items-center px-[1.6rem] xl:mb-[2rem] text-[${
            router.pathname.includes('dashboard') ? '#62EAD2' : '#FFFFFF'
          }]`}
        >
          <Image
            className="mr-[1rem] h-[2.1rem] w-[2.1rem] xl:h-[2.5rem] xl:w-[2.5rem]"
            src="/images/svgs/dashboard.svg"
            alt="Dashboard"
            width={0}
            height={0}
          />
          Dashboard
        </button>

        <hr className="mb-[1rem] h-[0.2rem] w-full rounded border-0 bg-black xl:mb-[2rem]" />
        <ul className="dashboard-menu">
          <li className="mb-[1rem] px-[1.6rem] xl:mb-[2rem]">
            <button
              onClick={() => handleClick('crypto')}
              className={`flex h-[4.1rem] w-full items-center text-[${
                router.pathname.includes('crypto') ? '#62EAD2' : '#FFFFFF'
              }]`}
            >
              <Image
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] xl:h-[2.5rem] xl:w-[2.5rem]"
                src="/images/svgs/crypto.svg"
                alt="Crypto"
                width={40}
                height={40}
              />
              Crypto
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] xl:mb-[2rem]">
            <button
              id="btn-nft-portfolio"
              onClick={() => handleClick('nfts')}
              className={`flex h-[4.1rem] w-full items-center text-[${
                router.pathname.includes('nfts') ? '#62EAD2' : '#FFFFFF'
              }]`}
            >
              <Image
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] xl:h-[2.5rem] xl:w-[2.5rem]"
                src="/images/svgs/image.svg"
                width={25}
                height={21}
                alt="NFTs"
              />
              NFTs
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] xl:mb-[2rem]">
            <button
              onClick={() => handleClick('defi-loans/lend')}
              className={`flex h-[4.1rem] w-full items-center text-[${
                router.pathname.includes('defi-loans') ? '#62EAD2' : '#FFFFFF'
              }]`}
            >
              <Image
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] xl:h-[2.5rem] xl:w-[2.5rem]"
                src={'/images/sharky-white.png'}
                alt="Dashboard"
                width={25}
                height={25}
              />
              Lend & Borrow
            </button>
          </li>
          {/* <li className="hidden px-[1.6rem] xl:block">
            <button
              onClick={async () => {
                await dispatch(authenticatePending())
                const res = await logOut()
                await dispatch(authenticateComplete())
                if (res.data.logout) {
                  router.push(LANDING_SITE)
                  await dispatch(logout())
                }
              }}
              className="flex h-[4.1rem] w-full items-center text-[#666666]"
            >
              <Image
                className="mr-[1rem] h-[2.5rem] w-[2.5rem]"
                src="/images/svgs/exit.svg"
                alt="Taxes"
                width={25}
                height={25}
              />
              Logout
            </button>
          </li> */}
          {/* <li className="mb-[1rem] px-[1.6rem] xl:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <Image
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] xl:h-[2.5rem] xl:w-[2.5rem]"
                src="/images/svgs/calendar.svg"
                alt="Dashboard"
              />
              Calendar
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] xl:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <Image
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] xl:h-[2.5rem] xl:w-[2.5rem]"
                src="/images/svgs/ranks.svg"
                alt="Dashboard"
              />
              Ranks{' '}
              <span className="xl:hidden">(Verified Portfolio Ladder)</span>
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] xl:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <Image
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] xl:h-[2.5rem] xl:w-[2.5rem]"
                src="/images/svgs/insights.svg"
                alt="Insights"
              />
              Insights
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] xl:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <Image
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] xl:h-[2.5rem] xl:w-[2.5rem]"
                src="/images/svgs/file.svg"
                alt="Taxes"
              />
              Taxes{' '}
              <span className="xl:hidden">
                (<u>2022 - Gain / loss report (PDF)</u>)
              </span>
            </button>
          </li>
          <li className="mb-[1rem] hidden px-[1.6rem] xl:mb-[2rem] xl:block">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <Image
                className="mr-[1rem] h-[2.5rem] w-[2.5rem]"
                src="/images/svgs/gear.svg"
                alt="Taxes"
              />
              Settings
            </button>
          </li>
      */}
        </ul>
      </div>

      {/* Profile Info  */}
      <div className="profile-info absolute bottom-1 w-full">
        {/* <div className="mx-[1.7rem] mb-[1.2rem] hidden h-[5.6rem] w-[calc(100%-3.4rem)] items-center justify-between rounded-[1rem] px-[1.4rem] xl:mx-[1.5rem] xl:flex xl:w-[calc(100%-3rem)] xl:bg-[#342B25] xl:px-[1.6rem]">
          <div className="flex items-center">
            <Image
              src="/images/svgs/rank-symbol.svg"
              width="25"
              height="25"
              className="mr-[1rem] h-[4rem] w-[4rem]"
              alt="Rank Symbol"
            />
            <div className="text-[1.2rem] font-normal text-white">
              Your Current Rank
            </div>
          </div>
          <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center text-[1.6rem] ">
            15
          </div>
        </div> */}
        {/* <div className="mx-[1.5rem] mb-[1.7rem] flex h-[7.4rem] items-center justify-between rounded-[1rem] bg-[#242E37] px-[1.4rem]">
          <div className="mr-[1rem] h-[5rem] w-[5rem] rounded-full bg-black" />
          <div className="flex-1 overflow-hidden truncate text-[1.2rem] text-white">
            {username}
          </div>
          <button className="ml-[1rem] flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[1rem] bg-[#191C20] xl:hidden">
            <Image
              className="h-[1.5rem] w-[1.5rem]"
              src="/images/svgs/gear.svg"
              width={16}
              height={16}
              alt=""
            />
          </button>
        </div> */}
        <div
          className={`relative mx-[1.5rem] hover:cursor-pointer  ${
            isMenuOpen ? 'rounded-b-[1rem] bg-black' : ''
          }`}
        >
          <div
            className={`mb-[1.7rem] flex h-[7.4rem] items-center justify-between rounded-[1rem] bg-[#242E37] px-[1.4rem] transition-colors duration-300 ${
              isMenuOpen ? 'bg-[#383C42]' : ''
            }`}
            onMouseEnter={toggleMenu}
            onMouseLeave={() => setIsMenuOpen(false)}
            onClick={toggleMenu}
          >
            <div className="mr-[1rem] h-[5rem] w-[5rem] rounded-full bg-black" />
            <div className="flex-1 overflow-hidden truncate font-inter text-[1.2rem]  font-medium text-white">
              {username}
            </div>

            <button className="ml-[1rem] flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[1rem] bg-[#191C20] xl:hidden">
              <Image
                className="h-[1.5rem] w-[1.5rem]"
                src="/images/svgs/gear.svg"
                width={16}
                height={16}
                alt=""
              />
            </button>
            {isMenuOpen && (
              <div
                className="absolute bottom-full left-0 w-full overflow-hidden rounded-t-[1rem] bg-black px-4 py-4 opacity-100 transition-opacity duration-300 ease-in"
                style={{ maxHeight: '15rem' }}
              >
                <button
                  disabled
                  className="flex h-[4.1rem] w-full items-center px-4 text-[1.5rem] text-white hover:rounded-[1rem] hover:bg-[#383C42] disabled:opacity-50 disabled:hover:bg-[#383C42]"
                >
                  <Image
                    className="mr-[0.8rem] h-[2rem] w-[2rem]"
                    src="/images/svgs/gear.svg"
                    alt="Taxes"
                    width={10}
                    height={10}
                  />
                  Settings
                </button>
                <button
                  onClick={async () => {
                    await dispatch(authenticatePending())
                    const res = await logOut()
                    await dispatch(authenticateComplete())
                    if (res.data.logout) {
                      router.push(LANDING_SITE)
                      await dispatch(logout())
                    }
                  }}
                  className="flex h-[4.1rem] w-full items-center px-4 text-[1.5rem] text-white hover:rounded-[1rem] hover:bg-[#383C42]"
                >
                  <Image
                    className="mr-[0.8rem] h-[2rem] w-[2rem]"
                    src="/images/svgs/logout.svg"
                    alt="Taxes"
                    width={10}
                    height={10}
                  />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default LeftSideBar
