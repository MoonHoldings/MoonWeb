import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeAddWalletModalOpen,
  changeRightSideBarOpen,
  changeWalletsModalOpen,
} from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'

const RightSideBar = () => {
  const dispatch = useDispatch()
  const { disconnect } = useWallet()
  const [allExchanges, setAllExchanges] = useState([1, 2, 3])
  // const [allWallets, setAllWallets] = useState([1, 2, 3, 4])

  const { allWallets } = useSelector((state) => state.wallet)

  const addWalletAddress = () => {
    dispatch(changeAddWalletModalOpen(true))
  }
  const connectWallet = () => {
    dispatch(changeWalletsModalOpen(true))
  }
  const disconnectWallets = () => {
    disconnect()
  }

  const seeAllOrLessExchanges = () => {
    const exchangeNum = allExchanges.length
    if (exchangeNum === 3) {
      setAllExchanges([1, 2, 3, 4, 5, 6, 7])
    } else {
      setAllExchanges(allExchanges.slice(0, 3))
    }
  }
  const seeAllOrLessWallets = () => {
    const walletNum = allWallets.length
    if (walletNum === 4) {
      setAllWallets([1, 2, 3, 4, 5, 6, 7])
    } else {
      setAllWallets(allWallets.slice(0, 4))
    }
  }

  const removeWallet = (wallet) => {
    //
  }

  const leftArrowClick = () => {
    dispatch(changeRightSideBarOpen(false))
  }

  const shrinkText = (text) => {
    const firstSlice = text.slice(0, 4)
    const lastSlice = text.slice(-4)
    return `${firstSlice}...${lastSlice}`
  }

  return (
    <motion.div
      className="fixed top-0 left-0 z-[51] h-full w-full xl:static xl:order-3 xl:mb-[1.5rem] xl:h-auto xl:w-[30.8rem]"
      initial={{ x: '101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {/* Desktop View = buttons section */}
      <div className="main-buttons h-full bg-[rgb(25,28,32)] px-[1.7rem] xl:mb-[1.6rem] xl:rounded-[1.5rem] xl:p-[1.5rem]">
        {/* Header */}
        <div className="mt-[1rem] mb-[2.8rem] h-[4.6rem] xl:hidden">
          <button onClick={leftArrowClick} className="float-right h-full">
            <img
              className="h-[2.4rem] w-[2.4rem] rotate-180"
              src="/images/svgs/arrow-left.svg"
              alt="arrow left"
            />
          </button>
        </div>

        {/* Profile Intro */}
        <div className="profile-intro mb-[2.66rem] flex items-center xl:mb-[2rem] xl:justify-between">
          <div className="mr-[1.2rem] h-[10rem] w-[10rem] rounded-full bg-black xl:h-[9.1rem] xl:w-[9.1rem]"></div>
          <div className="total-value flex h-[8.6rem] flex-col items-end justify-between">
            {/* <div className="text-[3.2rem] text-white xl:text-[2.8rem]">
              $1,890,792
            </div>
            <div className="flex h-[3.5rem] w-[12.2rem] items-center justify-center rounded-[1.6rem] bg-black text-[1.4rem] text-[#62EAD2]">
              <img
                className="mr-[0.6rem] h-[2.4rem] w-[2.4rem]"
                src="/images/svgs/growth-rate.svg"
                alt="Growth Graph"
              />
              +89% 1W
            </div> */}
          </div>
        </div>

        {/* Search */}
        <div className="search mb-[1rem] grid h-[3.766rem] grid-cols-[1.6rem_auto] items-center gap-[0.8rem] rounded-[0.8rem] border-[1px] border-[#61DAE9] bg-[#25282C] px-[1.6rem] text-[1.4rem] xl:h-[6.4rem]">
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
          <li
            onClick={connectWallet}
            className="mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]"
          >
            <div className="flex h-[4.1rem] w-full items-center text-white">
              <img
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/wallet-white.svg"
                alt="Crypto"
              />
              Connect Wallet
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <img
                className="h-[0.8rem] w-[0.8rem]"
                src="/images/svgs/+.svg"
                alt="plus sign"
              />
            </div>
          </li>
          <li
            onClick={addWalletAddress}
            className="mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]"
          >
            <div className="flex h-[4.1rem] w-full items-center text-[#FFFFFF]">
              <img
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/wallet-white.svg"
                alt="NFTs"
              />
              Add Wallet Addresses
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <img
                className="h-[0.8rem] w-[0.8rem]"
                src="/images/svgs/+.svg"
                alt="plus sign"
              />
            </div>
          </li>
          <li className="mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] xl:mb-0">
            <div className="flex h-[4.1rem] w-full items-center text-[#FFFFFF]">
              <img
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/wallet-white.svg"
                alt="NFTs"
              />
              Add Exchanges
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <img
                className="h-[0.8rem] w-[0.8rem]"
                src="/images/svgs/+.svg"
                alt="plus sign"
              />
            </div>
          </li>
          <li className="mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] xl:hidden">
            <div className="flex h-[4.1rem] w-full items-center text-white">
              <img
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/net.svg"
                alt="Dashboard"
              />
              Connected Wallets (6)
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <img
                className="h-[0.8rem] w-[0.8rem]"
                src="/images/svgs/right-bold-chevron.svg"
                alt="Right Angle Bold Chevron"
              />
            </div>
          </li>
          <li className="mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] xl:hidden">
            <div className="flex h-[4.1rem] w-full items-center text-white">
              <img
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/net.svg"
                alt="Dashboard"
              />
              Connected Exchanges (3)
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <img
                className="h-[0.8rem] w-[0.8rem]"
                src="/images/svgs/right-bold-chevron.svg"
                alt="Right Angle Bold Chevron"
              />
            </div>
          </li>
          <li className="flex h-[6.4rem] cursor-pointer items-center rounded-[1rem] border border-black bg-[#942B31] px-[1.6rem] xl:hidden">
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
      </div>

      {/* Connected Exchanges */}
      <div className="connected-exchanges mb-[1.6rem] hidden rounded-[2rem] bg-[#191C20] p-[1.5rem] font-inter xl:block">
        {/* <div className="header mb-[2rem] flex justify-between">
          <h1 className="text-[1.4rem]">Connected Exchanges</h1>
          <button
            onClick={seeAllOrLessExchanges}
            className="text-[1.4rem] font-bold text-[#61DAEA]"
          >
            See All
          </button>
        </div> */}
        {/* All Exchanges */}
        {/* <ul className="all-exchanges mb-[2rem]">
          {allExchanges.map((exchange, index) => (
            <li
              key={index}
              className="flex h-[4.1rem] w-full items-center rounded-[1rem] bg-[#25282C] px-[1.6rem] text-[1.4rem] text-[#FFFFFF]"
            >
              <img
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/net.svg"
                alt="NFTs"
              />
              Coinbase
            </li>
          ))}
        </ul> */}
        {/* <div className="flex h-[6.4rem] items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]">
          <div className="flex h-[4.1rem] w-full items-center text-[1.4rem] text-[#FFFFFF]">
            <img
              className="mr-[1rem] h-[2rem] w-[2rem]"
              src="/images/svgs/net.svg"
              alt="NFTs"
            />
            Disconnect Exchanges
          </div>
          <button className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
            <img
              className="h-[0.8rem] w-[0.8rem]"
              src="/images/svgs/+.svg"
              alt="plus sign"
            />
          </button>
        </div> */}
      </div>

      {/* Connected Wallets */}
      <div className="connected-wallets hidden rounded-[2rem] bg-[#191C20] p-[1.5rem] font-inter xl:block">
        <div className="header mb-[2rem] flex justify-between">
          <h1 className="text-[1.4rem]">Connected Wallets</h1>
          <button
            onClick={seeAllOrLessWallets}
            className="text-[1.4rem] font-bold text-[#61DAEA]"
          >
            See All
          </button>
        </div>

        {/* All Wallets */}
        <ul className="all-wallets mb-[2rem] grid grid-cols-2 gap-[1rem]">
          {allWallets.map((wallet, index) => (
            <li
              key={index}
              onClick={removeWallet(wallet)}
              className="flex h-[4.1rem] w-full items-center rounded-[1rem] bg-[#25282C] px-[1.6rem] text-[1.4rem] text-[#FFFFFF]"
            >
              <img
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/wallet-white.svg"
                alt="NFTs"
              />
              {shrinkText('rodOJIDokxoIO43Jsok8OICocijs')}
            </li>
          ))}
        </ul>

        <div
          onClick={disconnectWallets}
          className="flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]"
        >
          <div className="flex h-[4.1rem] w-full items-center text-[1.4rem] text-[#FFFFFF]">
            <img
              className="mr-[1rem] h-[2rem] w-[2rem]"
              src="/images/svgs/wallet-white.svg"
              alt="NFTs"
            />
            Disconnect Wallets
          </div>
          <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
            <img
              className="h-[0.8rem] w-[0.8rem]"
              src="/images/svgs/+.svg"
              alt="plus sign"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RightSideBar
