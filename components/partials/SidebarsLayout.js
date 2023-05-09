import AddWalletModal from 'components/modals/AddWalletModal'
import LoadingModal from 'components/modals/LoadingModal'
import RefreshWalletModal from 'components/modals/RefreshWalletModal'
import RefreshFloorPriceModal from 'components/modals/RefreshFloorPriceModal'
import WalletsModal from 'components/modals/WalletsModal'
import LeftSideBar from 'components/partials/LeftSideBar'
import NftRightSideBar from 'components/nft/RightSideBar'
import DefiLoansRightSideBar from 'components/defi-loans/RightSideBar'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import mergeClasses from 'utils/mergeClasses'
import LendModal from 'components/modals/LendModal'
import BorrowModal from 'components/modals/BorrowModal'
import RevokeOfferModal from 'components/modals/RevokeOfferModal'
import LoanDetailsModal from 'components/modals/LoanDetailsModal'
import RepayModal from 'components/modals/RepayModal'
import CoinModal from 'components/modals/CoinModal'

const SidebarsLayout = ({ children }) => {
  const router = useRouter()
  const [innerWidth, setInnerWidth] = useState(0)

  const {
    leftSideBarOpen,
    rightSideBarOpen,
    walletsModalOpen,
    addWalletModalOpen,
    lendRightSideBarOpen,
  } = useSelector((state) => state.util)

  const {
    addAddressStatus,
    fetchingNftDataStatus,
    refreshFloorPriceStatus,
    refreshWalletsStatus,
  } = useSelector((state) => state.wallet)

  const { modalLoading } = useSelector((state) => state.auth)

  useEffect(() => {
    setInnerWidth(window.innerWidth)
    window.addEventListener('resize', windowResize)
  }, [])

  const windowResize = () => {
    setInnerWidth(window.innerWidth)
  }

  const renderModals = () => {
    return (
      <>
        <LendModal />
        <BorrowModal />
        <RevokeOfferModal />
        <LoanDetailsModal />
        <RepayModal />
        <AnimatePresence>
          <CoinModal />
          {walletsModalOpen && <WalletsModal />}
        </AnimatePresence>
        {(addAddressStatus === 'loading' ||
          fetchingNftDataStatus === 'loading') && <LoadingModal />}
        {refreshWalletsStatus === 'loading' && <RefreshWalletModal />}
        {refreshFloorPriceStatus === 'loading' && <RefreshFloorPriceModal />}
      </>
    )
  }

  const noSidebarPaths = [
    '/login',
    '/signup',
    '/',
    '/reset-password',
    '/redirect',
  ]
  const shouldRenderSidebars = !noSidebarPaths.includes(router.pathname)

  if (shouldRenderSidebars) {
    return (
      <>
        <AnimatePresence>
          {addWalletModalOpen && <AddWalletModal />}
        </AnimatePresence>
        <div
          className={mergeClasses(
            'min-h-screen',
            'px-[1.7rem]',
            'pt-[4.6rem]',
            'xl:mx-auto',
            'xl:grid',
            lendRightSideBarOpen || !router.pathname.includes('defi-loans')
              ? 'xl:grid-cols-[28.8rem_auto_30.8rem]'
              : 'xl:grid-cols-[28.8rem_auto_1rem]',
            'xl:items-start',
            'xl:gap-[3.2rem]',
            'xl:pt-[2rem]'
          )}
        >
          <AnimatePresence initial={false}>
            {leftSideBarOpen && innerWidth < 1280 && <LeftSideBar />}
            {rightSideBarOpen &&
              innerWidth < 1280 &&
              (router.pathname.includes('nfts') ||
                router.pathname.includes('crypto')) && <NftRightSideBar />}
            {lendRightSideBarOpen &&
              innerWidth < 1280 &&
              router.pathname.includes('defi-loans') && (
                <DefiLoansRightSideBar />
              )}
          </AnimatePresence>

          <AnimatePresence>
            {walletsModalOpen && <WalletsModal />}
          </AnimatePresence>

          {(addAddressStatus === 'loading' ||
            fetchingNftDataStatus === 'loading' ||
            modalLoading) && <LoadingModal showMessage={modalLoading} />}
          {refreshWalletsStatus === 'loading' && <RefreshWalletModal />}
          {refreshFloorPriceStatus === 'loading' && <RefreshFloorPriceModal />}

          {innerWidth > 1280 && (
            <>
              <LeftSideBar />
              {(router.pathname.includes('nfts') ||
                router.pathname.includes('crypto')) && <NftRightSideBar />}
              {router.pathname.includes('defi-loans') && (
                <DefiLoansRightSideBar />
              )}
            </>
          )}

          {renderModals()}
          {children}
        </div>
      </>
    )
  } else {
    return children
  }
}

export default SidebarsLayout
