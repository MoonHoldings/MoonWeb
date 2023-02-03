import React from 'react'
import { useDispatch } from 'react-redux'
import { changeRightSideBarOpen } from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'

const RightSideBar = () => {
  const dispatch = useDispatch()
  const leftArrowClick = () => {
    dispatch(changeRightSideBarOpen(false))
  }
  return (
    <motion.div
      className="fixed z-[51] h-full w-full bg-[rgb(25,28,32)] px-[1.7rem]"
      initial={{ x: '101%' }}
      animate={{ x: '0%' }}
      exit={{ x: '-101%' }}
      transition={{ duration: 0.6, type: 'spring' }}
    >
      {/* Header */}
      <div className="mt-[1rem] mb-[2.8rem] h-[4.6rem]">
        <button onClick={leftArrowClick} className="h-full">
          <img
            className="h-[2.5rem] w-[2.5rem]"
            src="/images/svgs/arrow-left.svg"
            alt="arrow left"
          />
        </button>
      </div>

      {/* Profile Intro */}
      <div className="profile-intro flex items-center">
        <div className="mr-[1.2rem] h-[10rem] w-[10rem] rounded-full bg-black"></div>
        <div className="total-value flex h-[8.6rem] flex-col justify-between">
          <div className="text-[3.2rem]">$1,890,792</div>
          <div className="flex h-[3.5rem] w-[12.2rem] items-center justify-center rounded-[2rem] bg-black text-[1.4rem]">
            <img
              className="mr-[0.6rem] h-[2.4rem] w-[2.4rem]"
              src="/images/svgs/growth-rate.svg"
              alt="Growth Graph"
            />
            +89% 1W
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RightSideBar
