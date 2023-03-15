// import AddWalletModal from 'components/modals/AddWalletModal'
// import LeftSideBar from 'components/partials/LeftSideBar'
// import RightSideBar from 'components/partials/RightSideBar'
// import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
// import dynamic from 'next/dynamic'
// import { useWallet } from '@solana/wallet-adapter-react'
import { populateWalletsAndCollections } from 'redux/reducers/walletSlice'
import {
  changeAddWalletModalOpen,
  changeWalletsModalOpen,
} from 'redux/reducers/utilSlice'
import decrypt from 'utils/decrypt'
import Collections from 'components/partials/Collections'
import SidebarsLayout from 'components/nft/SidebarsLayout'

import {
  ADD_WALLET_ADDRESSES,
  CONNECT_WALLET,
  PLEASE_SELECT,
  START_CONNECTING_WALLETS,
  WELCOME_MOON_HOLDINGS,
} from 'app/constants/copy'

// const WalletsModal = dynamic(() => import('components/modals/WalletsModal'), {
//   ssr: false,
// }) // fixes hydration

const Index = () => {
  const dispatch = useDispatch()
  //   const { wallets } = useWallet()
  //   const [innerWidth, setInnerWidth] = useState(0)
  //   const {
  //     leftSideBarOpen,
  //     rightSideBarOpen,
  //     walletsModalOpen,
  //     addWalletModalOpen,
  //   } = useSelector((state) => state.util)
  const { collections, allWallets } = useSelector((state) => state.wallet)

  useEffect(() => {
    //     setInnerWidth(window.innerWidth)
    //     window.addEventListener('resize', windowResize)
    const restoreWallet = () => {
      const walletStateDecrypted = localStorage.getItem('walletState')
      if (walletStateDecrypted && allWallets.length === 0) {
        const walletState = decrypt(walletStateDecrypted)
        dispatch(
          populateWalletsAndCollections({
            allWallets: walletState.allWallets,
            collections: walletState.collections,
          })
        )
      }
    }

    restoreWallet()
  }, [allWallets.length, dispatch])
  //   //   if (publicKey) {
  //   //     dispatch(addAddress(publicKey.toBase58()))
  //   //   }
  //   // }, [publicKey])
  //   const windowResize = () => {
  //     setInnerWidth(window.innerWidth)
  //   }
  const addWalletAddress = () => {
    dispatch(changeAddWalletModalOpen(true))
  }

  const connectWallet = () => {
    dispatch(changeWalletsModalOpen(true))
  }

  return (
    <SidebarsLayout>
      {allWallets.length === 0 ? (
        <div className="welcome-message mt-[10rem] text-[1.6rem] font-semibold text-white md:order-2 md:mt-[15rem]">
          <h1 className="text-[2.2rem] font-bold">{WELCOME_MOON_HOLDINGS}</h1>
          <p className="mb-[2rem]">{START_CONNECTING_WALLETS}</p>
          <p>
            {PLEASE_SELECT}{' '}
            <button
              type="button"
              onClick={connectWallet}
              className="text-[#62EAD2]"
            >
              {CONNECT_WALLET}
            </button>
            , or to connect multiple wallets{' '}
            <button
              type="button"
              className="text-[#62EAD2]"
              onClick={addWalletAddress}
            >
              {ADD_WALLET_ADDRESSES}
            </button>
            .
          </p>
        </div>
      ) : (
        <Collections collections={collections} />
      )}
    </SidebarsLayout>
  )
}

export default Index
