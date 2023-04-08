import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeLendOfferModalOpen } from 'redux/reducers/utilSlice'
import { FormProvider, useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useWallet } from '@solana/wallet-adapter-react'
import createAnchorProvider, { connection } from 'utils/createAnchorProvider'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import { createSharkyClient } from '@sharkyfi/client'

import mergeClasses from 'utils/mergeClasses'

const MAX_OFFERS = 4

const LendOfferModal = () => {
  const dispatch = useDispatch()

  const { publicKey } = useWallet()
  const wallet = useWallet()

  const { lendOfferModalOpen } = useSelector((state) => state.util)
  const { orderBook } = useSelector((state) => state.sharkifyLend)

  const [balance, setBalance] = useState(null)
  const [numLoanOffers, setNumLoanOffers] = useState(1)
  const [bestOffer, setBestOffer] = useState(0)
  const [isSuccess, setIsSuccess] = useState(false)
  const [failMessage, setFailMessage] = useState(null)
  const [txLink, setTxLink] = useState(null)

  const methods = useForm({
    defaultValues: {
      offerAmount: '',
    },
    mode: 'onBlur',
  })

  const {
    formState: { errors, isSubmitting },
    getValues,
    watch,
    register,
    setValue,
    handleSubmit,
    reset,
    clearErrors,
  } = methods

  useEffect(() => {
    if (lendOfferModalOpen && publicKey && orderBook) {
      async function getBalance() {
        if (!publicKey) return

        const balance = await connection.getBalance(publicKey)
        setBalance(balance / LAMPORTS_PER_SOL)
      }

      // async function getBestOffer() {
      //   const provider = createAnchorProvider(wallet)
      //   const sharkyClient = createSharkyClient(provider)
      //   const { program } = sharkyClient

      //   const { orderBook: orderBookInfo } = await sharkyClient.fetchOrderBook({
      //     program,
      //     orderBookPubKey: orderBook.pubKey,
      //   })

      //   console.log('getBestOffer', orderBookInfo)

      //   const { offered } = orderBookInfo.createOfferLoanInstruction
      //   const bestOffer = toCurrencyFormat(
      //     offered?.data?.principalLamports.toNumber() / LAMPORTS_PER_SOL
      //   )

      //   setBestOffer(bestOffer)
      // }

      getBalance()
      // getBestOffer()
    }
  }, [lendOfferModalOpen, publicKey, orderBook])

  const onClose = () => {
    dispatch(changeLendOfferModalOpen(false))
    setNumLoanOffers(1)
    reset()
  }

  const waitTransactionConfirmation = async (tx) => {
    const provider = createAnchorProvider(wallet)

    const confirmedTransaction = await provider.connection.confirmTransaction(
      { signature: tx },
      'confirmed'
    )

    if (confirmedTransaction.value.err) {
      setFailMessage(`Transaction failed: ${confirmedTransaction.value.err}`)
    }

    setIsSuccess(true)
    setTxLink(`https://solana.fm/tx/${tx}?cluster=mainnet-qn1`)
  }

  const placeOffer = async () => {
    const provider = createAnchorProvider(wallet)
    const sharkyClient = createSharkyClient(provider)

    const { program } = sharkyClient

    const { orderBook: orderBookInfo } = await sharkyClient.fetchOrderBook({
      program,
      orderBookPubKey: orderBook.pubKey,
    })

    try {
      const { offeredLoans, sig } = await orderBookInfo.offerLoan({
        program,
        principalLamports: 0.01 * LAMPORTS_PER_SOL,
        onTransactionUpdate: console.dir,
        count: numLoanOffers,
      })

      // Check if the transaction was successful
      await waitTransactionConfirmation(sig)
    } catch (error) {
      console.log(error)
    }
  }

  const onChangeOfferAmount = (event) => {
    const { name, value } = event.target
    const VALID_INPUT_FORMAT = /^(\d*(\.(\d{1,2})?)?)$/

    clearErrors()

    if (VALID_INPUT_FORMAT.test(value)) {
      if (parseFloat(value) < 999999 || value === '') {
        setValue(name, value, {
          shouldDirty: true,
        })
      }
    }
  }

  const calculateInterest = (amount, duration, apy) => {
    const dailyInterestRate = Math.pow(1 + apy / 100, 1 / 365) - 1
    const finalAmount = amount * Math.pow(1 + dailyInterestRate, duration / 365)
    const interest = finalAmount - amount

    return toCurrencyFormat(interest ? interest : 0)
  }

  return (
    lendOfferModalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex flex h-full items-center justify-center font-inter md:h-auto"
      >
        <Overlay onClose={onClose} />
        <div className="relative flex flex-col justify-center md:block">
          <div className="absolute left-1/2 z-[99] mr-3 hidden h-[8rem] w-[8rem] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white md:flex">
            <Image
              className="h-[4rem] w-[4rem]"
              src="/images/svgs/moon-holdings-logo-black.svg"
              width={0}
              height={0}
              alt=""
            />
          </div>
          <FormProvider {...methods}>
            <div
              className={`modal duration-400 relative flex flex-col rounded-t-[1.25rem] transition-colors ease-in-out ${
                isSuccess ? 'bg-[#022628]' : 'bg-[#191C20]'
              } px-[2rem] pb-[1.5rem] pt-[5.8rem] text-white shadow-lg`}
            >
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
              <div className="mt-8 flex w-full justify-between text-xl">
                <p>APY%</p>
                <p>Duration</p>
                <p>Floor</p>
              </div>
              <div className="mt-4 flex w-full justify-between text-3xl">
                <p className="text-[#11AF22]">{orderBook?.apy}</p>
                <p>{orderBook?.duration}</p>
                <p>0.00</p>
              </div>
              <div className="my-8 border border-white opacity-10" />
              <div className="flex w-full flex-col justify-between xl:flex-row">
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
                          message:
                            'Please input an offer amount not less than 0.01.',
                        },
                        max: {
                          value: balance,
                          message: `Please input an offer amount not more than ${toCurrencyFormat(
                            balance ? balance : 0
                          )}.`,
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
                      {orderBook?.bestOfferSol}
                    </p>
                  </div>
                </div>
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
                      value={calculateInterest(
                        parseFloat(watch('offerAmount')),
                        orderBook?.durationNumber,
                        orderBook?.apyPercent
                      )}
                      disabled
                    />
                  </div>
                </div>
              </div>
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
              <div className="my-8 border border-white opacity-10" />
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
                    {toCurrencyFormat(
                      parseFloat(watch('offerAmount')) * numLoanOffers
                    )}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <p className="text-2xl">You have</p>
                <div className="flex">
                  <Image
                    src="/images/svgs/sol.svg"
                    width={16}
                    height={16}
                    alt=""
                  />
                  <p className="ml-2 text-2xl">
                    {toCurrencyFormat(balance ? balance : 0)}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex w-full justify-center">
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
                <div className="flex w-full justify-center text-red-500">
                  {failMessage}
                </div>
              )}
              <p className="mt-10 w-full text-center text-[1.4rem] text-[#747E92]">
                Offers can be revoked at any time up until it is taken by a
                borrower.
              </p>
            </div>
          </FormProvider>
          <Image
            className="bottom-0 w-full"
            src="/images/svgs/modal-footer.svg"
            width={0}
            height={0}
            alt=""
          />
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

export default LendOfferModal
