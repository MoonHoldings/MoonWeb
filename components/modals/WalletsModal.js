import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

import {
  changeWalletsModalOpen,
  changeRightSideBarOpen,
} from 'redux/reducers/utilSlice'

const WalletsModal = () => {
  const { wallets, select } = useWallet()
  const dispatch = useDispatch()

  const walletBtnClick = (walletName) => {
    select(walletName)
    dispatch(changeWalletsModalOpen(false))
    dispatch(changeRightSideBarOpen(false))
  }

  const closeWalletsModal = () => {
    dispatch(changeWalletsModalOpen(false))
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.3 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed top-0 left-0 right-0 bottom-0 z-[52] flex items-center justify-center font-inter"
    >
      <Overlay closeWalletsModal={closeWalletsModal} />
      <div className="modal relative min-w-[28rem] rounded-[1.25rem] bg-[#191C20] p-[2rem] text-white shadow-lg xl:min-h-[28rem] xl:min-w-[40rem]">
        <div className="mb-[1.5rem] flex items-center justify-between">
          <h1 className="text-center text-[1.5rem] font-bold">
            Connect Wallet
          </h1>
          <button onClick={closeWalletsModal} className="h-7 w-7">
            <Image
              src="/images/svgs/cross-btn.svg"
              alt="cross button"
              width={20}
              height={20}
              className="h-full w-full object-cover object-center"
            />
          </button>
        </div>
        <p className="mb-[1.5rem] text-[1.2rem]">
          Connect with one of our available wallet providers
        </p>
        <div className="flex flex-col items-center">
          {wallets.map((wallet, index) => (
            <button
              key={index}
              onClick={() => walletBtnClick(wallet.adapter.name)}
              className={`flex w-full items-center justify-between border border-black bg-[#191C20] py-[1rem] px-[2rem] text-[1.5rem] ${
                index === 0 && 'rounded-tl-[0.5rem] rounded-tr-[0.5rem]'
              } ${
                index === wallets.length - 1 &&
                'rounded-bl-[0.5rem] rounded-br-[0.5rem]'
              } ${index !== 0 && 'border-t-[0]'}`}
              disabled={wallet.readyState === 'NotDetected'}
            >
              <div className="flex items-center">
                <div>
                  <Image
                    src={wallet.adapter.icon}
                    alt={wallet.adapter.name}
                    width={16}
                    height={16}
                  />
                </div>
                <span className="ml-[1.7rem] text-[1.5rem]">
                  {wallet.adapter.name}
                </span>
              </div>
              {wallet.readyState !== 'NotDetected' && (
                <div className="rounded-[5px] bg-[#343942] p-[5px] text-[1.2rem]">
                  Detected
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

const Overlay = ({ closeWalletsModal }) => {
  return (
    <div
      onClick={closeWalletsModal}
      className="absolute top-0 left-0 right-0 bottom-0 bg-[#00000099]"
    />
  )
}

export default WalletsModal
