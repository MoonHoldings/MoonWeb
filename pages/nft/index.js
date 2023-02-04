import LeftSideBar from 'components/partials/LeftSideBar'
import RightSideBar from 'components/partials/RightSideBar'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { useSelector } from 'react-redux'

const index = () => {
  const { leftSideBarOpen, rightSideBarOpen } = useSelector(
    (state) => state.util
  )
  return (
    <div className="min-h-screen bg-black">
      <AnimatePresence>
        {leftSideBarOpen === true ? <LeftSideBar /> : ''}
        {rightSideBarOpen === true ? <RightSideBar /> : ''}
      </AnimatePresence>
    </div>
  )
}

export default index
