import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { useLazyQuery } from '@apollo/client'
import {
  changeWalletsModalOpen,
  changeLendRightSidebarOpen,
  changeRevokeOfferModalOpen,
  changeRepayModalOpen,
} from 'redux/reducers/utilSlice'
import mergeClasses from 'utils/mergeClasses'
import { MY_LOANS, MY_OFFERS } from 'utils/queries'
import toShortCurrencyFormat from 'utils/toShortCurrencyFormat'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { setRevokeLoan, setRepayLoan } from 'redux/reducers/sharkifyLendSlice'
import calculateLendInterest from 'utils/calculateLendInterest'
import calculateBorrowInterest from 'utils/calculateBorrowInterest'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import { addSeconds, differenceInSeconds, format } from 'date-fns'

const RightSideBar = () => {
  const dispatch = useDispatch()

  const { disconnect, publicKey } = useWallet()
  const { addAddressStatus } = useSelector((state) => state.wallet)
  const { lendRightSideBarOpen } = useSelector((state) => state.util)
  const [activeTab, setActiveTab] = useState('offers')

  const [getMyOffers, { data: myOffers, loading: loadingOffers }] =
    useLazyQuery(MY_OFFERS)
  const [getMyLoans, { data: myLoans, loading: loadingMyLoans }] =
    useLazyQuery(MY_LOANS)

  useEffect(() => {
    if (publicKey && !loadingOffers) {
      getMyOffers({
        variables: {
          args: {
            filter: {
              lenderWallet: publicKey.toBase58(),
              type: 'offered',
            },
          },
        },
        pollInterval: 500,
      })
    }
  }, [publicKey, loadingOffers, getMyOffers])

  useEffect(() => {
    if (publicKey && !loadingMyLoans) {
      getMyLoans({
        variables: {
          args: {
            filter: {
              borrowerWallet: publicKey.toBase58(),
              type: 'taken',
            },
          },
        },
        pollInterval: 500,
      })
    }
  }, [publicKey, loadingMyLoans, getMyLoans])

  const connectWallet = () => {
    dispatch(changeWalletsModalOpen(true))
  }

  const shrinkText = (text) => {
    const firstSlice = text.slice(0, 3)
    const lastSlice = text.slice(-3)
    return `${firstSlice}...${lastSlice}`
  }

  const renderConnectWallet = () => {
    return (
      <button
        disabled={addAddressStatus === 'loading'}
        onClick={publicKey ? disconnect : connectWallet}
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

  const renderTabs = () => {
    return (
      <div className="mt-5 rounded-[30px] bg-[#060606] p-4">
        <button
          onClick={() => setActiveTab('offers')}
          disabled={activeTab === 'offers'}
          type="button"
          className={mergeClasses(
            'inline-flex',
            'items-center',
            'justify-center',
            'rounded-[30px]',
            'border',
            'border-transparent',
            'py-1.5',
            'px-4',
            'text-[1.4rem]',
            'text-white',
            'focus:outline-none',
            activeTab === 'offers' ? 'bg-[#3C434B]' : 'bg-[#060606]'
          )}
        >
          Offers
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          disabled={activeTab === 'loans'}
          type="button"
          className={mergeClasses(
            'inline-flex',
            'items-center',
            'justify-center',
            'rounded-[30px]',
            'border',
            'border-transparent',
            'py-1.5',
            'px-4',
            'text-[1.4rem]',
            'text-white',
            'focus:outline-none',
            activeTab === 'loans' ? 'bg-[#3C434B]' : 'bg-[#060606]'
          )}
        >
          Loans
        </button>
      </div>
    )
  }

  const renderOffers = () => {
    return (
      <div className="mt-8 flex w-full flex-col">
        {myOffers?.getLoans?.data?.map((offer, index) => (
          <div className="relative mb-6 flex items-center px-3" key={index}>
            <div className="flex h-[5rem] w-[5rem] items-center justify-center rounded-full bg-white">
              {offer?.orderBook?.nftList?.collectionImage && (
                <Image
                  className="h-full w-full rounded-full"
                  src={offer?.orderBook?.nftList?.collectionImage}
                  unoptimized
                  style={{ objectFit: 'cover' }}
                  width={0}
                  height={0}
                  alt=""
                />
              )}
            </div>
            <div className="ml-5 flex flex-1 flex-col">
              <div className="text-[1.6rem]">
                {offer?.orderBook?.nftList?.collectionName}
              </div>
              <div className="mt-2 flex text-[1.25rem]">
                <div className="flex flex-1 flex-col items-center border-r border-white/[0.3]">
                  <p>
                    {toShortCurrencyFormat(
                      offer?.principalLamports / LAMPORTS_PER_SOL
                    )}
                  </p>
                  <p>Offer</p>
                </div>
                <div className="flex flex-1 flex-col items-center border-r border-white/[0.3] px-2">
                  <p>
                    {calculateLendInterest(
                      offer?.principalLamports / LAMPORTS_PER_SOL,
                      offer?.orderBook?.duration,
                      offer?.orderBook?.apy,
                      offer?.orderBook?.feePermillicentage
                    )}
                  </p>
                  <p>Interest</p>
                </div>
                <div className="flex flex-1 flex-col items-center">
                  <p>{offer?.orderBook?.apyAfterFee}%</p>
                  <p>APY</p>
                </div>
              </div>
            </div>
            <button
              className="absolute left-0 top-0 h-full w-full rounded-lg border border-red-500 bg-red-600 bg-opacity-80 opacity-0 transition duration-200 ease-in-out hover:opacity-100"
              onClick={() => {
                dispatch(setRevokeLoan(offer))
                dispatch(changeRevokeOfferModalOpen(true))
              }}
            >
              <div className="flex h-full items-center justify-center">
                <span className="text-[1.8rem] font-medium text-white">
                  Revoke Offer
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    )
  }

  const renderLoans = () => {
    const getRemainingDays = (loan) => {
      const startTime = new Date(loan.start * 1000)
      const duration = loan.duration
      const endTime = addSeconds(startTime, duration)

      const remainingSeconds = differenceInSeconds(endTime, new Date())
      const remainingDays = remainingSeconds / 86400

      return Math.floor(remainingDays)
    }

    return (
      <div className="mt-8 flex w-full flex-col">
        {myLoans?.getLoans?.data?.map((loan, index) => (
          <div className="relative mb-6 flex items-center px-3" key={index}>
            <div className="flex flex-col items-center justify-center xl:max-w-[4.5rem]">
              <div className="flex h-[3.5rem] w-[3.5rem] items-center justify-center rounded-full bg-white">
                {loan?.orderBook?.nftList?.collectionImage && (
                  <Image
                    className="h-full w-full rounded-full"
                    src={loan?.orderBook?.nftList?.collectionImage}
                    unoptimized
                    style={{ objectFit: 'cover' }}
                    width={0}
                    height={0}
                    alt=""
                  />
                )}
              </div>
              <div className="mt-2 text-center text-[1.15rem] text-[#62EAD2]">
                {getRemainingDays(loan)} Days Remaining
              </div>
            </div>
            <div className="ml-6 flex flex-1 flex-col">
              <div className="text-[1.6rem]">
                {loan?.orderBook?.nftList?.collectionName}
              </div>
              <div className="mt-2 flex text-[1.25rem]">
                <div className="flex flex-1 flex-col items-center border-r border-white/[0.3] px-3">
                  <p>
                    {(loan?.principalLamports / LAMPORTS_PER_SOL).toFixed(3)}
                  </p>
                  <p>Borrowed</p>
                </div>
                <div className="flex flex-1 flex-col items-center border-r border-white/[0.3] px-3">
                  <p>
                    {calculateBorrowInterest(
                      loan?.principalLamports / LAMPORTS_PER_SOL,
                      loan?.orderBook?.duration,
                      loan?.orderBook?.apy
                    ).toFixed(3)}
                  </p>
                  <p>Interest</p>
                </div>
                <div className="flex flex-1 flex-col items-center px-3">
                  <p>
                    {(loan?.totalOwedLamports / LAMPORTS_PER_SOL).toFixed(3)}
                  </p>
                  <p>Repay</p>
                </div>
              </div>
            </div>
            <button
              className="absolute left-0 top-0 h-full w-full rounded-lg border border-red-500 bg-red-600 bg-opacity-80 opacity-0 transition duration-200 ease-in-out hover:opacity-100"
              onClick={() => {
                dispatch(setRepayLoan(loan))
                dispatch(changeRepayModalOpen(true))
              }}
            >
              <div className="flex h-full items-center justify-center">
                <span className="text-[1.8rem] font-medium text-white">
                  Repay Loan
                </span>
              </div>
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="fixed left-0 top-0 z-[51] h-full w-full md:static md:order-3 md:mb-[1.5rem] md:h-[calc(100vh-3rem)]"
      initial={{ x: '101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {lendRightSideBarOpen && (
        <motion.div
          className="fixed left-0 top-0 z-[51] h-full w-full md:static md:order-3 md:mb-[1.5rem]"
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <div className="main-buttons relative mt-0 flex h-full flex-col items-center overflow-y-scroll bg-[rgb(25,28,32)] p-[1.5rem] px-[1.7rem] md:mb-[1.6rem] md:mt-4 md:rounded-[1.5rem] lg:mt-0">
            <div className="mb-6 flex w-full justify-end md:mb-0">
              <button
                className="left-[-3rem] mt-5 rounded-2xl border-[0.5px] border-[#62EAD2] bg-[#2A2D31] p-5 md:fixed"
                onClick={() => dispatch(changeLendRightSidebarOpen(false))}
              >
                <Image
                  src={'/images/svgs/right-arrow.svg'}
                  width="11"
                  height="11"
                  alt="plus sign"
                />
              </button>
            </div>
            <ul className="dashboard-menu w-full text-[1.4rem]">
              {renderConnectWallet()}
            </ul>
            <div
              className={mergeClasses(
                'flex h-full w-full flex-col items-center',
                !publicKey && 'justify-center'
              )}
            >
              {!publicKey && (
                <>
                  <Image
                    src={'/images/svgs/no-wallet.svg'}
                    width="90"
                    height="90"
                    alt="plus sign"
                  />
                  <span className="mt-4 text-[1.4rem] opacity-30">
                    No Wallet Connected
                  </span>
                </>
              )}
              {publicKey && renderTabs()}
              {publicKey && activeTab === 'offers' && renderOffers()}
              {publicKey && activeTab === 'loans' && renderLoans()}
            </div>
          </div>
        </motion.div>
      )}
      {!lendRightSideBarOpen && (
        <button
          className="fixed left-[-3rem] mt-5 hidden rounded-2xl border-[0.5px] border-[#62EAD2] bg-[#2A2D31] p-5 lg:block"
          onClick={() => dispatch(changeLendRightSidebarOpen(true))}
        >
          <Image
            src={'/images/svgs/left-arrow.svg'}
            width="11"
            height="11"
            alt="plus sign"
          />
        </button>
      )}
    </motion.div>
  )
}

export default RightSideBar
