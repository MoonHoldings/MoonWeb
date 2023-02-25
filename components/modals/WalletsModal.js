import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { changeWalletsModalOpen } from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'

const WalletsModal = () => {
  const { wallets, select } = useWallet()
  const dispatch = useDispatch()

  const walletBtnClick = (walletName) => {
    select(walletName)
    dispatch(changeWalletsModalOpen(false))
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
      <div className="modal relative min-w-[18rem] rounded-[1rem] bg-[#191F2D] p-[2rem] text-white shadow-lg xl:min-h-[28rem] xl:min-w-[30rem]">
        <button
          onClick={closeWalletsModal}
          className="absolute right-[1.5rem] top-[1.5rem]"
        >
          <Image
            src="/images/svgs/cross-btn.svg"
            alt="cross button"
            width={20}
            height={20}
          />
        </button>
        <h1 className="mb-[1rem] text-center text-[2rem]">Wallets</h1>
        <div className="flex flex-col items-center">
          {wallets
            .filter((wallet) => wallet.readyState === 'Installed')
            .map((wallet, index) => (
              <button
                key={index}
                onClick={() => walletBtnClick(wallet.adapter.name)}
                className="flex w-full justify-center rounded-[0.5rem] bg-[#2F3640] py-[0.8rem] px-[2rem] text-[1.5rem] [&:not(:last-child)]:mb-[1rem]"
              >
                <Image
                  src={wallet.adapter.icon}
                  alt={wallet.adapter.name}
                  width={22}
                  height={22}
                />
                <span className="ml-[1rem]">{wallet.adapter.name}</span>
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
