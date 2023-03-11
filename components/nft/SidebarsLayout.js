import AddWalletModal from 'components/modals/AddWalletModal'
import WalletsModal from 'components/modals/WalletsModal'
import LeftSideBar from 'components/partials/LeftSideBar'
import RightSideBar from 'components/partials/RightSideBar'
import { AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const SidebarsLayout = ({ children }) => {
  const router = useRouter()
  const [innerWidth, setInnerWidth] = useState(0)

  const {
    leftSideBarOpen,
    rightSideBarOpen,
    walletsModalOpen,
    addWalletModalOpen,
  } = useSelector((state) => state.util)

  useEffect(() => {
    setInnerWidth(window.innerWidth)
    window.addEventListener('resize', windowResize)
  }, [])

  const windowResize = () => {
    setInnerWidth(window.innerWidth)
  }
  return (
    <>
      <AnimatePresence>
        {addWalletModalOpen && <AddWalletModal />}
      </AnimatePresence>

      {/* removed xl:max-w-[144rem] */}
      <div className="min-h-screen px-[1.7rem] pt-[4.6rem] xl:mx-auto xl:grid  xl:grid-cols-[28.8rem_auto_30.8rem] xl:items-start xl:gap-[3.2rem] xl:pt-[2rem]">
        <AnimatePresence>
          {leftSideBarOpen === true && innerWidth < 1280 ? <LeftSideBar /> : ''}
          {rightSideBarOpen === true &&
          innerWidth &&
          (router.pathname !== `/collection/nft/`) < 1280 ? (
            <RightSideBar />
          ) : (
            ''
          )}
        </AnimatePresence>

        <AnimatePresence>
          {walletsModalOpen && <WalletsModal />}
        </AnimatePresence>

        {innerWidth > 1280 ? (
          <>
            <LeftSideBar />
            {router.pathname !== `/collection/nft/` ? <RightSideBar /> : ''}
          </>
        ) : (
          <></>
        )}
        {children}
      </div>
    </>
  )
}

export default SidebarsLayout
