import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { useWallet } from '@solana/wallet-adapter-react'
import { changeBorrowModalOpen } from 'redux/reducers/utilSlice'
import Link from 'next/link'
import Image from 'next/image'
import { Alert } from 'flowbite-react'
import mergeClasses from 'utils/mergeClasses'
import toCurrencyFormat from 'utils/toCurrencyFormat'

const BorrowModal = () => {
  const dispatch = useDispatch()

  const { publicKey } = useWallet()
  const wallet = useWallet()

  const { borrowModalOpen } = useSelector((state) => state.util)
  const { orderBook } = useSelector((state) => state.sharkifyLend)

  const isSuccess = false
  const floorPriceSol = orderBook?.floorPriceSol
    ? orderBook?.floorPriceSol
    : null

  const onClose = () => {
    dispatch(changeBorrowModalOpen(false))
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
          'w-full',
          'sm:w-1/3',
          'justify-center',
          'items-center',
          'rounded rounded-2xl',
          'border',
          'border-black',
          'text-[1.3rem]',
          'font-bold',
          'hover:border-[#62E3DD]',
          'transition duration-200 ease-in-out',
          'bg-[#191C20]',
          'p-3',
          index > 0 && 'ml-6'
        )}
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
            } px-[2rem] pb-[1.5rem] pt-[5.8rem] text-white shadow-lg xl:w-[500px]`}
          >
            {renderCloseButton()}
            {renderTitle()}
            {renderOrderBookInfo()}
            <div className="my-8 border border-white opacity-10" />
            <div class="flex w-full flex-wrap">{renderOwnedNfts()}</div>
            {/* <div className="flex w-full flex-col justify-between xl:flex-row">
              {renderOfferAmountInput()}
              {renderInterest()}
            </div>
            {isOfferGreaterThanFloorPrice && (
              <Alert color="failure" className="my-5" withBorderAccent={true}>
                <span className="text-[1.4rem] font-medium">
                  This offer amount is more than the current floor price!
                </span>
              </Alert>
            )}
            {renderQuantityOptions()}
            <div className="my-8 border border-white opacity-10" />
            {renderTotal()}
            {renderBalance()}
            <div className="mt-4 flex w-full justify-center">
              {renderPlaceOfferButton()}
            </div>
            txLink && (
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
            </p> */}
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
