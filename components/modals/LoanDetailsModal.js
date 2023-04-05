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
        className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex flex h-full items-center justify-center font-inter md:h-auto"
      >
        <Overlay onClose={onClose} />
        <div className="modal relative flex h-full w-full flex-col rounded-[1.25rem] bg-[#191C20] text-white shadow-lg lg:h-auto lg:w-auto lg:min-w-[500px]">
          <div className="flex w-full justify-between p-4">
            <span className="flex flex-1 justify-center text-[1.4rem]">
              Active Lenders{' '}
            </span>
            <span className="flex flex-1 justify-center text-[1.4rem]">
              Taken
            </span>
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
