import { useDispatch, useSelector } from 'react-redux'
import { changeLendOfferModalOpen } from 'redux/reducers/utilSlice'
import { FormProvider, useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import sharkyClient from 'utils/sharkyClient'

const LendOfferModal = () => {
  const dispatch = useDispatch()

  const { lendOfferModalOpen } = useSelector((state) => state.util)
  const { orderBook } = useSelector((state) => state.sharkifyLend)

  const [placingOffer, setPlacingOffer] = useState(false)

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
  } = methods

  const onClose = () => dispatch(changeLendOfferModalOpen(false))

  const placeOffer = async () => {
    setPlacingOffer(true)

    const { program } = sharkyClient

    const { orderBook } = await sharkyClient.fetchOrderBook({
      program,
      orderBookPubKey: orderBook.pubKey,
    })

    if (!orderBook) {
      console.error(`No orderbook found with pubkey ${orderBook.pubKey}`)
      onClose()
    }

    setPlacingOffer(false)
  }

  const onChangeOfferAmount = (event) => {
    const { name, value } = event.target
    const VALID_INPUT_FORMAT = /^(\d*(\.(\d{1,2})?)?)$/

    if (VALID_INPUT_FORMAT.test(value)) {
      setValue(name, value, {
        shouldDirty: true,
      })
    }
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
            <div className="modal relative flex flex-col rounded-t-[1.25rem] bg-[#191C20] px-[2rem] pb-[1.5rem] pt-[5.8rem] text-white shadow-lg xl:min-w-[500px]">
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
              <div className="flex w-full justify-center">
                <h1 className="text-[2.1rem] font-bold">
                  {orderBook?.collectionName}
                </h1>
              </div>
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
                <div className="flex flex-col">
                  <p className="text-xl">Offer Amount</p>
                  <div className="mb-[1rem] mt-4 grid grid-cols-[1.6rem_auto] items-center gap-[0.8rem] rounded-[0.8rem] border border-[#0C0D0F] bg-[#0C0D0F] px-[1.6rem] py-[1.1rem] text-[1.4rem] transition duration-200 ease-in-out focus-within:border-[1px] focus-within:border-[#62E3DD]">
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
                      })}
                      className="bg-transparent text-[1.4rem] placeholder:text-[#62E3DD] focus:outline-none"
                      type="text"
                      id="offerAmount"
                      value={watch('offerAmount')}
                      onChange={(event) => onChangeOfferAmount(event)}
                      // value={offerAmount}
                    />
                  </div>
                  {errors?.offerAmount?.message && (
                    <p className="mb-2 text-xl text-red-500">
                      {errors?.offerAmount?.message}
                    </p>
                  )}
                  <div className="flex items-center">
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
                <div className="flex flex-col xl:ml-8">
                  <p className="text-xl">Total Interest</p>
                  <div className="mb-[1rem] mt-4 grid grid-cols-[1.6rem_auto] items-center gap-[0.8rem] rounded-[0.8rem] border border-[#0C0D0F] bg-[#0C0D0F] px-[1.6rem] py-[1.1rem] text-[1.4rem] transition duration-200 ease-in-out focus-within:border-[1px] focus-within:border-[#62E3DD]">
                    <Image
                      className="h-[1.6rem] w-[1.6rem]"
                      src="/images/svgs/sol.svg"
                      width={20}
                      height={20}
                      alt=""
                    />
                    <input
                      className="bg-transparent text-[1.4rem] placeholder:text-[#62E3DD] focus:outline-none"
                      type="text"
                      value={'0.00'}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col justify-between xl:flex-row xl:items-center">
                <p className="mb-4 text-xl xl:mb-0">Number of Offers</p>
                <div className="flex">
                  <button className="h-24 w-24 rounded rounded-2xl border border-[#747E92] text-[1.6rem] font-bold text-[#747E92]">
                    1
                  </button>
                  <button className="ml-6 h-24 w-24 rounded rounded-2xl border border-[#747E92] text-[1.6rem] font-bold text-[#747E92]">
                    2
                  </button>
                  <button className="ml-6 h-24 w-24 rounded rounded-2xl border border-[#747E92] text-[1.6rem] font-bold text-[#747E92]">
                    3
                  </button>
                  <button className="ml-6 h-24 w-24 rounded rounded-2xl border border-[#747E92] text-[1.6rem] font-bold text-[#747E92]">
                    4
                  </button>
                </div>
              </div>
              <div className="my-8 border border-white opacity-10" />
              <div className="flex justify-between">
                <p className="text-xl">Total</p>
                <div className="flex">
                  <Image
                    className="h-[1.6rem] w-[1.6rem]"
                    src="/images/svgs/sol.svg"
                    width={16}
                    height={16}
                    alt=""
                  />
                  <p className="ml-2 text-xl">9.30</p>
                </div>
              </div>
              <div className="mt-4 flex justify-between">
                <p className="text-xl">You have</p>
                <div className="flex">
                  <Image
                    src="/images/svgs/sol.svg"
                    width={16}
                    height={16}
                    alt=""
                  />
                  <p className="ml-2 text-xl text-[#747E92]">9.30</p>
                </div>
              </div>
              <div className="mt-4 flex w-full justify-center">
                <button
                  type="button"
                  className="flex items-center justify-center rounded rounded-xl border-2 border-white bg-gradient-to-b from-[#61D9EB] to-[#63EDD0] px-[2rem] py-[1.5rem] text-[1.25rem] font-bold text-[#15181B]"
                  disabled={placingOffer}
                >
                  <span>Place Offer</span>
                  {placingOffer && (
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
