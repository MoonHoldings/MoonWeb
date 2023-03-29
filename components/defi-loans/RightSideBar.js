import React from 'react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'

import { changeWalletsModalOpen } from 'redux/reducers/utilSlice'

const RightSideBar = () => {
  const dispatch = useDispatch()

  const { disconnect, publicKey } = useWallet()
  const { addAddressStatus } = useSelector((state) => state.wallet)

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
        className="xl-[1rem] mb-[1rem] flex h-[6.4rem] w-full cursor-pointer items-center justify-between rounded-[1rem] border border-black bg-[#25282C] px-[1.6rem] text-white hover:border-teal-400 hover:text-teal-400"
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
      className="fixed top-0 left-0 z-[51] h-full w-full md:static md:order-3 md:mb-[1.5rem] md:h-auto"
      initial={{ x: '101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      <div className="main-buttons mt-0 h-full bg-[rgb(25,28,32)] px-[1.7rem] md:mt-4 md:mb-[1.6rem] md:rounded-[1.5rem] md:p-[1.5rem] lg:mt-0">
        <ul className="dashboard-menu text-[1.4rem]">
          {renderConnectWallet()}
        </ul>
      </div>
    </motion.div>
  )
}

export default RightSideBar
