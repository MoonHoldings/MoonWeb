import { useDispatch, useSelector } from 'react-redux'
import { changeLoanDetailsModalOpen } from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import Image from 'next/image'
import { useEffect } from 'react'
import { GET_ORDER_BOOK_ACTIVE, GET_ORDER_BOOK_OFFERS } from 'utils/queries'
import { useLazyQuery } from '@apollo/client'

const LoanDetailsModal = () => {
  const { loanDetailsModalOpen } = useSelector((state) => state.util)
  const { loanDetails } = useSelector((state) => state.sharkifyLend)
  const dispatch = useDispatch()
  const [
    getOrderBookActiveLoans,
    { loading: loadingActiveLoans, data: activeLoans },
  ] = useLazyQuery(GET_ORDER_BOOK_ACTIVE, {
    fetchPolicy: 'no-cache',
  })
  const [getOrderBookOffers, { loading: loadingOffers, data: offers }] =
    useLazyQuery(GET_ORDER_BOOK_OFFERS, {
      fetchPolicy: 'no-cache',
    })

  useEffect(() => {
    getOrderBookActiveLoans({
      variables: {
        args: {
          pagination: {
            limit: 5,
            offset: 0,
          },
          filter: {
            type: 'taken',
            orderBookId: loanDetails,
          },
          sort: {
            order: 'DESC',
            type: 'time',
          },
        },
      },
      pollInterval: 60_000,
    })
  }, [loanDetails, getOrderBookActiveLoans])

  useEffect(() => {
    getOrderBookOffers({
      variables: {
        args: {
          pagination: {
            limit: 5,
            offset: 0,
          },
          filter: {
            type: 'offered',
            orderBookId: loanDetails,
          },
          sort: {
            order: 'DESC',
            type: 'amount',
          },
        },
      },
      pollInterval: 60_000,
    })
  }, [loanDetails, getOrderBookOffers])

  const onClose = () => dispatch(changeLoanDetailsModalOpen(false))

  const moreTakenLoansCount =
    activeLoans?.getLoans?.activeCount - activeLoans?.getLoans?.data?.length
  const moreActiveOffersCount =
    offers?.getLoans?.offerCount - offers?.getLoans?.data?.length

  const formatElapsedTime = (unixTime) => {
    const currentUnixTime = Math.floor(Date.now() / 1000)
    let timePassed
    let unit

    const secondsPassed = currentUnixTime - unixTime

    if (secondsPassed < 60) {
      timePassed = secondsPassed
      unit = 'second'
    } else if (secondsPassed < 3600) {
      timePassed = Math.floor(secondsPassed / 60)
      unit = 'minute'
    } else if (secondsPassed < 86400) {
      timePassed = Math.floor(secondsPassed / 3600)
      unit = 'hour'
    } else if (secondsPassed < 2592000) {
      timePassed = Math.floor(secondsPassed / 86400)
      unit = 'day'
    } else {
      timePassed = Math.floor(secondsPassed / 2592000)
      unit = 'month'
    }

    if (timePassed !== 1) {
      unit += 's'
    }

    return `${timePassed} ${unit} ago`
  }

  const renderTakenLoans = () => {
    return activeLoans?.getLoans?.data?.map((loan, index) => {
      const fee =
        ((loan.totalOwedLamports - loan.principalLamports) *
          loan.orderBook.feePermillicentage) /
        100_000

      return (
        <div
          className="flex justify-around border-b border-b-white border-opacity-25"
          key={index}
        >
          <div className="flex flex-1 items-center justify-center bg-[#101113] py-5 text-[1.3rem] sm:text-[1.6rem]">
            <div className="flex items-center">
              {toCurrencyFormat(loan.principalLamports / LAMPORTS_PER_SOL)}
              <Image
                className="ml-2 h-[1.5rem] w-[1.5rem] sm:ml-3 sm:h-[1.7rem] sm:w-[1.7rem]"
                src="/images/svgs/sol.svg"
                width={24}
                height={24}
                alt=""
              />
            </div>
            <div className="mx-3 sm:mx-6">{'>'}</div>
            <div className="flex items-center">
              {toCurrencyFormat(
                (loan.totalOwedLamports - fee) / LAMPORTS_PER_SOL
              )}
              <Image
                className="ml-2 h-[1.5rem] w-[1.5rem] sm:ml-3 sm:h-[1.7rem] sm:w-[1.7rem]"
                src="/images/svgs/sol.svg"
                width={24}
                height={24}
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-1 justify-center bg-[#212327] py-5 text-[1.3rem] sm:text-[1.6rem]">
            {formatElapsedTime(loan.start)}
          </div>
        </div>
      )
    })
  }

  const renderOffers = () => {
    return offers?.getLoans?.data?.map((loan, index) => {
      return (
        <div
          className="flex justify-around border-b border-b-white border-opacity-25"
          key={index}
        >
          <div className="flex flex-1 items-center justify-center bg-[#101113] py-5 text-[1.3rem] sm:text-[1.6rem]">
            <div className="flex items-center">
              {toCurrencyFormat(loan.principalLamports / LAMPORTS_PER_SOL)}
              <Image
                className="ml-2 h-[1.5rem] w-[1.5rem] sm:ml-3 sm:h-[1.7rem] sm:w-[1.7rem]"
                src="/images/svgs/sol.svg"
                width={24}
                height={24}
                alt=""
              />
            </div>
          </div>
          <div className="flex flex-1 justify-center bg-[#212327] py-5 text-[1.3rem] sm:text-[1.6rem]">
            {formatElapsedTime(loan.offerTime)}
          </div>
        </div>
      )
    })
  }

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
        <div className="modal relative flex w-full flex-col rounded-[1.25rem] bg-[#191C20] pt-6 text-white shadow-lg md:w-4/5 lg:h-auto lg:w-auto lg:min-w-[500px]">
          <div className="flex w-full justify-center">
            <span className="text-[1.5rem] font-medium">
              {loanDetails?.collectionName}
            </span>
          </div>
          <div className="mt-6 flex w-full items-center justify-between bg-[#34383D] py-6">
            <div className="flex flex-1 justify-center text-[1.2rem] sm:text-[1.4rem]">
              Active Lenders (
              <div className="flex items-center">
                {toCurrencyFormat(activeLoans?.getLoans?.totalActive ?? 0)}
                <Image
                  className="ml-3 h-[1.5rem] w-[1.5rem] sm:h-[1.7rem] sm:w-[1.7rem]"
                  src="/images/svgs/sol.svg"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              )
            </div>
            <div className="flex flex-1 justify-center text-[1.2rem] sm:text-[1.4rem]">
              Taken
            </div>
          </div>
          <div className="flex flex-col ">{renderTakenLoans()}</div>
          {moreTakenLoansCount > 0 && (
            <div className="flex w-full justify-center bg-[#101113] py-6 text-[1.2rem] sm:text-[1.4rem]">
              More ({moreTakenLoansCount})
            </div>
          )}
          <div className="flex w-full justify-between bg-[#34383D] py-6">
            <div className="flex flex-1 justify-center text-[1.2rem] sm:text-[1.4rem]">
              Active Offers (
              <div className="flex items-center">
                {toCurrencyFormat(activeLoans?.getLoans?.totalOffers ?? 0)}
                <Image
                  className="ml-3 h-[1.5rem] w-[1.5rem] sm:h-[1.7rem] sm:w-[1.7rem]"
                  src="/images/svgs/sol.svg"
                  width={24}
                  height={24}
                  alt=""
                />
              </div>
              )
            </div>
            <div className="flex flex-1 justify-center text-[1.2rem] sm:text-[1.4rem]">
              Offer Made
            </div>
          </div>
          <div className="flex flex-col">{renderOffers()}</div>
          {moreActiveOffersCount > 0 ? (
            <div className="flex w-full justify-center rounded-b-[1.25rem] bg-[#101113] py-6 text-[1.2rem] sm:text-[1.4rem]">
              More ({moreActiveOffersCount})
            </div>
          ) : (
            <div className="h-8 rounded-b-[1.25rem] bg-[#191C20]" />
          )}
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
