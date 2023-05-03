import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeLendModalOpen } from 'redux/reducers/utilSlice'
import { FormProvider, useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Alert, notification } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import createAnchorProvider, { connection } from 'utils/createAnchorProvider'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import { createSharkyClient } from '@sharkyfi/client'
import mergeClasses from 'utils/mergeClasses'
import TextBlink from 'components/partials/TextBlink'
import calculateLendInterest from 'utils/calculateLendInterest'
import { useMutation } from '@apollo/client'
import { CREATE_LOANS } from 'utils/mutations'

const MAX_OFFERS = 4

const LendModal = () => {
  const dispatch = useDispatch()

  const { publicKey } = useWallet()
  const wallet = useWallet()

  const { lendModalOpen } = useSelector((state) => state.util)
  const { orderBook } = useSelector((state) => state.sharkifyLend)

  const [balance, setBalance] = useState(null)
  const [numLoanOffers, setNumLoanOffers] = useState(1)
  const [isSuccess, setIsSuccess] = useState(false)
  const [failMessage, setFailMessage] = useState(null)
  const [txLink, setTxLink] = useState(null)

  const [createLoans] = useMutation(CREATE_LOANS)

  const methods = useForm({
    defaultValues: {
      offerAmount: '',
    },
    mode: 'onBlur',
  })

  const {
    formState: { errors, isSubmitting },
    watch,
    register,
    setValue,
    handleSubmit,
    reset,
    clearErrors,
    getValues,
  } = methods

  useEffect(() => {
    if (lendModalOpen && publicKey) {
      getBalance()
    }
  }, [getBalance, lendModalOpen, publicKey])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getBalance = async () => {
    if (!publicKey) return

    try {
      const balance = await connection.getBalance(publicKey)
      setBalance(balance / LAMPORTS_PER_SOL)
    } catch (error) {
      console.log(error)
    }
  }

  const onClose = () => {
    dispatch(changeLendModalOpen(false))
    setNumLoanOffers(1)
    setIsSuccess(false)
    reset()
  }

  const waitTransactionConfirmation = async (tx, loans) => {
    const provider = createAnchorProvider(wallet)

    const confirmedTransaction = await provider.connection.confirmTransaction(
      { signature: tx },
      'confirmed'
    )

    if (confirmedTransaction.value.err) {
      setFailMessage(`Transaction failed: ${confirmedTransaction.value.err}`)
    } else {
      // Call create loans mutation
      try {
        await createLoans({
          variables: { loans },
        })
      } catch (error) {
        console.log(error)
      }

      getBalance()
      setIsSuccess(true)
      setTxLink(`https://solana.fm/tx/${tx}?cluster=mainnet-qn1`)
      notification.open({
        closeIcon: (
          <svg
            className="ml-2"
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
        description: `Done! You've offered a ${orderBook?.duration} day loan, in a few seconds this will reflect in your history`,
        duration: 5,
        placement: 'top',
        message: <p className="text-white">Success</p>,
      })
    }
  }

  const placeOffer = async () => {
    const provider = createAnchorProvider(wallet)
    const sharkyClient = createSharkyClient(provider)
    const { program } = sharkyClient

    const { orderBook: orderBookInfo } = await sharkyClient.fetchOrderBook({
      program,
      orderBookPubKey: orderBook.pubKey,
    })

    const { offerAmount } = getValues()

    try {
      const { sig, offeredLoans } = await orderBookInfo.offerLoan({
        program,
        principalLamports: parseFloat(offerAmount) * LAMPORTS_PER_SOL,
        onTransactionUpdate: console.dir,
        count: numLoanOffers,
      })
      const loansToCreate = offeredLoans.map((loan) => ({
        pubKey: loan.pubKey.toBase58(),
        version: loan.data.version,
        principalLamports: loan.data.principalLamports.toNumber(),
        valueTokenMint: loan.data.valueTokenMint.toBase58(),
        supportsFreezingCollateral: loan.supportsFreezingCollateral,
        isCollateralFrozen: loan.isCollateralFrozen,
        isHistorical: loan.isHistorical,
        isForeclosable: loan.isForeclosable('mainnet'),
        state: loan.state,
        duration:
          loan.data.loanState?.offer?.offer.termsSpec.time?.duration?.toNumber(),
        lenderWallet: loan.data.loanState.offer?.offer.lenderWallet.toBase58(),
        offerTime: loan.data.loanState.offer?.offer.offerTime?.toNumber(),
        orderBook: loan.data.orderBook.toBase58(),
      }))

      // Check if the transaction was successful
      await waitTransactionConfirmation(sig, loansToCreate)
    } catch (error) {
      console.log(error)
    }
  }

  const onChangeOfferAmount = (event) => {
    const { name, value } = event.target
    const VALID_INPUT_FORMAT = /^(\d*(\.(\d{1,2})?)?)$/

    clearErrors()

    if (value === '.') {
      setValue(name, '0.', {
        shouldDirty: true,
      })
    } else if (VALID_INPUT_FORMAT.test(value)) {
      if (parseFloat(value) < 999999 || value === '') {
        setValue(name, value, {
          shouldDirty: true,
        })
      }
    }
  }

  const floorPriceSol = orderBook?.floorPriceSol
    ? orderBook?.floorPriceSol
    : null
  const isOfferGreaterThanFloorPrice = floorPriceSol
    ? parseFloat(watch('offerAmount')) > floorPriceSol
    : false

  const renderPlaceOfferButton = () => {
    return (
      <button
        type="button"
        className="flex items-center justify-center rounded rounded-xl border-2 border-white bg-gradient-to-b from-[#61D9EB] to-[#63EDD0] px-[2rem] py-[1.5rem] text-[1.25rem] font-bold text-[#15181B]"
        disabled={
          isSubmitting ||
          errors?.offerAmount?.message !== undefined ||
          balance === null
        }
        onClick={handleSubmit(placeOffer)}
      >
        <span>
          {numLoanOffers === 1
            ? 'Place Offer'
            : `Place ${numLoanOffers} Offers`}
        </span>
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

  const renderOfferAmountInput = () => {
    return (
      <div className="flex w-full flex-col xl:w-1/2">
        <p className="text-xl">Offer Amount</p>
        <div className="mb-[1rem] mt-4 flex items-center rounded-[0.8rem] border border-[#0C0D0F] bg-[#0C0D0F] px-[1.6rem] py-[1.1rem] text-[1.4rem] transition duration-200 ease-in-out focus-within:border-[1px] focus-within:border-[#62E3DD]">
          <Image
            className="h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={16}
            height={16}
            alt=""
          />
          <input
            {...register('offerAmount', {
              required: {
                value: true,
                message: 'Offer amount is required.',
              },
              min: {
                value: 0.01,
                message: 'Please input an offer amount not less than 0.01.',
              },
              max: {
                value: balance,
                message: `Not enough balance.`,
              },
            })}
            className="ml-4 bg-transparent text-[1.4rem] placeholder:text-[#62E3DD] focus:outline-none"
            type="text"
            id="offerAmount"
            value={watch('offerAmount')}
            onChange={(event) => onChangeOfferAmount(event)}
            onFocus={() => {
              setIsSuccess(false)
            }}
          />
        </div>
        {errors?.offerAmount?.message && (
          <span className="mb-2 w-auto break-words text-xl text-red-500">
            {errors?.offerAmount?.message}
          </span>
        )}
        <div className="mb-6 flex items-center xl:mb-0">
          <p className="mr-2 text-xl text-[#747E92]">Best offer:</p>
          <Image
            className="h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={16}
            height={16}
            alt=""
          />
          <p className="ml-1 mr-2 text-xl text-[#747E92]">
            {toCurrencyFormat(orderBook?.bestOffer)}
          </p>
        </div>
      </div>
    )
  }

  const renderInterest = () => {
    return (
      <div className="flex w-full flex-col xl:ml-8 xl:w-1/2">
        <p className="text-xl">Total Interest</p>
        <div className="mb-[1rem] mt-4 flex items-center rounded-[0.8rem] border border-[#0C0D0F] bg-[#0C0D0F] px-[1.6rem] py-[1.1rem] text-[1.4rem] transition duration-200 ease-in-out focus-within:border-[1px] focus-within:border-[#62E3DD]">
          <Image
            className="h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={20}
            height={20}
            alt=""
          />
          <input
            className="ml-4 bg-transparent text-[1.4rem] placeholder:text-[#62E3DD] focus:outline-none"
            type="text"
            value={calculateLendInterest(
              parseFloat(watch('offerAmount')),
              orderBook?.durationSeconds,
              orderBook?.apy,
              orderBook?.feePermillicentage
            )}
            disabled
          />
        </div>
      </div>
    )
  }

  const renderQuantityOptions = () => {
    return (
      <div className="mt-4 flex flex-col justify-between xl:flex-row xl:items-center">
        <p className="mb-4 text-xl xl:mb-0">Number of Offers</p>
        <div className="flex">
          {Array.from({ length: MAX_OFFERS }).map((_value, index) => (
            <button
              className={mergeClasses(
                index > 0 && 'ml-6',
                'h-24',
                'w-24',
                'rounded rounded-2xl',
                'border',
                numLoanOffers === index + 1
                  ? 'border-[#62E3DD]'
                  : 'border-[#747E92]',
                'text-[1.6rem]',
                'font-bold',
                numLoanOffers === index + 1
                  ? 'text-[#62E3DD]'
                  : 'text-[#747E92',
                'hover:border-[#62E3DD]',
                'transition duration-200 ease-in-out hover:border-[1px]'
              )}
              key={index}
              onClick={() => {
                setNumLoanOffers(index + 1)

                if (isSuccess) {
                  setIsSuccess(false)
                }
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
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
            {orderBook?.collectionName}
          </h1>
        )}
      </motion.div>
    )
  }

  const renderOrderBookInfo = () => {
    return (
      <>
        <div className="mt-8 flex w-full justify-between text-xl">
          <p>APY%</p>
          <p>Duration</p>
          <p>Floor</p>
        </div>
        <div className="mt-4 flex w-full justify-between text-3xl">
          <p className="text-[#11AF22]">{orderBook?.apyAfterFee}%</p>
          <p>{orderBook?.duration}d</p>
          <p>{floorPriceSol ? toCurrencyFormat(floorPriceSol) : 'No Data'}</p>
        </div>
      </>
    )
  }

  const renderTotal = () => {
    return (
      <div className="flex justify-between">
        <p className="text-2xl">Total</p>
        <div className="flex">
          <Image
            className="h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={16}
            height={16}
            alt=""
          />
          <p className="ml-2 text-2xl">
            {toCurrencyFormat(parseFloat(watch('offerAmount')) * numLoanOffers)}
          </p>
        </div>
      </div>
    )
  }

  const renderBalance = () => {
    return (
      <div className="mt-4 flex justify-between">
        <p className="text-2xl">You have</p>
        <div className="flex">
          <Image src="/images/svgs/sol.svg" width={16} height={16} alt="" />
          <TextBlink
            className="ml-2 text-2xl"
            text={toCurrencyFormat(balance ? balance : 0)}
          />
        </div>
      </div>
    )
  }

  return (
    lendModalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex flex h-full items-center justify-center font-inter md:h-auto"
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
          <FormProvider {...methods}>
            <div
              className={`modal duration-400 relative flex h-screen flex-col justify-center rounded-[1.25rem] transition-colors ease-in-out md:h-auto md:overflow-y-auto ${
                isSuccess ? 'bg-[#022628]' : 'bg-[#191C20]'
              } w-full overflow-y-scroll px-[2rem] pb-[2rem] pt-[5.8rem] text-white shadow-lg md:w-auto`}
            >
              {renderCloseButton()}
              {renderTitle()}
              {renderOrderBookInfo()}
              <div className="my-8 border border-white opacity-10" />
              <div className="flex w-full flex-col justify-between xl:flex-row">
                {renderOfferAmountInput()}
                {renderInterest()}
              </div>
              {isOfferGreaterThanFloorPrice && (
                <Alert
                  className="my-5"
                  message={
                    <span className="text-[1.3rem]">
                      This offer amount is more than the current floor price!
                    </span>
                  }
                  type="error"
                />
              )}
              {renderQuantityOptions()}
              <div className="my-8 border border-white opacity-10" />
              {renderTotal()}
              {renderBalance()}
              <div className="mt-4 flex w-full justify-center">
                {renderPlaceOfferButton()}
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
              <p className="mt-10 w-full text-center text-[1.4rem] text-[#747E92]">
                Offers can be revoked at any time up until it is taken by a
                borrower.
              </p>
            </div>
          </FormProvider>
          {/* <Image
            className="bottom-0 w-full"
            src="/images/svgs/modal-footer.svg"
            width={0}
            height={0}
            alt=""
          /> */}
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

export default LendModal
