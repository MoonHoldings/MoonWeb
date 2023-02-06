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
      className="fixed left-0 top-0 z-[51] h-full w-full bg-[#191C20] md:static md:order-1 md:h-[calc(100%-1.7rem)] md:w-[28.8rem] md:rounded-[1.5rem]"
      initial={{ x: '-101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '-101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {/* Header */}
      <div className="mt-[1rem] mb-[4.6rem] flex h-[4.6rem] justify-between px-[1.7rem]">
        <button onClick={leftArrowClick} className="h-full">
          <img
            className="h-[2.5rem] w-[2.5rem]"
            src="/images/svgs/arrow-left.svg"
            alt="arrow left"
          />
        </button>

        <div className="flex items-center">
          <div className="mr-3 flex h-[2.3rem] w-[2.3rem] items-center justify-center rounded-full bg-white">
            <img
              className="h-[1.3rem] w-[1.3rem]"
              src="/images/svgs/moon-holdings-logo-black.svg"
              alt=""
            />
          </div>
          <div className="text-[1.6rem] font-semibold text-[#A6A6A6]">
            MoonHoldings
          </div>
        </div>

        <button className="h-full">
          <img
            className="h-[2.4rem] w-[2.4rem]"
            src="/images/svgs/theme-btn.svg"
            alt="theme button"
          />
        </button>
      </div>
      {/* Menu Options */}
      <div className="sidebar-menu px-[1.7rem]">
        <button className="mb-[1rem] flex h-[4.1rem] w-full items-center text-[1.6rem] text-[#666666]">
          <img
            className="mr-[1.2rem] h-[2.7rem] w-[2.7rem]"
            src="/images/svgs/dashboard.svg"
            alt="Dashboard"
          />
          Dashboard
        </button>
        <hr className=" mb-[1rem] h-[0.2rem] w-full rounded border-0 bg-black" />
        <ul className="dashboard-menu">
          <li className="mb-[1rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[1.6rem] text-[#62EAD2]">
              <img
                className="mr-[1.2rem] h-[2.7rem] w-[2.7rem]"
                src="/images/svgs/crypto.svg"
                alt="Crypto"
              />
              Crypto
            </button>
          </li>
          <li className="mb-[1rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[1.6rem] text-[#FFFFFF]">
              <img
                className="mr-[1.2rem] h-[2.7rem] w-[2.7rem]"
                src="/images/svgs/image.svg"
                alt="NFTs"
              />
              NFTs
            </button>
          </li>
          <li className="mb-[1rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[1.6rem] text-[#666666]">
              <img
                className="mr-[1.2rem] h-[2.7rem] w-[2.7rem]"
                src="/images/svgs/calendar.svg"
                alt="Dashboard"
              />
              Calendar
            </button>
          </li>
          <li className="mb-[1rem]">
            <button className="flex h-[4.1rem] w-full items-center text-[1.6rem] text-[#666666]">
              <img
                className="mr-[1.2rem] h-[2.7rem] w-[2.7rem]"
                src="/images/svgs/ranks.svg"
                alt="Dashboard"
              />
              Ranks (Verified Portfolio Ladder)
            </button>
          </li>
          <li className="">
            <button className="flex h-[4.1rem] w-full items-center text-[1.6rem] text-[#666666]">
              <img
                className="mr-[1.2rem] h-[2.7rem] w-[2.7rem]"
                src="/images/svgs/file.svg"
                alt="Dashboard"
              />
              Taxes (<u>2022 - Gain / loss report (PDF)</u>)
            </button>
          </li>
        </ul>
      </div>
      {/* Profile Info */}
      <div className="profile-info absolute bottom-1 mx-[1.7rem] mb-[1.7rem] flex h-[7.4rem] w-[calc(100%-3.4rem)] items-center justify-between rounded-[1rem] bg-[#242E37] px-[1.4rem] lg:w-[28.8rem]">
        <div className="flex items-center">
          <div className="mr-[1rem] h-[5rem] w-[5rem] rounded-full bg-black" />
          <div className="text-[1.7rem] text-white">Consistent Brave Bull</div>
        </div>
        <button className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[1rem] bg-[#191C20]">
          <img src="/images/svgs/gear.svg" alt="" />
        </button>
      </div>
    </motion.div>
  )
}

export default LeftSideBar
