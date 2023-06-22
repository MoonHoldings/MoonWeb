import React, { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useMutation } from '@apollo/client'
import {
  changeAddWalletModalOpen,
  changeRightSideBarOpen,
  changeWalletsModalOpen,
  changeNftModalOpen,
  reloadDashboard,
} from 'redux/reducers/utilSlice'
import {
  deselectAllNfts,
  fetchUserNfts,
  selectNft,
} from 'redux/reducers/nftSlice'
import {
  ADD_WALLET_ADDRESS,
  CONNECTED_WALLETS,
  REFRESH_WALLETS,
  REFRESH_WALLETS_TITLE,
} from 'application/constants/copy'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import TextBlink from 'components/partials/TextBlink'
import { Spin, Tooltip, notification } from 'antd'
import toShortCurrencyFormat from 'utils/toShortCurrencyFormat'
import isShortCurrencyFormat from 'utils/isShortCurrencyFormat'
import { SearchInput } from 'components/forms/SearchInput'
import {
  ADD_USER_WALLET,
  REFRESH_USER_WALLETS,
  REMOVE_ALL_USER_WALLETS,
  REMOVE_USER_WALLET,
} from 'utils/mutations'
import { reloadPortfolio } from 'redux/reducers/portfolioSlice'
import { getUserWallets } from 'redux/reducers/walletSlice'
import mergeClasses from 'utils/mergeClasses'
import { displayNotifModal } from 'utils/notificationModal'
import CopyClipboardNotification from 'components/modals/CopyClipboardNotification'

