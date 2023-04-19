import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { changeBorrowModalOpen } from 'redux/reducers/utilSlice'
import Image from 'next/image'
import mergeClasses from 'utils/mergeClasses'
import toCurrencyFormat from 'utils/toCurrencyFormat'

const BorrowModal = () => {
  const dispatch = useDispatch()

  const { publicKey } = useWallet()
  const wallet = useWallet()

  const { borrowModalOpen } = useSelector((state) => state.util)
  const { orderBook } = useSelector((state) => state.sharkifyLend)
  const [selectedNft, setSelectedNft] = useState(null)

  const isSuccess = false
  const floorPriceSol = orderBook?.floorPriceSol
    ? orderBook?.floorPriceSol
    : null

  const onClose = () => {
    dispatch(changeBorrowModalOpen(false))
    setSelectedNft(null)
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

  const renderOwnedNfts = () => {
    return orderBook?.ownedNfts?.map((ownedNft, index) => (
      <button
        key={index}
        type="button"
        className={mergeClasses(
          'flex',
          'flex-col',
          'w-1/3',
          'justify-center',
          'items-center',
          'rounded rounded-2xl',
          'border',
          ownedNft?.mint === selectedNft ? 'border-[#62E3DD]' : 'border-black',
          'text-[1.3rem]',
          'font-bold',
          'hover:border-[#62E3DD]',
          'transition duration-200 ease-in-out',
          'bg-[#191C20]',
          'p-3',
          index > 0 && 'ml-6'
        )}
        onClick={() => setSelectedNft(ownedNft?.mint)}
      >
        <Image
          className="h-full w-full rounded rounded-2xl"
          src={ownedNft?.image}
          style={{ objectFit: 'cover' }}
          width={0}
          height={0}
          unoptimized
          alt="nft-image"
        />
        <div className="mt-5">{ownedNft?.name}</div>
      </button>
    ))
  }

  const renderTotal = () => {
    return (
      <div className="mt-4 flex justify-between">
        <p className="text-2xl">Total</p>
        <div className="flex items-center">
          <Image
            className="h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={16}
            height={16}
            alt=""
          />
          <p className="ml-2 text-2xl">0</p>
        </div>
      </div>
    )
  }

  const renderSelectedNftCount = () => {
    return (
      <div className="flex items-center justify-between">
        <p className="text-2xl">Selected NFT</p>
        <p className="ml-2 text-2xl">{selectedNft ? 1 : 0}</p>
      </div>
    )
  }

  const renderBorrowButton = () => {
    return (
      <button
        type="button"
        className="flex items-center justify-center rounded rounded-xl border-2 border-white bg-gradient-to-b from-[#61D9EB] to-[#63EDD0] px-[2rem] py-[1.5rem] text-[1.25rem] font-bold text-[#15181B]"
      >
        <span>Borrow</span>
        {/* {isSubmitting && (
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
        )} */}
      </button>
    )
  }

  return (
    borrowModalOpen && (
      <motion.div
        initial={{ opacity: 0, scale: 1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="fixed bottom-0 left-0 right-0 top-0 z-[52] flex flex h-full items-center justify-center font-inter md:h-auto"
      >
        <Overlay onClose={onClose} />
        <div className="relative flex flex-col justify-center md:block">
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
            className={`modal duration-400 relative flex flex-col rounded-[1.25rem] transition-colors ease-in-out ${
              isSuccess ? 'bg-[#022628]' : 'bg-[#111111]'
            } px-[2rem] pb-[3rem] pt-[5.8rem] text-white shadow-lg xl:w-[500px]`}
          >
            {renderCloseButton()}
            {renderTitle()}
            {renderOrderBookInfo()}
            <div className="my-8 border border-white opacity-10" />
            <div class="flex w-full flex-wrap">{renderOwnedNfts()}</div>
            <div className="my-8 border border-white opacity-10" />
            {renderSelectedNftCount()}
            {renderTotal()}
            <div className="mt-4 flex w-full justify-center">
              {renderBorrowButton()}
            </div>
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

export default BorrowModal
