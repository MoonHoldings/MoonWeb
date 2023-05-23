import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PublicKey } from '@solana/web3.js'
import {
  changeAddWalletModalOpen,
  reloadDashboard,
} from 'redux/reducers/utilSlice'

import { ADD_WALLET } from 'application/constants/copy'
import { ADD_USER_WALLET } from 'utils/mutations'
import { useMutation } from '@apollo/client'
import { fetchUserNfts } from 'redux/reducers/walletSlice'
import { reloadPortfolio } from 'redux/reducers/portfolioSlice'

const AddWalletModal = () => {
  const dispatch = useDispatch()
  const [walletAddress, setWalletAddress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [addUserWallet, { loading: addingUserWallet }] =
    useMutation(ADD_USER_WALLET)

  const closeModal = () => {
    dispatch(changeAddWalletModalOpen(false))
  }

  const isValidSolanaAddress = (address) => {
    try {
      let pubkey = new PublicKey(address)
      let isSolana = PublicKey.isOnCurve(pubkey.toBuffer())

      return isSolana
    } catch (error) {
      return false
    }
  }

  const addWallet = async () => {
    if (!isValidSolanaAddress(walletAddress)) {
      setErrorMessage('Invalid wallet address')
      return
    }

    const res = await addUserWallet({
      variables: { verified: false, wallet: walletAddress },
    })

    if (!res?.data?.addUserWallet) {
      setErrorMessage('Invalid wallet address')
      return
    }

    dispatch(fetchUserNfts())
    dispatch(reloadPortfolio(true))
    dispatch(reloadDashboard(true))
    dispatch(changeAddWalletModalOpen(false))
  }

  const handleWalletAddressInput = (event) => {
    if (event.key === 'Enter') {
      addWallet()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.5, type: 'spring' }}
      className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex items-center justify-center p-[1rem] font-inter"
    >
      <Overlay closeModal={closeModal} />
      <div className="main-modal w-[60.5rem] rounded-[2rem] bg-[#191C20] p-[2rem] text-white drop-shadow-lg">
        <div className="top-line mb-[1rem] flex justify-between py-[1rem]">
          <h1 className="text-[1.8rem] font-[700]">Add your Solana wallet</h1>
          <button onClick={closeModal}>
            <Image
              className="h-[2.2rem] w-[2.2rem]"
              src="/images/svgs/cross-btn.svg"
              alt="cross button"
              width={20}
              height={20}
            />
          </button>
        </div>

        <div className="search mb-[1rem] grid h-[3.766rem] grid-cols-[1.6rem_auto] items-center gap-[0.8rem] rounded-[0.8rem] border-[1px] border-[#61DAE9] bg-[#25282C] px-[1.6rem] text-[1.4rem] xl:h-[6.4rem]">
          <Image
            className="h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/magnifyingglass.svg"
            width={16}
            height={16}
            alt=""
          />
          <input
            className="bg-transparent text-[1.4rem] placeholder:text-[#61DAE9] focus:outline-none"
            type="text"
            placeholder="Wallet Address"
            onChange={(e) => setWalletAddress(e.target.value)}
            onKeyUp={handleWalletAddressInput}
          />
        </div>

        <button
          id="btn-add-wallet"
          onClick={addWallet}
          disabled={addingUserWallet}
          className="spinner h-[4.6rem] w-[100%] rounded-[0.5rem] border border-black bg-[#5B218F] text-center text-[1.4rem] font-[500]"
        >
          {addingUserWallet ? (
            <>
              <div
                className="mr-[1rem] inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status"
              >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                  Loading...
                </span>
              </div>
              Processing...
            </>
          ) : (
            <>{ADD_WALLET}</>
          )}
        </button>
        {errorMessage.length > 0 && (
          <p className="mt-2 text-[1.5rem] text-red-500">{errorMessage}</p>
        )}
      </div>
    </motion.div>
  )
}

const Overlay = ({ closeModal }) => {
  return (
    <div
      onClick={closeModal}
      className="absolute h-full w-full bg-[#00000099]"
    />
  )
}

export default AddWalletModal
