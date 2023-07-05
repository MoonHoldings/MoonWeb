import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { changeExtendModalOpen } from 'redux/reducers/utilSlice'
import Image from 'next/image'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import mergeClasses from 'utils/mergeClasses'
import createAnchorProvider from 'utils/createAnchorProvider'
import { notification } from 'antd'
import { useLazyQuery, useMutation } from '@apollo/client'
import { GET_BEST_OFFER_FOR_EXTEND } from 'utils/queries'
import Link from 'next/link'
import calculateBorrowInterest from 'utils/calculateBorrowInterest'
import { BORROW_LOAN, DELETE_LOAN_BY_PUBKEY } from 'utils/mutations'
import axios from 'axios'
import { AXIOS_CONFIG_SHYFT_KEY, SHYFT_URL } from 'application/constants/api'
import Spinner from 'components/Spinner'
import breakdownLoanDuration from 'utils/breakdownLoanDuration'
import { createSharkyClient } from '@sharkyfi/client'

const ExtendModal = () => {
  const dispatch = useDispatch()

  const wallet = useWallet()

  const { extendModalOpen } = useSelector((state) => state.util)
  const { extendLoan } = useSelector((state) => state.sharkifyLend)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [failMessage, setFailMessage] = useState(null)
  const [txLink, setTxLink] = useState(null)
  const [nftCollateral, setNftCollateral] = useState(null)

  const [getBestOffer, { data, loading, stopPolling, startPolling }] =
    useLazyQuery(GET_BEST_OFFER_FOR_EXTEND, {
      fetchPolicy: 'no-cache',
    })

  const orderBook = extendLoan?.orderBook
  const bestOffer = data?.getLoans?.data[0]

  const [deleteLoanByPubKey] = useMutation(DELETE_LOAN_BY_PUBKEY)
  const [borrowLoan] = useMutation(BORROW_LOAN)

  useEffect(() => {
    if (extendLoan && extendModalOpen) {
      getBestOffer({
        variables: {
          args: {
            pagination: {
              limit: 1,
              offset: 0,
            },
            filter: {
              type: 'offered',
              orderBookId: parseInt(extendLoan?.orderBook?.id),
            },
            sort: {
              order: 'DESC',
              type: 'amount',
            },
          },
        },
        pollInterval: 1000,
      })
    }

    if (!extendModalOpen) {
      stopPolling()
    } else {
      startPolling()
    }
  }, [extendLoan, extendModalOpen])

  const currentLoan = getLoanInfo(extendLoan)
  const newLoan = getLoanInfo(bestOffer)

  useEffect(() => {
    if (extendModalOpen) {
      fetchNftCollateral(extendLoan)
    }
  }, [extendLoan, nftCollateral, extendModalOpen])

  const fetchNftCollateral = async (loan) => {
    const { data } = await axios.get(
      `${SHYFT_URL}/nft/read?network=mainnet-beta&token_address=${loan?.nftCollateralMint}`,
      AXIOS_CONFIG_SHYFT_KEY
    )

    setNftCollateral(data?.result)
  }

  const onClose = () => {
    dispatch(changeExtendModalOpen(false))
    setFailMessage(null)
    setIsSuccess(false)
    setTxLink(null)
    setNftCollateral(null)
    setIsSubmitting(false)
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
          <div className="flex w-full items-center justify-between">
            <h1 className="text-[18px]">You are extending:</h1>
            {nftCollateral ? (
              <h1 className="text-[2.1rem] font-bold">{nftCollateral?.name}</h1>
            ) : (
              <Spinner className="ml-2 mr-2 h-8 w-8 animate-spin fill-teal-400" />
            )}
          </div>
        )}
      </motion.div>
    )
  }

  const renderExtendButton = () => {
    const disabled = isSubmitting || loading

    return (
      <div>
        <button
          type="button"
          onClick={isSuccess ? onClose : extend}
          disabled={disabled}
          className="flex items-center justify-center rounded rounded-xl bg-[#6B3A00] px-[2rem] py-[1.5rem] text-[1.25rem] font-bold text-white"
        >
          {!disabled && (
            <span>
              {isSuccess ? 'Close' : `Extend by ${newLoan?.remainingTime}`}
            </span>
          )}
          {disabled && (
            <Spinner className="h-7 w-7 animate-spin fill-[#6B3A00] text-white" />
          )}
        </button>
      </div>
    )
  }

  const waitTransactionConfirmation = async (tx, oldPubKey, loan) => {
    const provider = createAnchorProvider(wallet)

    const confirmedTransaction = await provider.connection.confirmTransaction(
      { signature: tx },
      'confirmed'
    )

    if (confirmedTransaction.value.err) {
      setFailMessage(`Transaction failed: ${confirmedTransaction.value.err}`)
    } else {
      // Call delete loan
      try {
        await deleteLoanByPubKey({ variables: { pubKey: oldPubKey } })
      } catch (error) {
        console.log(error)
      }

      try {
        await borrowLoan({ variables: { borrowedLoan: loan } })
      } catch (error) {
        console.log(error)
      }

      setIsSuccess(true)
      setTxLink(`https://solana.fm/tx/${tx}?cluster=mainnet-qn1`)

      notification.open({
        closeIcon: (
          <svg
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="close"
            width="0.9em"
            height="0.9em"
            fill="#ffffff"
            aria-hidden="true"
          >
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
          </svg>
        ),
        type: 'success',
        className: 'bg-[#191C20] text-white',
        description: `Done! You've taken out a ${bestOfferSol} SOL loan, in a few seconds
            this will reflect in your history`,
        duration: 5,
        placement: 'top',
        message: <p className="text-white">Success</p>,
      })
    }
  }

  const extend = async () => {
    try {
      setIsSubmitting(true)
      setFailMessage(null)
      setIsSuccess(false)

      const provider = createAnchorProvider(wallet)
      const sharkyClient = createSharkyClient(provider)
      const { program } = sharkyClient

      // Fetch best loan
      const { data } = await getBestOffer({
        variables: {
          args: {
            pagination: {
              limit: 1,
              offset: 0,
            },
            filter: {
              type: 'offered',
              orderBookId: parseInt(orderBook?.id),
            },
            sort: {
              order: 'DESC',
              type: 'amount',
            },
          },
        },
        pollInterval: 0,
      })
      const bestOffer = data?.getLoans?.data[0]

      if (bestOffer) {
        const offeredLoan = await sharkyClient.fetchLoan({
          program,
          loanPubKey: new PublicKey(bestOffer.pubKey),
        })

        if (!offeredLoan) {
          setFailMessage(`No loan found with pubkey ${bestOffer.pubKey}`)
          return
        }
        if (!('offered' in offeredLoan)) {
          setFailMessage('Loan is already taken.')
          return
        }

        const currentLoan = await sharkyClient.fetchLoan({
          program,
          loanPubKey: new PublicKey(extendLoan?.pubKey),
        })

        if (!currentLoan) {
          setFailMessage(`No loan found with pubkey ${loan.pubKey}`)
          return
        }
        if (!('taken' in currentLoan)) {
          setFailMessage('Loan is not in taken state')
          return
        }

        const sharkyOffer = offeredLoan.offered
        const sharkyLoan = currentLoan.taken

        const { orderBook } = await sharkyClient.fetchOrderBook({
          program,
          orderBookPubKey: sharkyOffer.data.orderBook,
        })

        if (orderBook) {
          const { takenLoan, sig } = await sharkyLoan.extend({
            program,
            orderBook,
            newLoan: sharkyOffer,
          })

          const loanToBorrow = {
            pubKey: takenLoan.pubKey.toBase58(),
            nftCollateralMint:
              takenLoan.data.loanState.taken?.taken.nftCollateralMint.toBase58(),
            lenderNoteMint:
              takenLoan.data.loanState.taken?.taken.lenderNoteMint.toBase58(),
            borrowerNoteMint:
              takenLoan.data.loanState.taken?.taken.borrowerNoteMint.toBase58(),
            apy: takenLoan.data.loanState.taken?.taken.apy.fixed?.apy,
            start:
              takenLoan.data.loanState.taken?.taken.terms.time?.start?.toNumber(),
            totalOwedLamports:
              takenLoan.data.loanState.taken?.taken.terms.time?.totalOwedLamports?.toNumber(),
          }

          // Check if the transaction was successful
          await waitTransactionConfirmation(
            sig,
            sharkyLoan.pubKey.toBase58(),
            loanToBorrow
          )
        }
      }

      setIsSubmitting(false)
    } catch (e) {
      console.log(e)
      setIsSubmitting(false)
    }
  }

  function getLoanInfo(loan) {
    let { days, hours, minutes } = breakdownLoanDuration(
      loan?.start,
      loan?.duration
    )
    const remainingTime = loan?.start
      ? `${days > 0 && days + 'd'} ${hours > 0 && hours + 'h'} ${
          minutes > 0 && minutes + 'm'
        }`
      : loan?.duration / 86400 + 'd'

    return {
      principal: loan?.principalLamports / LAMPORTS_PER_SOL,
      interest: calculateBorrowInterest(
        loan?.principalLamports / LAMPORTS_PER_SOL,
        loan?.duration,
        loan?.orderBook?.apy
      ),
      remainingTime,
    }
  }

  return (
    extendModalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex h-full items-center justify-center font-inter md:h-auto"
      >
        <Overlay onClose={onClose} />
        <div className="relative flex w-full flex-col items-center justify-center md:block md:w-auto">
          {orderBook?.collectionImage && (
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
                src={orderBook?.collectionImage}
                width={0}
                height={0}
                alt=""
                unoptimized
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
          )}
          <div
            className={`modal duration-400 relative flex h-screen flex-col justify-center rounded-[1.25rem] transition-colors ease-in-out md:h-auto md:overflow-y-auto ${
              isSuccess ? 'bg-[#022628]' : 'bg-[#191C20]'
            } w-full overflow-y-scroll px-[2rem] pb-[3rem] pt-[5.8rem] text-white shadow-lg md:w-[450px]`}
          >
            {renderCloseButton()}
            {renderTitle()}
            <div className="my-6 border border-white opacity-10" />

            <div className="flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] font-bold text-[#666666]">
                  Current
                </p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem] font-bold text-white">New Loan</p>
              </div>
            </div>

            <div className="mt-3 flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">Principal</p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">Principal</p>
              </div>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">
                  {currentLoan?.principal.toPrecision(2)}
                </p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">
                  {loading ? (
                    <Spinner className="h-7 w-7 animate-spin fill-[#6B3A00] text-white" />
                  ) : (
                    newLoan?.principal.toPrecision(2)
                  )}
                </p>
              </div>
            </div>

            <div className="mt-3 flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">Interest</p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">Interest</p>
              </div>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">
                  {currentLoan?.interest.toPrecision(2)}
                </p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">
                  {loading ? (
                    <Spinner className="h-7 w-7 animate-spin fill-[#6B3A00] text-white" />
                  ) : (
                    newLoan?.interest.toPrecision(2)
                  )}
                </p>
              </div>
            </div>

            <div className="mt-3 flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">Remaining Time</p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">New Duration</p>
              </div>
            </div>

            <div className="flex w-full justify-between">
              <div className="flex w-[47%] justify-end">
                <p className="text-[1.6rem] text-[#666666]">
                  {currentLoan?.remainingTime}
                </p>
              </div>
              <div className="flex  w-[47%]">
                <p className="text-[1.6rem]">
                  {loading ? (
                    <Spinner className="h-7 w-7 animate-spin fill-[#6B3A00] text-white" />
                  ) : (
                    newLoan?.remainingTime
                  )}
                </p>
              </div>
            </div>

            <div className="my-8 border border-white opacity-10" />

            <div className="flex w-full justify-center">
              {renderExtendButton()}
            </div>
            {!loading && (
              <div className="mt-6 flex w-full justify-center text-[1.35rem]">
                Amount owned after extending:{' '}
                {(newLoan.principal + newLoan.interest).toPrecision(3)}
              </div>
            )}
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
              <div className="mt-4 flex w-full justify-center break-all text-center text-[1.6rem] text-red-500">
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

export default ExtendModal
