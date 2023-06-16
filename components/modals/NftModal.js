import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { PublicKey } from '@solana/web3.js'
import { changeNftModalOpen } from 'redux/reducers/utilSlice'

import {
  burnNfts,
  fetchUserNfts,
  selectNft,
  transferNfts,
} from 'redux/reducers/nftSlice'
import { getUserWallets } from 'redux/reducers/walletSlice'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'

import { notification } from 'antd'

const NftModal = () => {
  const dispatch = useDispatch()
  const [walletAddress, setWalletAddress] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { publicKey, wallet } = useWallet()
  const { connection } = useConnection()

  const {
    selectedNfts,
    loadingTransfer,
    loadingBurning,
    confirmingTransaction,
    ownedNfts,
  } = useSelector((state) => state.nft)
  const { nftModalType } = useSelector((state) => state.util)
  const [api, contextHolder] = notification.useNotification()

  const closeModal = () => {
    dispatch(changeNftModalOpen({ isShow: false, type: '' }))
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

  const handleTransferNfts = async () => {
    if (nftModalType === 'BURN') {
      dispatch(
        burnNfts({
          fromAddress: publicKey.toBase58(),
          connection: connection,
          wallet: wallet,
          notification: api,
        })
      )
    } else {
      if (!isValidSolanaAddress(walletAddress)) {
        setErrorMessage('Invalid wallet address')
        return
      }
      dispatch(
        transferNfts({
          toAddress: walletAddress,
          fromAddress: publicKey.toBase58(),
          connection: connection,
          wallet: wallet,
          notification: api,
        })
      )
    }
    dispatch(getUserWallets())
    dispatch(fetchUserNfts())
  }

  const handleWalletAddressInput = (event) => {
    if (event.key === 'Enter') {
      if (!isValidSolanaAddress(walletAddress)) {
        setErrorMessage('Invalid wallet address')
        return
      }

      dispatch(
        transferNfts({
          toAddress: walletAddress,
          fromAddress: publicKey.toBase58(),
          connection: connection,
          wallet: wallet,
        })
      )
    }
  }

  useEffect(() => {
    if (containerRef.current != null)
      containerRef.current.scrollTo(0, containerRef.current.scrollHeight)
  }, [selectedNfts])
  const containerRef = useRef(null)

  useEffect(() => {
    if (selectedNfts?.length == 0) {
      closeModal()
    }
  }, [selectedNfts])

  const selectNFT = (nft) => {
    if (ownedNfts?.findIndex((item) => item === nft.mint) > -1)
      dispatch(selectNft({ mint: nft.mint, name: nft.name }))
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
      {contextHolder}
      <div className="main-modal w-[60.5rem] rounded-[2rem] bg-[#191C20] p-[2rem] text-white drop-shadow-lg">
        <div className="top-line mb-[1rem] flex justify-between py-[1rem]">
          <h1 className="text-[1.8rem] font-[700]">Mass Transfer</h1>
          <button onClick={closeModal}>
            <Image
              className="h-[2.2rem] w-[2.2rem]"
              src="/images/svgs/x-btn.svg"
              alt="cross button"
              width={20}
              height={20}
            />
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto">
          <ul
            className="all-wallets mb-[2rem] w-full overflow-hidden rounded-l-lg rounded-r-lg border border-black "
            ref={containerRef}
          >
            {selectedNfts?.map((nft, index) => (
              <li key={index}>
                <button
                  type="button"
                  className={`xl-[1rem] flex h-[5rem] w-full items-center justify-between border border-black bg-transparent px-[1.6rem] text-white 
             `}
                >
                  <div className="flex h-[4.1rem] w-full items-center text-[1.4rem] text-[#FFFFFF]">
                    {nft.name}
                  </div>
                  <div
                    onClick={() => selectNFT(nft)}
                    className="flex h-[3.2rem] w-[3.2rem] items-center justify-center rounded-[0.8rem] bg-[#191C20]"
                  >
                    <Image
                      src="/images/svgs/delete.svg"
                      alt="cross button"
                      width={20}
                      height={20}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-8 flex flex-row">
          {nftModalType == 'BURN' ? (
            <h1 className="search mb-[1rem] mr-4 flex w-[60%] items-center  text-center text-[2rem]">
              Mass Burn Confirmation
            </h1>
          ) : (
            <div className="search mb-[1rem] mr-4 flex h-[3.766rem] w-[70%] items-center justify-center  rounded-[0.8rem] border-[1px] border-[#61DAE9] bg-[#25282C] px-[1.6rem] text-[1.4rem] xl:h-[5rem]">
              <input
                className="flex w-full bg-transparent text-[1.4rem] placeholder:text-[#61DAE9] focus:outline-none"
                type="text"
                placeholder="Wallet Address"
                onChange={(e) => {
                  setErrorMessage('')
                  setWalletAddress(e.target.value)
                }}
                onKeyUp={handleWalletAddressInput}
              />
            </div>
          )}

          <button
            id="btn-add-wallet"
            onClick={handleTransferNfts}
            disabled={loadingTransfer}
            className={`spinner ml-4 h-[4.6rem] w-[40%] rounded-[0.5rem] border border-black text-center text-[1.4rem] font-[500] xl:h-[5rem] ${
              nftModalType == 'BURN'
                ? 'bg-[#EF4123] text-white'
                : 'bg-[#61DAE9] text-black'
            }`}
          >
            {loadingTransfer || loadingBurning || confirmingTransaction ? (
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
            ) : nftModalType == 'TRANSFER' ? (
              <>{'Transfer'}</>
            ) : (
              <>{'Burn Selected NFTs'}</>
            )}
          </button>
        </div>
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

export default NftModal
