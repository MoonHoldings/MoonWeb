import React from 'react'
import { motion } from 'framer-motion'
import { useDispatch } from 'react-redux'
import { changeLeftSideBarOpen } from 'redux/reducers/utilSlice'

const LeftSideBar = () => {
  const dispatch = useDispatch()

  const leftArrowClick = () => {
    dispatch(changeLeftSideBarOpen(false))
  }
  return (
    <motion.div
      className="fixed left-0 top-0 z-[51] h-full w-full bg-[#191C20] lg:static lg:order-1 lg:h-auto lg:max-h-[calc(100%-1.5rem)] lg:w-[28.8rem] lg:rounded-[2rem]"
      initial={{ x: '-101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '-101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {/* Header */}
      <div className="mt-[1rem] mb-[4.6rem] flex h-[4.6rem] justify-between px-[1.7rem] lg:mb-[2rem] lg:px-[1.5rem]">
        <button onClick={leftArrowClick} className="h-full lg:hidden">
          <img
            className="h-[2.5rem] w-[2.5rem]"
            src="/images/svgs/arrow-left.svg"
            alt="arrow left"
          />
        </button>

        <div className="flex items-center">
          <div className="mr-3 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full bg-white lg:h-[4rem] lg:w-[4rem]">
            <img
              className="h-[1.3rem] w-[1.3rem] lg:h-[2.25rem] lg:w-[2.25rem]"
              src="/images/svgs/moon-holdings-logo-black.svg"
              alt=""
            />
          </div>
          <div className="text-[1.6rem] font-semibold text-[#A6A6A6] lg:text-[1.4rem] lg:font-medium">
            MoonHoldings
          </div>
        </div>

        <button className="h-full">
          <img
            className="h-[2.4rem] w-[2.4rem] lg:h-[2.5rem] lg:w-[2.5rem]"
            src="/images/svgs/theme-btn.svg"
            alt="theme button"
          />
        </button>
      </div>
      {/* Menu Options */}
      <div className="sidebar-menu px-[1.7rem] text-[1.4rem] font-medium lg:mb-[29.5rem] lg:px-[1.5rem]">
        <button className="mb-[1rem] flex h-[4.1rem] w-full items-center px-[1.6rem] text-[#666666] lg:mb-[2rem]">
          <img
            className="mr-[1rem] h-[2.1rem] w-[2.1rem] lg:h-[2.5rem] lg:w-[2.5rem]"
            src="/images/svgs/dashboard.svg"
            alt="Dashboard"
          />
          Dashboard
        </button>
        <hr className="mb-[1rem] h-[0.2rem] w-full rounded border-0 bg-black lg:mb-[2rem]" />
        <ul className="dashboard-menu">
          <li className="mb-[1rem] px-[1.6rem] lg:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#62EAD2]">
              <img
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] lg:h-[2.5rem] lg:w-[2.5rem]"
                src="/images/svgs/crypto.svg"
                alt="Crypto"
              />
              Crypto
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] lg:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#FFFFFF]">
              <img
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] lg:h-[2.5rem] lg:w-[2.5rem]"
                src="/images/svgs/image.svg"
                alt="NFTs"
              />
              NFTs
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] lg:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <img
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] lg:h-[2.5rem] lg:w-[2.5rem]"
                src="/images/svgs/calendar.svg"
                alt="Dashboard"
              />
              Calendar
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] lg:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <img
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] lg:h-[2.5rem] lg:w-[2.5rem]"
                src="/images/svgs/ranks.svg"
                alt="Dashboard"
              />
              Ranks{' '}
              <span className="lg:hidden">(Verified Portfolio Ladder)</span>
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] lg:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <img
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] lg:h-[2.5rem] lg:w-[2.5rem]"
                src="/images/svgs/insights.svg"
                alt="Insights"
              />
              Insights
            </button>
          </li>
          <li className="mb-[1rem] px-[1.6rem] lg:mb-[2rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <img
                className="mr-[1rem] h-[2.1rem] w-[2.1rem] lg:h-[2.5rem] lg:w-[2.5rem]"
                src="/images/svgs/file.svg"
                alt="Taxes"
              />
              Taxes{' '}
              <span className="lg:hidden">
                (<u>2022 - Gain / loss report (PDF)</u>)
              </span>
            </button>
          </li>
          <li className="mb-[1rem] hidden px-[1.6rem] lg:mb-[2rem] lg:block">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <img
                className="mr-[1rem] h-[2.5rem] w-[2.5rem]"
                src="/images/svgs/gear.svg"
                alt="Taxes"
              />
              Settings
            </button>
          </li>
          <li className="hidden px-[1.6rem] lg:block">
            <button className="flex h-[4.1rem] w-full items-center text-[#666666]">
              <img
                className="mr-[1rem] h-[2.5rem] w-[2.5rem]"
                src="/images/svgs/exit.svg"
                alt="Taxes"
              />
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Profile Info  */}
      <div className="profile-info absolute bottom-1 w-full">
        <div className="mx-[1.7rem] mb-[1.2rem] hidden h-[5.6rem] w-[calc(100%-3.4rem)] items-center justify-between rounded-[1rem] px-[1.4rem] lg:mx-[1.5rem] lg:flex lg:w-[calc(100%-3rem)] lg:bg-[#342B25] lg:px-[1.6rem]">
          <div className="flex items-center">
            <img
              src="/images/svgs/rank-symbol.svg"
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
        </div>
        <div className="mx-[1.7rem] mb-[1.7rem] flex h-[7.4rem] w-[calc(100%-3.4rem)] items-center justify-between rounded-[1rem] bg-[#242E37] px-[1.4rem] lg:mx-[1.5rem] lg:w-[calc(100%-3rem)] lg:px-[0.8rem]">
          <div className="flex items-center">
            <div className="mr-[1rem] h-[5rem] w-[5rem] rounded-full bg-black" />
            <div className="text-[1.4rem] text-white">
              Consistent Brave Bull
            </div>
          </div>
          <button className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[1rem] bg-[#191C20] lg:hidden">
            <img
              className="h-[1.5rem] w-[1.5rem]"
              src="/images/svgs/gear.svg"
              alt=""
            />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default LeftSideBar
