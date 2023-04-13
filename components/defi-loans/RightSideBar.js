import React, { useEffect } from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { useLazyQuery } from '@apollo/client'
import {
  changeWalletsModalOpen,
  changeLendRightSidebarOpen,
  changeRevokeOfferModalOpen,
} from 'redux/reducers/utilSlice'
import mergeClasses from 'utils/mergeClasses'
import { MY_OFFERS } from 'utils/queries'
import toShortCurrencyFormat from 'utils/toShortCurrencyFormat'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { setRevokeLoan } from 'redux/reducers/sharkifyLendSlice'
import RevokeOfferModal from 'components/modals/RevokeOfferModal'

const RightSideBar = () => {
  const dispatch = useDispatch()

  const { disconnect, publicKey } = useWallet()
  const { addAddressStatus } = useSelector((state) => state.wallet)
  const { lendRightSideBarOpen, revokeOfferModalOpen } = useSelector(
    (state) => state.util
  )

  const [getMyOffers, { loading, error, data }] = useLazyQuery(MY_OFFERS)

  useEffect(() => {
    if (publicKey) {
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
  }, [publicKey, getMyOffers])

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
            'bg-[#3C434B]'
          )}
        >
          Offers
        </button>
        <button
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
            'bg-[#060606]'
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
        {data?.getLoans?.data?.map((offer, index) => (
          <div className="relative mb-6 flex items-center px-3" key={index}>
            <div className="flex h-[5rem] w-[5rem] items-center justify-center rounded-full bg-white">
              <Image
                className="h-full w-full rounded-full"
                src={offer?.orderBook?.nftList?.collectionImage}
                unoptimized
                style={{ objectFit: 'cover' }}
                width={0}
                height={0}
                alt=""
              />
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
                  <p>0.80</p>
                  <p>Interest</p>
                </div>
                <div className="flex flex-1 flex-col items-center">
                  <p>{offer?.orderBook?.apyAfterFee}%</p>
                  <p>APY</p>
                </div>
              </div>
            </div>
            <button
              class="absolute left-0 top-0 h-full w-full rounded-lg border border-red-500 bg-red-600 bg-opacity-50 opacity-0 transition duration-200 ease-in-out hover:opacity-100"
              onClick={() => {
                dispatch(setRevokeLoan(offer))
                dispatch(changeRevokeOfferModalOpen(true))
              }}
            >
              <div class="flex h-full items-center justify-center">
                <span class="text-[1.8rem] font-medium text-white">
                  Revoke Offer
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
              {publicKey && renderOffers()}
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
