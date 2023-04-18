import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import {
  changeAddWalletModalOpen,
  changeRightSideBarOpen,
  changeWalletsModalOpen,
} from 'redux/reducers/utilSlice'

import {
  addAddress,
  removeAllWallets,
  removeWallet,
  refreshWallets,
  refreshFloorPrices,
} from 'redux/reducers/walletSlice'

import {
  ADD_WALLET_ADDRESS,
  CONNECTED_WALLETS,
  REFRESH_WALLETS,
  REFRESH_WALLETS_TITLE,
} from 'app/constants/copy'

import toCurrencyFormat from 'utils/toCurrencyFormat'
import TextBlink from 'components/partials/TextBlink'
import { Tooltip } from 'flowbite-react'
import toShortCurrencyFormat from 'utils/toShortCurrencyFormat'
import isShortCurrencyFormat from 'utils/isShortCurrencyFormat'

const RightSideBar = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { disconnect, publicKey, disconnecting } = useWallet()
  const [allExchanges, setAllExchanges] = useState([1, 2, 3])
  const [currentMenu, setCurrentMenu] = useState('home')
  const [isMobile, setIsMobile] = useState(window?.innerWidth < 768)
  const { allWallets, addAddressStatus, collections } = useSelector(
    (state) => state.wallet
  )
  const { solUsdPrice } = useSelector((state) => state.crypto)

  useEffect(() => {
    if (publicKey && !disconnecting) {
      addWallet()
    }
  }, [publicKey, addWallet, disconnecting])

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!isMobile && currentMenu !== 'home') {
      setCurrentMenu('home')
    }
  }, [isMobile, currentMenu])

  const addWallet = useCallback(async () => {
    if (publicKey) {
      const record = allWallets.find(
        (wallet) => publicKey.toBase58() === wallet
      )

      if (!record) {
        await dispatch(addAddress({ walletAddress: publicKey.toBase58() }))
        dispatch(refreshFloorPrices())
      }
    }
  }, [publicKey, allWallets, dispatch])

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

  const disconnectWallets = async () => {
    dispatch(removeAllWallets())
    disconnect()

    if (router.pathname !== '/nfts') {
      router.push('/nfts')
    }
  }

  const disconnectCurrentWallet = () => {
    removeSingleWallet(publicKey.toBase58())
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

  const leftArrowClick = () => {
    dispatch(changeRightSideBarOpen(false))
  }

  const shrinkText = (text) => {
    const firstSlice = text.slice(0, 3)
    const lastSlice = text.slice(-3)
    return `${firstSlice}...${lastSlice}`
  }

  const refreshWalletsAndFloorPrice = async () => {
    await dispatch(refreshWallets())
    dispatch(refreshFloorPrices())
  }

  const renderConnectWallet = () => {
    return (
      <button
        disabled={addAddressStatus === 'loading'}
        onClick={publicKey ? disconnectCurrentWallet : connectWallet}
        type="button"
        className="xl-[1rem] mb-[1rem] flex h-[6.4rem] w-full cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white hover:border-[#62EAD2] hover:text-[#62EAD2]"
      >
        <div className="flex h-[4.1rem] w-full items-center">
          <Image
            className="mr-[1rem] h-[2rem] w-[2rem]"
            src="/images/svgs/wallet-white.svg"
            width="20"
            height="20"
            alt="Crypto"
          />
          {publicKey ? shrinkText(publicKey.toBase58()) : 'Connect Wallet'}
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
      </button>
    )
  }

  const renderAddAddress = () => {
    return (
      <button
        type="button"
        onClick={addWalletAddress}
        className="xl-[1rem] mb-[1rem] flex h-[6.4rem] w-full cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white hover:border-[#62EAD2] hover:text-[#62EAD2]"
      >
        <div className="flex h-[4.1rem] w-full items-center">
          <Image
            className="mr-[1rem] h-[2rem] w-[2rem]"
            src="/images/svgs/wallet-white.svg"
            width="20"
            height="20"
            alt="NFTs"
          />
          {ADD_WALLET_ADDRESS}
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
      </button>
    )
  }

  const renderRefreshWallet = () => {
    return (
      <Tooltip
        content={REFRESH_WALLETS_TITLE}
        className="rounded-xl px-[2rem] py-[1.5rem]"
        placement="bottom"
        theme={{
          arrow: {
            base: 'absolute z-10 h-5 w-5 rotate-45 bg-gray-900 dark:bg-gray-700',
          },
          content: 'text-[1.3rem]',
          target:
            'hover:text-[#62EAD2]" mb-[1rem] flex h-[5.8rem] w-full cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] text-white px-[1.6rem] hover:border-[#62EAD2]',
        }}
      >
        <button
          type="button"
          onClick={refreshWalletsAndFloorPrice}
          className="w-full"
        >
          <div className="flex h-[4.1rem] w-full items-center justify-center">
            <p className="mr-4 text-[1.9rem]">↻</p>
            {REFRESH_WALLETS}
          </div>
        </button>
      </Tooltip>
    )
  }

  const renderConnectedWalletsMobile = () => {
    return (
      <button
        type="button"
        onClick={() => setCurrentMenu('connectedWallets')}
        className="mb-[1rem] flex h-[6.4rem] w-full cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] hover:border-[#62EAD2] hover:text-[#62EAD2] md:hidden"
      >
        <div className="flex h-[4.1rem] w-full items-center text-white">
          <Image
            className="mr-[1rem] h-[2rem] w-[2rem]"
            src="/images/svgs/net.svg"
            width="20"
            height="20"
            alt="Dashboard"
          />
          {CONNECTED_WALLETS} ({allWallets?.length})
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
      </button>
    )
  }

  const renderLogoutMobile = () => {
    return (
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
    )
  }

  const getPortfolioValue = () => {
    return toCurrencyFormat(
      collections.reduce(
        (total, c) =>
          c.floorPrice
            ? total +
              (parseFloat(c?.floorPrice?.floorPriceLamports) /
                LAMPORTS_PER_SOL) *
                c?.nfts?.length
            : total,
        0
      )
    )
  }

  const getPortfolioValueUsd = () => {
    return `$${toCurrencyFormat(
      collections.reduce(
        (total, c) =>
          c.floorPrice
            ? total +
              (parseFloat(c?.floorPrice?.floorPriceLamports) /
                LAMPORTS_PER_SOL) *
                c?.nfts?.length *
                solUsdPrice
            : total,
        0
      )
    )}`
  }

  const getShortPortfolioValue = () => {
    return toShortCurrencyFormat(
      collections.reduce(
        (total, c) =>
          c.floorPrice
            ? total +
              (parseFloat(c?.floorPrice?.floorPriceLamports) /
                LAMPORTS_PER_SOL) *
                c?.nfts?.length
            : total,
        0
      )
    )
  }

  const getShortPortfolioValueUsd = () => {
    return `$${toShortCurrencyFormat(
      collections.reduce(
        (total, c) =>
          c.floorPrice
            ? total +
              (parseFloat(c?.floorPrice?.floorPriceLamports) /
                LAMPORTS_PER_SOL) *
                c?.nfts?.length *
                solUsdPrice
            : total,
        0
      )
    )}`
  }

  const MENUS = {
    home: (
      <>
        <div className="h-[4.6rem] py-[2.8rem] md:hidden">
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
        <div className="profile-intro mb-[2.66rem] flex items-center md:mb-[2rem] md:justify-between">
          <div className="mr-[1.2rem] h-[10rem] w-[10rem] rounded-full bg-black md:h-[9.1rem] md:w-[9.1rem]"></div>
          <div className="total-value flex h-[8.6rem] flex-col items-end">
            <Tooltip
              className="rounded-xl px-[2rem] py-[1.5rem]"
              content={
                <span className="flex h-full items-center text-[2rem]">
                  {getPortfolioValueUsd()}
                </span>
              }
              placement="left"
              theme={{
                arrow: {
                  base: 'absolute z-10 h-5 w-5 rotate-45 bg-gray-900 dark:bg-gray-700',
                },
              }}
              trigger={
                isShortCurrencyFormat(getShortPortfolioValueUsd())
                  ? 'hover'
                  : null
              }
            >
              <TextBlink
                text={getShortPortfolioValueUsd()}
                className="text-[3.2rem] text-white xl:text-[2.8rem]"
              />
            </Tooltip>
            <Tooltip
              className="rounded-xl px-[2rem] py-[1.5rem]"
              content={
                <span className="flex h-full items-center text-[2rem] text-white">
                  {getPortfolioValue()}
                </span>
              }
              placement="left"
              theme={{
                arrow: {
                  base: 'absolute z-10 h-5 w-5 rotate-45 bg-gray-900 dark:bg-gray-700',
                },
              }}
              trigger={
                isShortCurrencyFormat(getShortPortfolioValue()) ? 'hover' : null
              }
            >
              <div className="flex items-center text-[3.2rem] text-white xl:text-[2.8rem]">
                {getShortPortfolioValue()}
                <Image
                  className="ml-2 inline h-[2rem] w-[2rem] xl:h-[2rem] xl:w-[2rem]"
                  src="/images/svgs/sol-symbol.svg"
                  alt="SOL Symbol"
                  width={0}
                  height={0}
                  unoptimized
                />
              </div>
            </Tooltip>
            {/* <div className="flex h-[3.5rem] w-[12.2rem] items-center justify-center rounded-[1.6rem] bg-black text-[1.4rem] text-[#62EAD2]">
              <Image
                className="mr-[0.6rem] h-[2.4rem] w-[2.4rem]"
                src="/images/svgs/growth-rate.svg"
                alt="Growth Graph"
                width={0}
                height={0}
              />
              +89% 1W
            </div> */}
          </div>
        </div>
        <ul className="dashboard-menu text-[1.4rem]">
          {renderConnectWallet()}
          {renderAddAddress()}
          {renderRefreshWallet()}
          {renderConnectedWalletsMobile()}
        </ul>
      </>
    ),
    connectedWallets: (
      <motion.div
        className="h-full"
        initial={{ x: '100%' }}
        animate={{ x: '0%' }}
        exit={{ x: '100%' }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="flex h-full flex-col justify-between py-[2.8rem] md:hidden">
          <div>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setCurrentMenu('home')}
                className="float-left h-full"
              >
                <Image
                  className="h-[2.4rem] w-[2.4rem]"
                  src="/images/svgs/arrow-left.svg"
                  width="25"
                  height="24"
                  alt="arrow left"
                />
              </button>
              <div className="text-[1.6rem]">Connected Wallets</div>
              <div />
            </div>
            <ul className="all-wallets mb-[2rem] mt-10 grid gap-[1rem]">
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
                    onClick={
                      wallet === publicKey?.toBase58()
                        ? disconnectCurrentWallet
                        : () => removeSingleWallet(wallet)
                    }
                    className="remove-wallet-btn absolute -right-[0.5rem] -top-[0.5rem] hidden h-[2rem] w-[2rem] rounded-full bg-[#0000008b] "
                  >
                    <span className="relative bottom-[0.1rem] font-poppins">
                      x
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            onClick={disconnectWallets}
            className="xl-[1rem] flex h-[6.4rem] w-full cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white hover:border-[#62EAD2] hover:text-[#62EAD2]"
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
          </button>
        </div>
      </motion.div>
    ),
  }

  return (
    <motion.div
      className="fixed left-0 top-0 z-[51] h-full w-full md:static md:order-3 md:mb-[1.5rem] md:h-auto"
      initial={{ x: '101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {/* Desktop View = buttons section */}
      <div className="main-buttons mt-0 h-full bg-[rgb(25,28,32)] px-[1.7rem] md:mb-[1.6rem] md:mt-4 md:rounded-[1.5rem] md:p-[1.5rem] lg:mt-0">
        {MENUS[currentMenu]}
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
      {allWallets.length > 0 && (
        <div className="connected-wallets hidden rounded-[2rem] bg-[#191C20] p-[1.5rem] font-inter md:block">
          <div className="header mb-[2rem] flex justify-between">
            <h1 className="text-[1.4rem]">{CONNECTED_WALLETS}</h1>
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
                  onClick={
                    wallet === publicKey?.toBase58()
                      ? disconnectCurrentWallet
                      : () => removeSingleWallet(wallet)
                  }
                  className="remove-wallet-btn absolute -right-[0.5rem] -top-[0.5rem] hidden h-[2rem] w-[2rem] rounded-full bg-[#0000008b] "
                >
                  <span className="relative bottom-[0.1rem] font-poppins">
                    x
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={disconnectWallets}
            className="xl-[1rem] flex h-[6.4rem] w-full cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white hover:border-[#62EAD2] hover:text-[#62EAD2]"
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
          </button>
        </div>
      )}
    </motion.div>
  )
}

export default RightSideBar
