import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeRepayModalOpen } from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import createAnchorProvider from 'utils/createAnchorProvider'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import { createSharkyClient } from '@sharkyfi/client'
import mergeClasses from 'utils/mergeClasses'
import { DELETE_LOAN_BY_PUBKEY } from 'utils/mutations'
import { useMutation } from '@apollo/client'

const RepayModal = () => {
  const dispatch = useDispatch()

  const wallet = useWallet()

  const { repayModalOpen } = useSelector((state) => state.util)
  const { repayLoan } = useSelector((state) => state.sharkifyLend)

  const [isSuccess, setIsSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [failMessage, setFailMessage] = useState(null)
  const [txLink, setTxLink] = useState(null)

  const [deleteLoanByPubKey] = useMutation(DELETE_LOAN_BY_PUBKEY)

  const onClose = () => {
    dispatch(changeRepayModalOpen(false))
    setIsSubmitting(false)
    setFailMessage(null)
    setIsSuccess(false)
    setTxLink(null)
  }

  const waitTransactionConfirmation = async (tx, pubKey) => {
    const provider = createAnchorProvider(wallet)

    const confirmedTransaction = await provider.connection.confirmTransaction(
      { signature: tx },
      'confirmed'
    )

    if (confirmedTransaction.value.err) {
      setFailMessage(`Transaction failed: ${confirmedTransaction.value.err}`)
      return
    }

    // Call delete loan
    try {
      await deleteLoanByPubKey({ variables: { pubKey } })
    } catch (error) {
      console.log(error)
    }
    setIsSuccess(true)
    setTxLink(`https://solana.fm/tx/${tx}?cluster=mainnet-qn1`)
  }

  const repay = async () => {
    try {
      setIsSubmitting(true)
      const provider = createAnchorProvider(wallet)
      const sharkyClient = createSharkyClient(provider)
      const { program } = sharkyClient

      const result = await sharkyClient.fetchLoan({
        program,
        loanPubKey: new PublicKey(repayLoan?.pubKey),
      })

      if (!result) {
        setFailMessage('Loan not found')
        setIsSubmitting(false)
        return
      }

      if (!('taken' in result)) {
        setFailMessage('Loan is not in taken state, so cannot be repaid')
        setIsSubmitting(false)
        return
      }

      const loan = result.taken
      const { orderBook } = await sharkyClient.fetchOrderBook({
        program,
        orderBookPubKey: loan.data.orderBook,
      })

      const { sig } = await loan.repay({
        program,
        orderBook,
      })

      await waitTransactionConfirmation(sig, loan.pubKey.toBase58())
      setIsSubmitting(false)
    } catch (error) {
      console.log(error)
      setIsSubmitting(false)
    }
  }

  const renderRepayButton = () => {
    return (
      <button
        type="button"
        className="flex items-center justify-center rounded rounded-xl border-2 border-white bg-gradient-to-b from-[#61D9EB] to-[#63EDD0] px-[2rem] py-[1.5rem] text-[1.25rem] font-bold text-[#15181B]"
        disabled={isSubmitting}
        onClick={isSuccess ? onClose : repay}
      >
        <span>{isSuccess ? 'Close' : 'Repay'}</span>
        {isSubmitting && (
          <svg
            aria-hidden="true"
            className="ml-2 mr-2 h-7 w-7 animate-spin fill-white"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        )}
      </button>
    )
  }

  const renderCloseButton = () => {
    return (
      <div className="absolute right-10 top-10">
        <button onClick={onClose}>
          <Image
            className="h-[2.2rem] w-[2.2rem]"
            src="/images/svgs/cross-btn.svg"
            alt="cross button"
            width={20}
            height={20}
          />
        </button>
      </div>
    )
  }

  const renderTitle = () => {
    return (
      <motion.div
        key={isSuccess}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        className="flex w-full justify-center"
      >
        {isSuccess ? (
          <h1 className="text-[2.1rem] font-bold">SUCCESS!</h1>
        ) : (
          <h1 className="text-[2.1rem] font-bold">
            {repayLoan?.orderBook?.nftList?.collectionName}
          </h1>
        )}
      </motion.div>
    )
  }

  const renderOrderBookInfo = () => {
    const duration = Math.floor(repayLoan?.orderBook?.duration / 86400)

    return (
      <>
        <div className="mt-8 flex w-full justify-between text-xl">
          <p>APY%</p>
          <p>Duration</p>
          <p>Floor</p>
        </div>
        <div className="mt-4 flex w-full justify-between text-3xl">
          <p className="text-[#11AF22]">{repayLoan?.orderBook?.apyAfterFee}%</p>
          <p>{duration}d</p>
          <p>
            {repayLoan?.orderBook?.nftList?.floorPriceSol
              ? toCurrencyFormat(repayLoan?.orderBook?.nftList?.floorPriceSol)
              : 'No Data'}
          </p>
        </div>
      </>
    )
  }

  const renderRepayAmount = () => {
    return (
      <div className="mt-4 flex justify-between">
        <p className="text-2xl">Amount owed</p>
        <div className="flex">
          <Image src="/images/svgs/sol.svg" width={16} height={16} alt="" />
          <p className="ml-2 text-2xl">
            {(repayLoan?.totalOwedLamports / LAMPORTS_PER_SOL).toFixed(3)}
          </p>
        </div>
      </div>
    )
  }

  return (
    repayModalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex flex h-full items-center justify-center font-inter md:h-auto"
      >
        <Overlay onClose={onClose} />
        <div className="relative flex flex-col justify-center md:block">
          {repayLoan?.orderBook?.nftList?.collectionImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
              className="absolute left-1/2 z-[99] mr-3 hidden h-[8rem] w-[8rem] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white md:flex"
            >
              <Image
                className={mergeClasses(
                  'h-full',
                  'w-full',
                  'rounded-full',
                  'border'
                )}
                src={repayLoan?.orderBook?.nftList?.collectionImage}
                width={0}
                height={0}
                alt=""
                unoptimized
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          )}
          <div
            className={`modal duration-400 relative flex w-[360px] flex-col rounded-[1.25rem] transition-colors ease-in-out md:w-[420px] ${
              isSuccess ? 'bg-[#022628]' : 'bg-[#191C20]'
            } px-[2rem] pb-[2.5rem] pt-[5.8rem] text-white shadow-lg`}
          >
            {renderCloseButton()}
            {renderTitle()}
            {renderOrderBookInfo()}
            <div className="my-8 border border-white opacity-10" />
            {renderRepayAmount()}
            <div className="mt-6 flex w-full justify-center">
              {renderRepayButton()}
            </div>
            {txLink && (
              <div className="flex w-full justify-center">
                <Link
                  href={txLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-[1.4rem] underline"
                >
                  View your last transaction on Solana FM
                </Link>
              </div>
            )}
            {failMessage && (
              <div className="mt-4 flex w-full justify-center text-[1.6rem] text-red-500">
                {failMessage}
              </div>
            )}
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

export default RepayModal
