import React from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'

import {
  changeWalletsModalOpen,
  changeLendRightSidebarOpen,
} from 'redux/reducers/utilSlice'

const RightSideBar = () => {
  const dispatch = useDispatch()

  const { disconnect, publicKey } = useWallet()
  const { addAddressStatus } = useSelector((state) => state.wallet)
  const { lendRightSideBarOpen } = useSelector((state) => state.util)

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

  return (
    <motion.div
      className="fixed left-0 top-0 z-[51] h-full w-full md:static md:order-3 md:mb-[1.5rem] md:h-auto"
      initial={{ x: '101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {lendRightSideBarOpen && (
        <motion.div
          className="fixed left-0 top-0 z-[51] h-full w-full md:static md:order-3 md:mb-[1.5rem] md:h-auto"
          initial={{ x: '100%' }}
          animate={{ x: '0%' }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.6, type: 'spring' }}
        >
          <div className="main-buttons relative mt-0 h-full bg-[rgb(25,28,32)] px-[1.7rem] md:mb-[1.6rem] md:mt-4 md:rounded-[1.5rem] md:p-[1.5rem] lg:mt-0">
            <button
              className="fixed left-[-3rem] mt-5 rounded-2xl border-[0.5px] border-[#62EAD2] bg-[#2A2D31] p-5"
              onClick={() => dispatch(changeLendRightSidebarOpen(false))}
            >
              <Image
                src={'/images/svgs/right-arrow.svg'}
                width="11"
                height="11"
                alt="plus sign"
              />
            </button>
            <ul className="dashboard-menu text-[1.4rem]">
              {renderConnectWallet()}
            </ul>
          </div>
        </motion.div>
      )}
      {!lendRightSideBarOpen && (
        <button
          className="fixed left-[-3rem] mt-5 rounded-2xl border-[0.5px] border-[#62EAD2] bg-[#2A2D31] p-5"
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
