import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import {
  changeAddWalletModalOpen,
  changeRightSideBarOpen,
  changeWalletsModalOpen,
  changeCoinModalOpen,
  reloadDashboard,
} from 'redux/reducers/utilSlice'
import { fetchUserNfts, reloadWallets } from 'redux/reducers/walletSlice'
import {
  ADD_WALLET_ADDRESS,
  CONNECTED_WALLETS,
  REFRESH_WALLETS,
  REFRESH_WALLETS_TITLE,
} from 'application/constants/copy'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import TextBlink from 'components/partials/TextBlink'
import { Spin, Tooltip } from 'antd'
import toShortCurrencyFormat from 'utils/toShortCurrencyFormat'
import isShortCurrencyFormat from 'utils/isShortCurrencyFormat'
import { SearchInput } from 'components/forms/SearchInput'
import {
  ADD_USER_WALLET,
  REFRESH_USER_WALLETS,
  REMOVE_ALL_USER_WALLETS,
  REMOVE_USER_WALLET,
} from 'utils/mutations'
import { GET_USER_WALLETS } from 'utils/queries'
import { reloadPortfolio } from 'redux/reducers/portfolioSlice'

const RightSideBar = () => {
  const dispatch = useDispatch()
  const router = useRouter()

  const { disconnect, publicKey, disconnecting } = useWallet()
  const [allExchanges, setAllExchanges] = useState([1, 2, 3])
  const [currentMenu, setCurrentMenu] = useState('home')
  const [isMobile, setIsMobile] = useState(window?.innerWidth < 768)
  const { addAddressStatus, collections, reloadWallet } = useSelector(
    (state) => state.wallet
  )
  const { solUsdPrice } = useSelector((state) => state.crypto)
  const [userWallets, setUserWallets] = useState(null)
  const [isSet, setIsSet] = useState(false)
  const [getUserWallet, { data: userWalletsData, loading: loadingWalletData }] =
    useLazyQuery(GET_USER_WALLETS, {
      fetchPolicy: 'no-cache',
    })

  const [addUserWallet, { loading: addingUserWallet }] =
    useMutation(ADD_USER_WALLET)
  const [refreshUserWallets, { loading: refreshingUserWallets }] =
    useMutation(REFRESH_USER_WALLETS)
  const [removeUserWallet, { loading: removingUserWallet }] =
    useMutation(REMOVE_USER_WALLET)
  const [removeAllUserWallets, { loading: removingAllUserWallets }] =
    useMutation(REMOVE_ALL_USER_WALLETS)

  const { loading: portfolioLoading } = useSelector((state) => state.portfolio)

  useEffect(() => {
    console.log(reloadWallet)
    if (userWallets == null || reloadWallet) {
      dispatch(reloadWallets(false))
      setUserWallets([])
      getUserWallet({
        variables: {
          type: 'Auto',
        },
      })
    }
  }, [userWallets, getUserWallet, reloadWallet, dispatch])

  useEffect(() => {
    async function getWalletData() {
      console.log(userWalletsData)
      if (!loadingWalletData && userWalletsData && !isSet) {
        setUserWallets(userWalletsData.getUserWallets ?? [])
      }
    }

    getWalletData()
  }, [userWalletsData, loadingWalletData, userWallets, isSet])

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
      await addUserWallet({
        variables: { verified: true, wallet: publicKey.toBase58() },
      })

      await getUserWallet({
        variables: {
          type: 'Auto',
        },
      })
      dispatch(fetchUserNfts())
      dispatch(reloadPortfolio())
      dispatch(reloadDashboard(true))
    }
  }, [addUserWallet, dispatch, publicKey, getUserWallet])

  const addWalletAddress = () => {
    dispatch(changeAddWalletModalOpen(true))
  }

  const connectWallet = () => {
    dispatch(changeWalletsModalOpen(true))
  }

  const removeSingleWallet = async (wallet) => {
    await removeUserWallet({ variables: { wallet } })
    await getUserWallet({
      variables: {
        type: 'Auto',
      },
    })
    dispatch(fetchUserNfts())
    dispatch(reloadPortfolio())
    dispatch(reloadDashboard(true))
  }

  const disconnectWallets = async () => {
    if (userWallets.length) {
      await removeAllUserWallets()
      await getUserWallet({
        variables: {
          type: 'Auto',
        },
      })
      dispatch(fetchUserNfts())
      dispatch(reloadDashboard(true))
    }

    disconnect()
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
    if (userWallets.length) {
      await refreshUserWallets()
      dispatch(fetchUserNfts())
    }
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
          {publicKey ? shrinkText(publicKey.toBase58()) : 'Connect Wallet'}{' '}
          {addingUserWallet && <Spin className="ml-3" />}
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
        color="#1F2126"
        title={<span className="text-[1.5rem]">{REFRESH_WALLETS_TITLE}</span>}
      >
        <button
          type="button"
          onClick={refreshWalletsAndFloorPrice}
          className='hover:text-[#62EAD2]" mb-[1rem] flex h-[5.8rem] w-full cursor-pointer items-center justify-center rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white hover:border-[#62EAD2]'
          disabled={refreshingUserWallets}
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

  const getPortfolioValue = () => {
    return toCurrencyFormat(
      collections?.reduce(
        (total, c) =>
          c.floorPrice
            ? total +
              (parseFloat(c?.floorPrice) / LAMPORTS_PER_SOL) * c?.nfts?.length
            : total,
        0
      )
    )
  }

  const getPortfolioValueUsd = () => {
    return `$${toCurrencyFormat(
      collections?.reduce(
        (total, c) =>
          c.floorPrice
            ? total +
              (parseFloat(c?.floorPrice) / LAMPORTS_PER_SOL) *
                c?.nfts?.length *
                solUsdPrice
            : total,
        0
      )
    )}`
  }

  const getShortPortfolioValue = () => {
    return toShortCurrencyFormat(
      collections?.reduce(
        (total, c) =>
          c.floorPrice
            ? total +
              (parseFloat(c?.floorPrice) / LAMPORTS_PER_SOL) * c?.nfts?.length
            : total,
        0
      )
    )
  }

  const getShortPortfolioValueUsd = () => {
    return `$${toShortCurrencyFormat(
      collections?.reduce(
        (total, c) =>
          c.floorPrice
            ? total +
              (parseFloat(c?.floorPrice) / LAMPORTS_PER_SOL) *
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
          <SearchInput loading={portfolioLoading} />
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
                    onClick={
                      wallet.address === publicKey?.toBase58()
                        ? disconnectCurrentWallet
                        : () => removeSingleWallet(wallet.address)
                    }
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
              {userWallets.length > 4 ? 'See All' : ''}
            </button>
          </div>

          <ul className="all-wallets mb-[2rem] grid gap-[1rem]">
            {userWallets?.map((wallet, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={
                    wallet.address === publicKey?.toBase58()
                      ? disconnectCurrentWallet
                      : () => removeSingleWallet(wallet.address)
                  }
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
              {removingAllUserWallets && <Spin className="ml-3" />}
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
      )
    )
  }

  return (
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

      {renderConnectedWallets()}
    </motion.div>
  )
}

export default RightSideBar
