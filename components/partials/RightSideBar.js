import React, { useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeAddWalletModalOpen,
  changeRightSideBarOpen,
  changeWalletsModalOpen,
} from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { removeAllWallets, removeWallet } from 'redux/reducers/walletSlice'
import { useRouter } from 'next/router'

const RightSideBar = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { disconnect, publicKey } = useWallet()
  const [allExchanges, setAllExchanges] = useState([1, 2, 3])
  // const [allWallets, setAllWallets] = useState([1, 2, 3, 4])

  const { allWallets } = useSelector((state) => state.wallet)

  const addWalletAddress = () => {
    dispatch(changeAddWalletModalOpen(true))
  }

  const connectWallet = () => {
    dispatch(changeWalletsModalOpen(true))
  }

  const removeSingleWallet = (wallet) => {
    dispatch(removeWallet(wallet))

    if (router.pathname !== '/nfts') {
      router.push('/nfts')
    }
  }

  const disconnectWallets = () => {
    disconnect()
    dispatch(removeAllWallets())

    if (router.pathname !== '/nfts') {
      router.push('/nfts')
    }
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

  const leftArrowClick = () => {
    dispatch(changeRightSideBarOpen(false))
  }

  const shrinkText = (text) => {
    const firstSlice = text.slice(0, 3)
    const lastSlice = text.slice(-3)
    return `${firstSlice}...${lastSlice}`
  }

  const renderConnectWallet = () => {
    const parseAddress = (address) => {
      const _address = address.toBase58()

      return (
        _address.substring(0, 4) +
        '...' +
        _address.substring(_address.length - 4)
      )
    }

    return (
      <li
        onClick={publicKey ? disconnect : connectWallet}
        className="xl-[1rem] mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]"
      >
        <div className="flex h-[4.1rem] w-full items-center text-white">
          <Image
            className="mr-[1rem] h-[2rem] w-[2rem]"
            src="/images/svgs/wallet-white.svg"
            width="20"
            height="20"
            alt="Crypto"
          />
          {publicKey ? parseAddress(publicKey) : 'Connect Wallet'}
        </div>
        <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
          <Image
            className="h-[0.8rem] w-[0.8rem] rotate-90"
            src={publicKey ? '/images/svgs/x.svg' : '/images/svgs/+.svg'}
            width="12"
            height="12"
            alt="plus sign"
          />
        </div>
      </li>
    )
  }

  return (
    <motion.div
      className="fixed top-0 left-0 z-[51] h-full w-full md:static md:order-3 md:mb-[1.5rem] md:h-auto"
      initial={{ x: '101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {/* Desktop View = buttons section */}
      <div className="main-buttons h-full bg-[rgb(25,28,32)] px-[1.7rem] md:mb-[1.6rem] md:rounded-[1.5rem] md:p-[1.5rem]">
        {/* Header */}
        <div className="mt-[1rem] mb-[2.8rem] h-[4.6rem] md:hidden">
          <button onClick={leftArrowClick} className="float-right h-full">
            <Image
              className="h-[2.4rem] w-[2.4rem] rotate-180"
              src="/images/svgs/arrow-left.svg"
              width="25"
              height="24"
              alt="arrow left"
            />
          </button>
        </div>

        {/* Profile Intro */}
        <div className="profile-intro mb-[2.66rem] flex items-center md:mb-[2rem] md:justify-between">
          <div className="mr-[1.2rem] h-[10rem] w-[10rem] rounded-full bg-black md:h-[9.1rem] md:w-[9.1rem]"></div>
          <div className="total-value flex h-[8.6rem] flex-col items-end justify-between">
            {/* <div className="text-[3.2rem] text-white xl:text-[2.8rem]">
              $1,890,792
            </div>
            <div className="flex h-[3.5rem] w-[12.2rem] items-center justify-center rounded-[1.6rem] bg-black text-[1.4rem] text-[#62EAD2]">
              <Image
                className="mr-[0.6rem] h-[2.4rem] w-[2.4rem]"
                src="/images/svgs/growth-rate.svg"
                alt="Growth Graph"
              />
              +89% 1W
            </div> */}
          </div>
        </div>

        {/* Search */}
        {/* <div className="search mb-[1rem] grid h-[3.766rem] grid-cols-[1.6rem_auto] items-center gap-[0.8rem] rounded-[0.8rem] border-[1px] border-[#61DAE9] bg-[#25282C] px-[1.6rem] text-[1.4rem] xl:h-[6.4rem]">
          <Image
            className="h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/magnifyingglass.svg"
            alt=""
          />
          <input
            className="border-none bg-transparent outline-none placeholder:text-[#61DAE9]"
            type="text"
            placeholder="Search Coins"
          />
        </div> */}

        <ul className="dashboard-menu text-[1.4rem] ">
          {/* <ContextProvider>
            <li>
              <WalletMultiButton />
              <WalletDisconnectButton />
            </li>
          </ContextProvider> */}
          {renderConnectWallet()}
          <li
            onClick={addWalletAddress}
            className="xl-[1rem] mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]"
          >
            <div className="flex h-[4.1rem] w-full items-center text-[#FFFFFF]">
              <Image
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/wallet-white.svg"
                width="20"
                height="20"
                alt="NFTs"
              />
              Add Wallet Address
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <Image
                className="h-[0.8rem] w-[0.8rem]"
                src="/images/svgs/+.svg"
                width="11"
                height="11"
                alt="plus sign"
              />
            </div>
          </li>
          {/* <li className="mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] xl:mb-0">
            <div className="flex h-[4.1rem] w-full items-center text-[#FFFFFF]">
              <Image
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/wallet-white.svg"
                alt="NFTs"
              />
              Add Exchanges
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <Image
                className="h-[0.8rem] w-[0.8rem]"
                src="/images/svgs/+.svg"
                alt="plus sign"
              />
            </div>
          </li> */}
          <li className="mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] md:hidden">
            <div className="flex h-[4.1rem] w-full items-center text-white">
              <Image
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/net.svg"
                width="20"
                height="20"
                alt="Dashboard"
              />
              Connected Wallets (6)
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <Image
                className="h-[0.8rem] w-[0.8rem]"
                src="/images/svgs/right-bold-chevron.svg"
                width="9"
                height="10"
                alt="Right Angle Bold Chevron"
              />
            </div>
          </li>
          {/* <li className="mb-[1rem] flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] md:hidden">
            <div className="flex h-[4.1rem] w-full items-center text-white">
              <Image
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/net.svg"
                width="20"
                height="20"
                alt="Dashboard"
              />
              Connected Exchanges (3)
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <Image
                className="h-[0.8rem] w-[0.8rem]"
                src="/images/svgs/right-bold-chevron.svg"
                width="9"
                height="10"
                alt="Right Angle Bold Chevron"
              />
            </div>
          </li> */}
          <li className="flex h-[6.4rem] cursor-pointer items-center rounded-[1rem] border border-black bg-[#942B31] px-[1.6rem] md:hidden">
            <div className="flex w-full items-center text-white">
              <Image
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/power-off.svg"
                width="25"
                height="25"
                alt="Dashboard"
              />
              Logout
            </div>
          </li>
        </ul>
      </div>

      {/* Connected Exchanges */}
      {/* <div className="connected-exchanges mb-[1.6rem] hidden rounded-[2rem] border bg-[#191C20] p-[1.5rem] font-inter xl:block">
        <div className="header mb-[2rem] flex justify-between">
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
              <Image
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/net.svg"
                alt="NFTs"
              />
              Coinbase
            </li>
          ))}
        </ul>
        <div className="flex h-[6.4rem] items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]">
          <div className="flex h-[4.1rem] w-full items-center text-[1.4rem] text-[#FFFFFF]">
            <Image
              className="mr-[1rem] h-[2rem] w-[2rem]"
              src="/images/svgs/net.svg"
              alt="NFTs"
            />
            Disconnect Exchanges
          </div>
          <button className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
            <Image
              className="h-[0.8rem] w-[0.8rem]"
              src="/images/svgs/+.svg"
              width="11"
              height="11"
              alt="plus sign"
            />
          </button>
        </div>
      </div> */}

      {/* Connected Wallets */}
      {allWallets.length !== 0 ? (
        <div className="connected-wallets hidden rounded-[2rem] bg-[#191C20] p-[1.5rem] font-inter md:block">
          <div className="header mb-[2rem] flex justify-between">
            <h1 className="text-[1.4rem]">Connected Wallets</h1>
            <button
              onClick={seeAllOrLessWallets}
              className="text-[1.4rem] font-bold text-[#61DAEA]"
            >
              {allWallets.length > 4 ? 'See All' : ''}
            </button>
          </div>

          {/* All Wallets */}
          {/* Commenting out grid-cols-2, we use this once we have at least 6 wallets */}
          {/* <ul className="all-wallets mb-[2rem] grid grid-cols-2 gap-[1rem]"> */}
          <ul className="all-wallets mb-[2rem] grid gap-[1rem]">
            {allWallets.map((wallet, index) => (
              <li
                key={index}
                className="single-wallet-btn relative flex h-[4.1rem] w-full items-center rounded-[1rem] bg-[#25282C] px-[1.6rem] text-[1.4rem] text-[#FFFFFF]"
              >
                <Image
                  className="mr-[1rem] h-[2rem] w-[2rem]"
                  src="/images/svgs/wallet-white.svg"
                  width="20"
                  height="20"
                  alt="NFTs"
                />
                {shrinkText(`${wallet}`)}
                <button
                  onClick={() => removeSingleWallet(wallet)}
                  className="remove-wallet-btn absolute -right-[0.5rem] -top-[0.5rem] hidden h-[2rem] w-[2rem] rounded-full bg-[#0000008b] "
                >
                  <span className="relative bottom-[0.1rem] font-poppins">
                    x
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div
            onClick={disconnectWallets}
            className="flex h-[6.4rem] cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem]"
          >
            <div className="flex h-[4.1rem] w-full items-center text-[1.4rem] text-[#FFFFFF]">
              <Image
                className="mr-[1rem] h-[2rem] w-[2rem]"
                src="/images/svgs/wallet-white.svg"
                width="20"
                height="20"
                alt="NFTs"
              />
              Disconnect Wallets
            </div>
            <div className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]">
              <Image
                className="h-[0.8rem] w-[0.8rem] rotate-45"
                src="/images/svgs/+.svg"
                width="11"
                height="11"
                alt="plus sign"
              />
            </div>
          </div>
        </div>
      ) : (
        ''
      )}
    </motion.div>
  )
}

export default RightSideBar
