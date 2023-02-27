import AddWalletModal from 'components/modals/AddWalletModal'
import LeftSideBar from 'components/partials/LeftSideBar'
import RightSideBar from 'components/partials/RightSideBar'
import { AnimatePresence } from 'framer-motion'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import dynamic from 'next/dynamic'
import { useWallet } from '@solana/wallet-adapter-react'
import { populateWalletsAndCollections } from 'redux/reducers/walletSlice'
import decrypt from 'utils/decrypt'
import Collections from 'components/partials/Collections'

const WalletsModal = dynamic(() => import('components/modals/WalletsModal'), {
  ssr: false,
}) // fixes hydration

const index = () => {
  const dispatch = useDispatch()
  const { wallets } = useWallet()
  const [innerWidth, setInnerWidth] = useState(0)

  const {
    leftSideBarOpen,
    rightSideBarOpen,
    walletsModalOpen,
    addWalletModalOpen,
  } = useSelector((state) => state.util)
  const { collections, allWallets } = useSelector((state) => state.wallet)

  useEffect(() => {
    setInnerWidth(window.innerWidth)
    window.addEventListener('resize', windowResize)

    restoreWallet()
  }, [])
  //   if (publicKey) {
  //     dispatch(addAddress(publicKey.toBase58()))
  //   }
  // }, [publicKey])

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

  const windowResize = () => {
    setInnerWidth(window.innerWidth)
  }
  return (
    <>
      <AnimatePresence>
        {addWalletModalOpen && <AddWalletModal />}
      </AnimatePresence>
      <div className="min-h-screen px-[1.7rem] pt-[4.6rem] xl:mx-auto xl:grid xl:max-w-[144rem] xl:grid-cols-[28.8rem_auto_30.8rem] xl:items-start xl:gap-[3.2rem] xl:pt-[2rem]">
        <AnimatePresence>
          {leftSideBarOpen === true && innerWidth < 960 ? <LeftSideBar /> : ''}
          {rightSideBarOpen === true && innerWidth < 960 ? (
            <RightSideBar />
          ) : (
            ''
          )}
        </AnimatePresence>

        <AnimatePresence>
          {walletsModalOpen && <WalletsModal />}
        </AnimatePresence>

        {innerWidth > 959 ? (
          <>
            <LeftSideBar />
            <RightSideBar />
          </>
        ) : (
          <></>
        )}
        {allWallets.length === 0 ? (
          <div className="welcome-message mt-[10rem] text-[1.6rem] font-semibold md:order-2 md:mt-[15rem]">
            <h1 className="text-[2.2rem] font-bold">Welcome to MoonHoldings</h1>
            <p className="mb-[2rem]">
              Let’s start by connecting wallets to pull in your NFTs.
            </p>
            <p>
              Please select{' '}
              <span className="text-[#62EAD2]">Connect Wallet</span>, or to
              connect multiple wallets{' '}
              <span className="text-[#62EAD2]">Add Wallet Addresses</span>.
            </p>
          </div>
        ) : (
          <Collections collections={collections} />
        )}
      </div>
    </>
  )
}

export default index
