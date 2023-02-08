import React from 'react'
import { useDispatch } from 'react-redux'
import { changeRightSideBarOpen } from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'

const RightSideBar = () => {
  const dispatch = useDispatch()
  const leftArrowClick = () => {
    dispatch(changeRightSideBarOpen(false))
  }
  return (
    <motion.div
      className="fixed top-0 left-0 z-[51] h-full w-full bg-[rgb(25,28,32)] px-[1.7rem] lg:static lg:order-3 lg:h-auto lg:w-[30.8rem] lg:rounded-[1.5rem] lg:p-[1.5rem]"
      initial={{ x: '101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {/* Header */}
      <div className="mt-[1rem] mb-[2.8rem] h-[4.6rem] lg:hidden">
        <button onClick={leftArrowClick} className="float-right h-full">
          <img
            className="h-[2.4rem] w-[2.4rem] rotate-180"
            src="/images/svgs/arrow-left.svg"
            alt="arrow left"
          />
        </button>
      </div>

      {/* Profile Intro */}
      <div className="profile-intro mb-[2.66rem] flex items-center lg:mb-[2rem] lg:justify-between">
        <div className="mr-[1.2rem] h-[10rem] w-[10rem] rounded-full bg-black lg:h-[9.1rem] lg:w-[9.1rem]"></div>
        <div className="total-value flex h-[8.6rem] flex-col items-end justify-between">
          <div className="text-[3.2rem] text-white lg:text-[2.8rem]">
            $1,890,792
          </div>
          <div className="flex h-[3.5rem] w-[12.2rem] items-center justify-center rounded-[1.6rem] bg-black text-[1.4rem] text-[#62EAD2]">
            <img
              className="mr-[0.6rem] h-[2.4rem] w-[2.4rem]"
              src="/images/svgs/growth-rate.svg"
              alt="Growth Graph"
            />
            +89% 1W
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="search mb-[1rem] grid h-[3.766rem] grid-cols-[1.6rem_auto] items-center gap-[0.8rem] rounded-[0.8rem] border-[1px] border-[#61DAE9] bg-[#25282C] px-[1.6rem] text-[1.4rem] lg:h-[6.4rem]">
        <img
          className="h-[1.6rem] w-[1.6rem]"
          src="/images/svgs/magnifyingglass.svg"
          alt=""
        />
        <input
          className="border-none bg-transparent outline-none placeholder:text-[#61DAE9]"
          type="text"
          placeholder="Search Coins"
        />
      </div>

      <ul className="dashboard-menu text-[1.4rem] ">
        <li className="mb-[1rem] flex h-[6.4rem] items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]">
          <div className="flex h-[4.1rem] w-full items-center text-white">
            <img
              className="mr-[1rem] h-[2rem] w-[2rem]"
              src="/images/svgs/wallet-white.svg"
              alt="Crypto"
            />
            Connect Wallet
          </div>
          <button className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
            <img
              className="h-[0.8rem] w-[0.8rem]"
              src="/images/svgs/+.svg"
              alt="plus sign"
            />
          </button>
        </li>
        <li className="mb-[1rem] flex h-[6.4rem] items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]">
          <div className="flex h-[4.1rem] w-full items-center text-[#FFFFFF]">
            <img
              className="mr-[1rem] h-[2rem] w-[2rem]"
              src="/images/svgs/wallet-white.svg"
              alt="NFTs"
            />
            Add Wallet Addresses
          </div>
          <button className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
            <img
              className="h-[0.8rem] w-[0.8rem]"
              src="/images/svgs/+.svg"
              alt="plus sign"
            />
          </button>
        </li>
        <li className="mb-[1rem] flex h-[6.4rem] items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] lg:mb-0">
          <div className="flex h-[4.1rem] w-full items-center text-[#FFFFFF]">
            <img
              className="mr-[1rem] h-[2rem] w-[2rem]"
              src="/images/svgs/wallet-white.svg"
              alt="NFTs"
            />
            Add Exchanges
          </div>
          <button className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
            <img
              className="h-[0.8rem] w-[0.8rem]"
              src="/images/svgs/+.svg"
              alt="plus sign"
            />
          </button>
        </li>
        <li className="mb-[1rem] flex h-[6.4rem] items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] lg:hidden">
          <div className="flex h-[4.1rem] w-full items-center text-white">
            <img
              className="mr-[1rem] h-[2rem] w-[2rem]"
              src="/images/svgs/net.svg"
              alt="Dashboard"
            />
            Connected Wallets (6)
          </div>
          <button className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
            <img
              className="h-[0.8rem] w-[0.8rem]"
              src="/images/svgs/right-bold-chevron.svg"
              alt="Right Angle Bold Chevron"
            />
          </button>
        </li>
        <li className="mb-[1rem] flex h-[6.4rem] items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] lg:hidden">
          <div className="flex h-[4.1rem] w-full items-center text-white">
            <img
              className="mr-[1rem] h-[2rem] w-[2rem]"
              src="/images/svgs/net.svg"
              alt="Dashboard"
            />
            Connected Exchanges (3)
          </div>
          <button className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
            <img
              className="h-[0.8rem] w-[0.8rem]"
              src="/images/svgs/right-bold-chevron.svg"
              alt="Right Angle Bold Chevron"
            />
          </button>
        </li>
        <li className="flex h-[6.4rem] items-center rounded-[1rem] border border-black bg-[#942B31] px-[1.6rem] lg:hidden">
          <div className="flex w-full items-center text-white">
            <img
              className="mr-[1rem] h-[2rem] w-[2rem]"
              src="/images/svgs/power-off.svg"
              alt="Dashboard"
            />
            Logout
          </div>
        </li>
      </ul>
    </motion.div>
  )
}

export default RightSideBar
