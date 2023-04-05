import { useDispatch, useSelector } from 'react-redux'
import { changeLoanDetailsModalOpen } from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'

const LoanDetailsModal = () => {
  const { loanDetailsModalOpen } = useSelector((state) => state.util)
  const { loanDetails } = useSelector((state) => state.sharkifyLend)
  const dispatch = useDispatch()

  const onClose = () => dispatch(changeLoanDetailsModalOpen(false))

  return (
    loanDetailsModalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex flex items-center justify-center font-inter md:h-auto"
      >
        <Overlay onClose={onClose} />
        <div className="modal relative flex w-4/5 flex-col rounded-[1.25rem] bg-[#191C20] pt-6 text-white shadow-lg lg:h-auto lg:w-auto lg:min-w-[500px]">
          <div className="flex w-full justify-center">
            <span className="text-[1.6rem] font-medium">
              {loanDetails?.collectionName}
            </span>
          </div>
          <div className="mt-6 flex w-full justify-between bg-[#34383D] py-6">
            <div className="flex flex-1 justify-center text-[1.4rem]">
              Active Lenders (12345)
            </div>
            <div className="flex flex-1 justify-center text-[1.4rem]">
              Taken
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="flex justify-around border-b border-b-white border-opacity-25">
              <div className="flex flex-1 justify-center bg-[#101113] py-5 text-[1.6rem]">
                1,500
              </div>
              <div className="flex flex-1 justify-center bg-[#212327] py-5 text-[1.6rem]">
                30 minutes ago
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center bg-[#101113] py-6 text-[1.4rem]">
            More (1,705)
          </div>
          <div className="flex w-full justify-between bg-[#34383D] py-6">
            <div className="flex flex-1 justify-center text-[1.4rem]">
              Active Offers (12345)
            </div>
            <div className="flex flex-1 justify-center text-[1.4rem]">
              Offer Made
            </div>
          </div>
          <div className="flex flex-col ">
            <div className="flex justify-around border-b border-b-white border-opacity-25">
              <div className="flex flex-1 justify-center bg-[#101113] py-5 text-[1.6rem]">
                1,500
              </div>
              <div className="flex flex-1 justify-center bg-[#212327] py-5 text-[1.6rem]">
                30 minutes ago
              </div>
            </div>
          </div>
          <div className="flex w-full justify-center rounded-b-[1.25rem] bg-[#101113] py-6 text-[1.4rem]">
            More (1,705)
          </div>
        </div>
      </motion.div>
    )
  )
}

const Overlay = ({ onClose }) => {
  return (
    <div
      onClick={onClose}
      className="absolute bottom-0 left-0 right-0 top-0 bg-[#00000099]"
    />
  )
}

export default LoanDetailsModal
