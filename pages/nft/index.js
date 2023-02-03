import LeftSideBar from 'components/partials/LeftSideBar'
import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { useSelector } from 'react-redux'

const index = () => {
  const { leftSideBarOpen } = useSelector((state) => state.util)
  return (
    <div>
      <AnimatePresence>
        {leftSideBarOpen === true ? <LeftSideBar /> : ''}
      </AnimatePresence>
    </div>
  )
}

export default index
