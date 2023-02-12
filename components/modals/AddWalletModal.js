import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeAddWalletModalOpen } from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'

const AddWalletModal = () => {
  const dispatch = useDispatch()
  const [walletAddress, setWalletAddress] = useState('')
  const { addWalletModalOpen } = useSelector((state) => state.util)

  const closeModal = () => {
    dispatch(changeAddWalletModalOpen(false))
  }

  const addWallet = () => {
    console.log(walletAddress)
  }
  return (
    <>
      {addWalletModalOpen && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-[52] flex items-center justify-center bg-[#00000099] font-inter">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
            className="main-modal w-[60.5rem] rounded-[2rem] bg-[#191C20] p-[2rem] drop-shadow-lg"
          >
            <div className="top-line mb-[1rem] flex justify-between py-[1rem]">
              <h1 className="text-[1.8rem] font-[700]">
                Add your Solana wallet
              </h1>
              <button onClick={closeModal}>
                <img
                  className="h-[2.2rem] w-[2.2rem]"
                  src="/images/svgs/cross-btn.svg"
                  alt="cross button"
                />
              </button>
            </div>

            {/* Search bar */}
            <div className="search mb-[1rem] grid h-[3.766rem] grid-cols-[1.6rem_auto] items-center gap-[0.8rem] rounded-[0.8rem] border-[1px] border-[#61DAE9] bg-[#25282C] px-[1.6rem] text-[1.4rem] xl:h-[6.4rem]">
              <img
                className="h-[1.6rem] w-[1.6rem]"
                src="/images/svgs/magnifyingglass.svg"
                alt=""
              />
              <input
                className="border-none bg-transparent outline-none placeholder:text-[#61DAE9]"
                type="text"
                placeholder="Search Coins"
                onChange={(e) => setWalletAddress(e.target.value)}
              />
            </div>

            <button
              onClick={addWallet}
              className="h-[4.6rem] w-[100%] rounded-[0.5rem] border border-black bg-[#5B218F] text-center text-[1.4rem] font-[500]"
            >
              Add Wallet
            </button>
          </motion.div>
        </div>
      )}
    </>
  )
}

export default AddWalletModal
