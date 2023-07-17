import AddWalletModal from 'components/modals/AddWalletModal'
import LoadingModal from 'components/modals/LoadingModal'
import RefreshWalletModal from 'components/modals/RefreshWalletModal'
import RefreshFloorPriceModal from 'components/modals/RefreshFloorPriceModal'
import WalletsModal from 'components/modals/WalletsModal'
import LeftSideBar from 'components/partials/LeftSideBar'
import NftRightSideBar from 'components/partials/RightSideBar'
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
import ExtendModal from 'components/modals/ExtendModal'
import CoinModal from 'components/modals/CoinModal'
import NftModal from 'components/modals/NftModal'
import ExchangeModal from 'components/modals/ExchangeModal'
import { detectCedeProvider } from '@cedelabs/providers'
import { displayNotifModal } from 'utils/notificationModal'

const SidebarsLayout = ({ children }) => {
  const router = useRouter()
  const [innerWidth, setInnerWidth] = useState(0)

  const {
    leftSideBarOpen,
    rightSideBarOpen,
    walletsModalOpen,
    addWalletModalOpen,
    nftModalOpen,
    lendRightSideBarOpen,
    exchangeModalOpen,
  } = useSelector((state) => state.util)
  const { isLoggedIn } = useSelector((state) => state.auth)
  const { loading: portfolioLoading } = useSelector((state) => state.portfolio)
  const { addAddressStatus, refreshFloorPriceStatus, refreshWalletsStatus } =
    useSelector((state) => state.wallet)

  const { modalLoading } = useSelector((state) => state.auth)

  const [cedeProvider, setCedeProvider] = useState(null)

  useEffect(() => {
    async function initializeCede() {
      try {
        const provider = await detectCedeProvider()

        if (provider == null) {
          displayNotifModal(
            'Warning',
            'You might need to install cede.store extension.'
          )
        } else {
          provider.on('connect', () => setCedeProvider(provider))
          provider.on('accountsChanged', () => setCedeProvider(provider))
          provider.on('unlock', () => setCedeProvider(provider))
          provider.on('lock', () => setCedeProvider(provider))
        }
        setCedeProvider(provider)
      } catch (error) {
        console.error(error)
      }
    }

    initializeCede()
  }, [])

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
        <ExtendModal />
        <AnimatePresence>
          <CoinModal />
          {walletsModalOpen && <WalletsModal />}
        </AnimatePresence>
        {addAddressStatus === 'loading' && <LoadingModal />}
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
  const shouldRenderNftRightSidebar =
    router.pathname.includes('nfts') ||
    router.pathname.includes('dashboard') ||
    router.pathname.includes('crypto')
  if (shouldRenderSidebars && isLoggedIn) {
    return (
      <>
        <AnimatePresence>
          {addWalletModalOpen && <AddWalletModal />}
          {nftModalOpen && <NftModal />}
          {exchangeModalOpen && <ExchangeModal cedeProvider={cedeProvider} />}
        </AnimatePresence>
        <div
          className={mergeClasses(
            'min-h-screen',
            'px-[1.7rem]',
            'pt-[4.6rem]',
            'xl:mx-auto',
            'xl:grid',
            lendRightSideBarOpen || !router.pathname.includes('defi-loans')
              ? 'xl:grid-cols-[24rem_auto_30.8rem]'
              : 'xl:grid-cols-[24rem_auto_1rem]',
            'xl:items-start',
            'xl:gap-[3.2rem]',
            'xl:pt-[2rem]'
          )}
        >
          <AnimatePresence initial={false}>
            {leftSideBarOpen && innerWidth < 1280 && <LeftSideBar />}
            {rightSideBarOpen &&
              innerWidth < 1280 &&
              shouldRenderNftRightSidebar && <NftRightSideBar />}
            {lendRightSideBarOpen &&
              innerWidth < 1280 &&
              router.pathname.includes('defi-loans') && (
                <DefiLoansRightSideBar />
              )}
          </AnimatePresence>

          <AnimatePresence>
            {walletsModalOpen && <WalletsModal />}
          </AnimatePresence>

          {(addAddressStatus === 'loading' || modalLoading) && (
            <LoadingModal showMessage={modalLoading} />
          )}
          {refreshWalletsStatus === 'loading' && <RefreshWalletModal />}
          {refreshFloorPriceStatus === 'loading' && <RefreshFloorPriceModal />}

          {innerWidth > 1280 && (
            <>
              <LeftSideBar />
              {shouldRenderNftRightSidebar && <NftRightSideBar />}
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