const RightSideBar = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const [show, setShow] = useState(false)
  const { disconnect, publicKey, disconnecting } = useWallet()
  const [allExchanges, setAllExchanges] = useState([1, 2, 3])
  const [currentMenu, setCurrentMenu] = useState('home')
  const [isMobile, setIsMobile] = useState(window?.innerWidth < 768)
  const [removingWalletAddress, setRemovingWalletAddress] = useState(null)
  const {
    addAddressStatus,
    wallets: userWallets,
    exchangeWallets,
  } = useSelector((state) => state.wallet)
  const { tokenHeader } = useSelector((state) => state.auth)

  const { collections, selectedNfts } = useSelector((state) => state.nft)
  const {
    solUsdPrice,
    currentCurrency,
    selectedCurrencyPrice,
    loading: loadingCrypto,
  } = useSelector((state) => state.crypto)

  const [addUserWallet, { loading: addingUserWallet }] = useMutation(
    ADD_USER_WALLET,
    { context: tokenHeader }
  )
  const [refreshUserWallets, { loading: refreshingUserWallets }] = useMutation(
    REFRESH_USER_WALLETS,
    { context: tokenHeader }
  )
  const [removeUserWallet, { loading: removingUserWallet }] = useMutation(
    REMOVE_USER_WALLET,
    { context: tokenHeader }
  )
  const [removeAllUserWallets, { loading: removingAllUserWallets }] =
    useMutation(REMOVE_ALL_USER_WALLETS, { context: tokenHeader })

  const {
    loading: portfolioLoading,
    cryptoTotal,
    loanTotal,
    borrowTotal,
  } = useSelector((state) => state.portfolio)

  const [api, contextHolder] = notification.useNotification()

  useEffect(() => {
    dispatch(getUserWallets({}))
  }, [])

  useEffect(() => {
    const shouldCallAddWallet =
      router.pathname.includes('nfts') ||
      router.pathname.includes('crypto') ||
      router.pathname.includes('dashboard')

    if (publicKey && !disconnecting && shouldCallAddWallet) {
      addConnectedWallet()
    }
  }, [publicKey, addConnectedWallet, disconnecting, router])

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

  const addConnectedWallet = useCallback(async () => {
    if (publicKey) {
      const res = await addUserWallet({
        variables: { verified: true, wallet: publicKey.toBase58() },
      })

      if (!res?.data?.addUserWallet) {
        displayNotifModal(
          'warning',
          'Wallet is already connected to a different user',
          api
        )
        disconnectCurrentWallet()
      } else {
        reloadData()
      }
    }
  }, [addUserWallet, dispatch, publicKey])

  const addWalletAddress = () => {
    dispatch(changeAddWalletModalOpen(true))
  }
  const transferNftModal = (type) => {
    if (publicKey) dispatch(changeNftModalOpen({ isShow: true, type: type }))
    else {
      return displayNotifModal(
        'warning',
        `Warning! No wallet is connected.`,
        api
      )
    }
  }

  const connectWallet = () => {
    dispatch(changeWalletsModalOpen(true))
  }

  const removeSingleWallet = async (wallet) => {
    await removeUserWallet({ variables: { wallet } }, tokenHeader)
    reloadData()
    dispatch(deselectAllNfts())
  }

  const disconnectWallets = async () => {
    if (userWallets?.length) {
      await removeAllUserWallets(tokenHeader)
      reloadData()
    }

    dispatch(deselectAllNfts())
    disconnect()
  }

  const disconnectCurrentWallet = () => {
    dispatch(deselectAllNfts())
    removeSingleWallet(publicKey.toBase58())
    disconnect()
  }

  const reloadData = () => {
    dispatch(getUserWallets({}))
    dispatch(fetchUserNfts({}))
    dispatch(reloadPortfolio(true))
    dispatch(reloadDashboard(true))
  }

  const seeAllOrLessExchanges = () => {
    const exchangeNum = allExchanges.length

    if (exchangeNum === 3) {
      setAllExchanges([1, 2, 3, 4, 5, 6, 7])
    } else {
      setAllExchanges(allExchanges.slice(0, 3))
    }
  }

  // const seeAllOrLessWallets = () => {
  //   const walletNum = allWallets.length

  //   if (walletNum === 4) {
  //     setAllWallets([1, 2, 3, 4, 5, 6, 7])
  //   } else {
  //     setAllWallets(allWallets.slice(0, 4))
  //   }
  // }

  const leftArrowClick = () => {
    dispatch(changeRightSideBarOpen(false))
  }

  const shrinkText = (text) => {
    return text.substring(0, 5)
  }

  const refreshWalletsAndFloorPrice = async () => {
    if (userWallets?.length || exchangeWallets?.length) {
      await refreshUserWallets(tokenHeader)
      dispatch(fetchUserNfts({}))
      dispatch(reloadPortfolio())
    }
  }

  const renderConnectWallet = () => {
    return (
      <button
        disabled={addAddressStatus === 'loading' || refreshingUserWallets}
        type="button"
        className={`xl-[1rem] mb-[1rem] flex h-[6.4rem] w-full items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white ${
          refreshingUserWallets
            ? 'opacity-50'
            : 'cursor-pointer hover:border-[#62EAD2] hover:text-[#62EAD2]'
        }`}
      >
        <div className="flex h-[4.1rem] w-full items-center">
          <Image
            className="mr-[1rem] h-[2rem] w-[2rem]"
            src="/images/svgs/wallet-white.svg"
            width="20"
            height="20"
            alt="Crypto"
          />
          {publicKey ? shrinkText(publicKey.toBase58()) : 'Connect Wallet'}{' '}
          {addingUserWallet && <Spin className="ml-3" />}
        </div>
        <div
          onClick={publicKey ? disconnectCurrentWallet : connectWallet}
          className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]"
        >
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
        disabled={refreshingUserWallets}
        className={`xl-[1rem] mb-[1rem] flex h-[6.4rem] w-full items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white ${
          refreshingUserWallets
            ? 'opacity-50'
            : 'cursor-pointer hover:border-[#62EAD2] hover:text-[#62EAD2]'
        }`}
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

  const renderMassButton = (type) => {
    return (
      <button
        type="button"
        onClick={() => transferNftModal(type)}
        disabled={refreshingUserWallets}
        className={mergeClasses(
          'xl-[1rem]',
          'mb-[1rem]',
          'flex',
          'h-[6.4rem]',
          'w-full',
          'items-center',
          'border',
          'rounded-[1rem]',
          'border-black',
          'bg-[#2A3649]',
          'px-[1.6rem]',
          'text-white',
          refreshingUserWallets
            ? 'opacity-50'
            : 'cursor-pointer hover:border-[#62EAD2] hover:text-[#62EAD2]',
          type == 'BURN' ? 'bg-[#773429]' : 'bg-[#2A3649]'
        )}
      >
        <div className="flex h-[4.1rem] w-full items-center justify-center">
          <Image
            className="mr-[1rem] h-[2rem] w-[2rem]"
            src={
              type == 'BURN'
                ? '/images/svgs/burn.svg'
                : '/images/svgs/transfer.svg'
            }
            width="20"
            height="20"
            alt="NFTs"
          />
          <h1>{type == 'BURN' ? 'MASS BURN' : 'MASS TRANSFER'}</h1>
        </div>
      </button>
    )
  }

  const renderRefreshWallet = () => {
    return (
      <Tooltip
        color="#1F2126"
        title={<span className="text-[1.5rem]">{REFRESH_WALLETS_TITLE}</span>}
      >
        <button
          type="button"
          onClick={refreshWalletsAndFloorPrice}
          disabled={refreshingUserWallets}
          className={`mb-[1rem] flex h-[5.8rem] w-full items-center justify-center rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white ${
            !refreshingUserWallets &&
            'cursor-pointer hover:border-[#62EAD2] hover:text-[#62EAD2]'
          }`}
        >
          <div className="flex w-full items-center justify-center">
            <p className="mr-4 text-[1.9rem]">↻</p>
            {REFRESH_WALLETS}
            {refreshingUserWallets && <Spin className="ml-3" />}
          </div>
        </button>
      </Tooltip>
    )
  }

  const renderDeselectAll = () => {
    return (
      <Tooltip
        color="#1F2126"
        title={<span className="text-[1.5rem]">{REFRESH_WALLETS_TITLE}</span>}
      >
        <button
          type="button"
          onClick={() => dispatch(deselectAllNfts())}
          className={`mb-[1rem] flex h-[5.8rem] w-full items-center justify-center rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white ${
            !refreshingUserWallets &&
            'cursor-pointer hover:border-[#62EAD2] hover:text-[#62EAD2]'
          }`}
        >
          <div className="flex w-full items-center justify-center">
            <Image
              className="mr-[1rem] h-[1.8rem] w-[1.8rem] rotate-45"
              src={'/images/svgs/+.svg'}
              width="20"
              height="20"
              alt="NFTs"
            />

            {'DESELECT ALL'}
            {refreshingUserWallets && <Spin className="ml-3" />}
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
          {CONNECTED_WALLETS} ({userWallets?.length})
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

  const calculatePortfolioValue = () => {
    return collections?.reduce((total, c) => {
      if (c.floorPrice) {
        const value =
          (parseFloat(c.floorPrice) / LAMPORTS_PER_SOL) * c?.nfts?.length
        return total + value
      }
      return total
    }, 0)
  }

  const getPortfolioValue = () => {
    if (router.pathname.includes('nfts')) {
      const value = calculatePortfolioValue()
      return `${toCurrencyFormat(
        (value * solUsdPrice) / selectedCurrencyPrice
      )}`
    }

    if (router.pathname.includes('crypto')) {
      return `${toCurrencyFormat(cryptoTotal / selectedCurrencyPrice)}`
    }

    if (router.pathname.includes('dashboard')) {
      const value = calculatePortfolioValue()
      return `${toCurrencyFormat(
        ((value + loanTotal + borrowTotal) * solUsdPrice) /
          selectedCurrencyPrice +
          cryptoTotal / selectedCurrencyPrice
      )}`
    }
  }

  const getPortfolioValueUsd = () => {
    if (router.pathname.includes('nfts')) {
      const value = calculatePortfolioValue()
      return `$${toCurrencyFormat(value * solUsdPrice)}`
    }

    if (router.pathname.includes('crypto')) {
      return `$${toCurrencyFormat(cryptoTotal)}`
    }

    if (router.pathname.includes('dashboard')) {
      const value = calculatePortfolioValue()
      return `$${toCurrencyFormat(
        (value + loanTotal + borrowTotal) * solUsdPrice + cryptoTotal
      )}`
    }
  }

  const getShortPortfolioValue = () => {
    if (router.pathname.includes('nfts')) {
      const value = calculatePortfolioValue()
      return `${toShortCurrencyFormat(
        (value * solUsdPrice) / selectedCurrencyPrice
      )}`
    }

    if (router.pathname.includes('crypto')) {
      return `${toShortCurrencyFormat(cryptoTotal / selectedCurrencyPrice)}`
    }

    if (router.pathname.includes('dashboard')) {
      const value = calculatePortfolioValue()

      return `${toShortCurrencyFormat(
        ((value + loanTotal + borrowTotal) * solUsdPrice) /
          selectedCurrencyPrice +
          cryptoTotal / selectedCurrencyPrice
      )}`
    }
  }

  const getShortPortfolioValueUsd = () => {
    if (router.pathname.includes('nfts')) {
      const value = calculatePortfolioValue()
      return `$${toShortCurrencyFormat(value * solUsdPrice)}`
    }

    if (router.pathname.includes('crypto')) {
      return `$${toShortCurrencyFormat(cryptoTotal)}`
    }

    if (router.pathname.includes('dashboard')) {
      const value = calculatePortfolioValue()
      return `$${toShortCurrencyFormat(
        (value + loanTotal + borrowTotal) * solUsdPrice + cryptoTotal
      )}`
    }
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
              color="#1F2126"
              title={
                <span className="flex h-full items-center text-[2rem] text-white">
                  {getPortfolioValueUsd()}
                </span>
              }
              trigger={'hover'}
            >
              <div>
                <TextBlink
                  text={getShortPortfolioValueUsd()}
                  className="text-[3.2rem] text-white xl:text-[2.8rem]"
                />
              </div>
            </Tooltip>
            <Tooltip
              color="#1F2126"
              title={
                <span className="flex h-full items-center text-[2rem] text-white">
                  {getPortfolioValue()}
                </span>
              }
              trigger={
                isShortCurrencyFormat(getShortPortfolioValue()) ? 'hover' : null
              }
            >
              <div className="flex items-center text-[3.2rem] text-white xl:text-[2.8rem]">
                {loadingCrypto ? (
                  <svg
                    aria-hidden="true"
                    className="mr-2 h-14 w-14 animate-spin fill-teal-400 text-gray-200 dark:text-gray-600"
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
                ) : (
                  <>
                    {getShortPortfolioValue()}
                    {currentCurrency === 'BTC'
                      ? ' ₿'
                      : currentCurrency == 'ETH'
                      ? ' Ξ'
                      : ' ◎'}
                  </>
                )}
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
          <SearchInput loading={portfolioLoading || refreshingUserWallets} />
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
              {userWallets?.map((wallet, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(wallet.address)
                      setShow(true)
                    }}
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
                      {shrinkText(`${wallet.address}`)}
                      {removingUserWallet && <Spin className="ml-3" />}
                    </div>
                    <div
                      onClick={
                        wallet.address === publicKey?.toBase58()
                          ? disconnectCurrentWallet
                          : (e) => {
                              e.stopPropagation()
                              removeSingleWallet(wallet.address)
                            }
                      }
                      className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]"
                    >
                      <Image
                        className="h-[0.8rem] w-[0.8rem] rotate-45"
                        src="/images/svgs/+.svg"
                        width="11"
                        height="11"
                        alt="plus sign"
                      />
                    </div>
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

  useEffect(() => {
    if (containerRef.current != null)
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight)
  }, [selectedNfts])
  const containerRef = useRef(null)

  const renderNftAddress = () => {
    return (
      selectedNfts?.length > 0 && (
        <div className="connected-wallets  hidden rounded-[2rem] bg-[#191C20] p-[1.5rem] md:mb-[1.6rem] md:block">
          <div className="header mb-[2rem] flex justify-between">
            <h1 className="text-[1.4rem] text-white">Selected NFts</h1>
            <button
              // onClick={seeAllOrLessWallets}
              className="text-[1.4rem] font-bold text-[#61DAEA]"
            >
              {userWallets?.length > 4 ? 'See All' : ''}
            </button>
          </div>

          <ul
            className="all-wallets  mb-[2rem] grid max-h-64 w-full gap-[1rem] overflow-y-auto"
            ref={containerRef}
          >
            {selectedNfts?.map((nft, index) => (
              <li key={index}>
                <button
                  type="button"
                  disabled={refreshingUserWallets}
                  className={`xl-[1rem] flex h-[4rem] w-full items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white ${
                    refreshingUserWallets
                      ? 'opacity-50'
                      : 'cursor-pointer hover:border-[#62EAD2] hover:text-[#62EAD2]'
                  }`}
                >
                  <div className="flex h-[4.1rem] w-full items-center text-[1.4rem] text-[#FFFFFF]">
                    {nft.name}
                    {removingUserWallet && <Spin className="ml-3" />}
                  </div>
                  <div
                    onClick={() => dispatch(selectNft(nft))}
                    className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]"
                  >
                    <Image
                      className="h-[0.8rem] w-[0.8rem] rotate-45"
                      src="/images/svgs/+.svg"
                      width="11"
                      height="11"
                      alt="plus sign"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
          <ul className="dashboard-menu text-[1.4rem]">
            {renderDeselectAll()}
            {renderMassButton('TRANSFER')}
            {renderMassButton('BURN')}
          </ul>
        </div>
      )
    )
  }

  const renderConnectedWallets = () => {
    return (
      userWallets?.length > 0 && (
        <div className="connected-wallets hidden rounded-[2rem] bg-[#191C20] p-[1.5rem] font-inter md:block">
          <div className="header mb-[2rem] flex justify-between">
            <h1 className="text-[1.4rem] text-white">{CONNECTED_WALLETS}</h1>
            <button
              // onClick={seeAllOrLessWallets}
              className="text-[1.4rem] font-bold text-[#61DAEA]"
            >
              {userWallets?.length > 4 ? 'See All' : ''}
            </button>
          </div>

          <ul
            className={`all-wallets mb-[2rem] grid gap-[1rem] ${
              userWallets?.length > 1 && 'grid-cols-2'
            }`}
          >
            {userWallets?.map((wallet, index) => (
              <li key={index}>
                <button
                  type="button"
                  disabled={refreshingUserWallets}
                  className={`xl-[1rem] flex h-[6.4rem] w-full cursor-default items-center justify-between rounded-[1rem] border border-black bg-[#25282C] ${
                    userWallets?.length > 1 ? 'px-[1.2rem]' : 'px-[1.6rem]'
                  } text-white ${
                    refreshingUserWallets
                      ? 'opacity-50'
                      : 'hover:border-[#62EAD2] hover:text-[#62EAD2]'
                  }`}
                >
                  <div className="flex h-[4.1rem] w-full items-center text-[1.4rem] text-[#FFFFFF]">
                    <div
                      onClick={() => {
                        navigator.clipboard.writeText(wallet.address)
                        setShow(true)
                      }}
                      className="flex h-[3.2rem] w-[7rem] cursor-copy items-center justify-center rounded-2xl bg-black active:bg-[#62EAD2] active:text-black"
                    >
                      {shrinkText(`${wallet.address}`)}
                    </div>
                    {removingWalletAddress === wallet.address &&
                      removingUserWallet && <Spin className="ml-3" />}
                  </div>
                  <div
                    onClick={
                      wallet.address === publicKey?.toBase58()
                        ? disconnectCurrentWallet
                        : (e) => {
                            e.stopPropagation()
                            setRemovingWalletAddress(wallet.address)
                            removeSingleWallet(wallet.address)
                          }
                    }
                    className={`flex h-[3.2rem] w-[3.2rem] cursor-pointer items-center justify-center rounded-[0.8rem] bg-[#191C20] p-[1rem] ${
                      removingWalletAddress === wallet.address &&
                      removingUserWallet &&
                      'hidden'
                    }`}
                  >
                    <Image
                      className="h-[0.8rem] w-[0.8rem] rotate-45"
                      src="/images/svgs/+.svg"
                      width="11"
                      height="11"
                      alt="plus sign"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={refreshingUserWallets}
            className={`xl-[1rem] flex h-[6.4rem] w-full items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white ${
              refreshingUserWallets
                ? 'opacity-50'
                : 'cursor-pointer hover:border-[#62EAD2] hover:text-[#62EAD2]'
            }`}
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
              {removingAllUserWallets && <Spin className="ml-3" />}
            </div>
            <div
              onClick={disconnectWallets}
              className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]"
            >
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
      )
    )
  }

  return (
    <>
      <div className="absolute right-24 top-24 z-[52]">
        <CopyClipboardNotification show={show} setShow={setShow} />
      </div>
      <motion.div
        className="fixed left-0 top-0 z-[51] h-full w-full md:sticky md:top-8 md:order-3 md:mb-[1.5rem] md:h-auto"
        initial={{ x: '101%' }}
        animate={{ x: '0%' }}
        exit={{ x: '101%' }}
        transition={{ duration: 0.6, type: 'spring' }}
      >
        <div className="main-buttons mt-0 h-full bg-[rgb(25,28,32)] px-[1.7rem] md:mb-[1.6rem] md:mt-4 md:rounded-[1.5rem] md:p-[1.5rem] lg:mt-0">
          {MENUS[currentMenu]}
        </div>
        {contextHolder}
        {/* Connected Exchanges */}
        {/* <div className="connected-exchanges mb-[1.6rem] hidden rounded-[2rem] border bg-[#191C20] p-[1.5rem] font-inter xl:block">
        <div className="header mb-[2rem] flex justify-between">
          <h1 className="text-[1.4rem]">Connected Exchanges</h1>
          <button
            onClick={seeAllOrLessExchanges}
            className="text-[1.4rem] font-bold text-[#61DAEA]"
          >
            See All */}
        {/* </button> */}

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
        {renderNftAddress()}
        {renderConnectedWallets()}
      </motion.div>
    </>
  )
}

export default RightSideBar
