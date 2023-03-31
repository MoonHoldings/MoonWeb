import { useDispatch, useSelector } from 'react-redux'
import { changeLendOfferModalOpen } from 'redux/reducers/utilSlice'
import { motion } from 'framer-motion'
import Image from 'next/image'

const LendOfferModal = () => {
  const { lendOfferModalOpen } = useSelector((state) => state.util)
  const dispatch = useDispatch()

  const onClose = () => dispatch(changeLendOfferModalOpen(false))

  return (
    lendOfferModalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="absolute bottom-0 left-0 right-0 top-0 z-[52] flex flex items-center justify-center font-inter"
      >
        <Overlay onClose={onClose} />
        <div className="relative flex h-screen flex-col justify-center overflow-y-scroll md:block md:h-auto md:overflow-y-visible">
          <div className="absolute left-1/2 z-[99] mr-3 hidden h-[8rem] w-[8rem] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border border-black bg-white md:flex">
            <Image
              className="h-[4rem] w-[4rem]"
              src="/images/svgs/moon-holdings-logo-black.svg"
              width={0}
              height={0}
              alt=""
            />
          </div>
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
              <h1 className="text-[2.1rem] font-bold">Moonholders</h1>
            </div>
            <div className="mt-8 flex w-full justify-between text-xl">
              <p>APY%</p>
              <p>Duration</p>
              <p>Floor</p>
            </div>
            <div className="mt-4 flex w-full justify-between text-3xl">
              <p className="text-[#11AF22]">160%</p>
              <p>16d</p>
              <p>14.40</p>
            </div>
            <div className="my-8 border border-white opacity-10" />
            <div className="flex w-full flex-col justify-between xl:flex-row">
              <div className="flex flex-col">
                <p className="text-xl">Offer Amount</p>
                <div className="mb-[1rem] mt-4 grid grid-cols-[1.6rem_auto] items-center gap-[0.8rem] rounded-[0.8rem] border-0 bg-[#0C0D0F] px-[1.6rem] py-[1.3rem] text-[1.4rem] focus-within:border-[1px] focus-within:border-[#62E3DD]">
                  <Image
                    className="h-[1.6rem] w-[1.6rem]"
                    src="/images/svgs/sol.svg"
                    width={16}
                    height={16}
                    alt=""
                  />
                  <input
                    className="bg-transparent text-[1.4rem] placeholder:text-[#62E3DD] focus:outline-none"
                    type="number"
                  />
                </div>
                <div className="flex items-center">
                  <p className="mr-2 text-xl text-[#747E92]">Best offer:</p>
                  <Image
                    className="h-[1.6rem] w-[1.6rem]"
                    src="/images/svgs/sol.svg"
                    width={16}
                    height={16}
                    alt=""
                  />
                  <p className="ml-1 mr-2 text-xl text-[#747E92]">9.30</p>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-xl">Total Interest</p>
                <div className="mb-[1rem] mt-4 grid grid-cols-[1.6rem_auto] items-center gap-[0.8rem] rounded-[0.8rem] border-0 bg-[#0C0D0F] px-[1.6rem] py-[1.3rem] text-[1.4rem] focus-within:border-[1px] focus-within:border-[#62E3DD]">
                  <Image
                    className="h-[1.6rem] w-[1.6rem]"
                    src="/images/svgs/sol.svg"
                    width={20}
                    height={20}
                    alt=""
                  />
                  <input
                    className="bg-transparent text-[1.4rem] placeholder:text-[#62E3DD] focus:outline-none"
                    type="number"
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
                className="rounded rounded-xl border-2 border-white bg-gradient-to-b from-[#61D9EB] to-[#63EDD0] px-[2rem] py-[1.5rem] text-[1.25rem] font-bold text-[#15181B]"
              >
                Place Offer
              </button>
            </div>
            <p className="mt-10 w-full text-center text-[1.4rem] text-[#747E92]">
              Offers can be revoked at any time up until it is taken by a
              borrower.
            </p>
          </div>
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
