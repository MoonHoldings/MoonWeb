import Image from 'next/image'
import { Tooltip } from 'flowbite-react'
import { useDispatch } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'
import toCurrencyFormat from 'utils/toCurrencyFormat'
import {
  changeLendModalOpen,
  changeBorrowModalOpen,
} from 'redux/reducers/utilSlice'
import { setOrderBook } from 'redux/reducers/sharkifyLendSlice'
import TextBlink from 'components/partials/TextBlink'
import { useRouter } from 'next/router'

const OrderBookRow = ({ orderBook, onClickRow }) => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { publicKey } = useWallet()

  const duration = orderBook?.duration / 86400
  const isLendPage = router.pathname.includes('lend')

  const renderActionButton = () => {
    const noWalletConnected = publicKey === null
    const noOwnedNftsInBorrow = !isLendPage && orderBook.ownedNfts === null
    const disabled = noWalletConnected || noOwnedNftsInBorrow

    return (
      <Tooltip
        className="rounded-xl px-[1.6rem] py-[1.2rem]"
        content={
          <span className="text-[1.2rem]">
            {noWalletConnected
              ? 'Connect your wallet'
              : noOwnedNftsInBorrow
              ? 'No NFTs owned from this collection'
              : ''}
          </span>
        }
        placement="auto"
        theme={{
          arrow: {
            base: 'absolute z-10 h-5 w-5 rotate-45 bg-gray-900 dark:bg-gray-700',
          },
        }}
        trigger={disabled ? 'hover' : null}
      >
        <button
          disabled={disabled}
          type="button"
          className="rounded-xl border border-[#61D9EB] from-[#61D9EB] to-[#63EDD0] px-7 py-1 text-[1.3rem] text-[#61D9EB] hover:border-[#f0f6f0] hover:bg-gradient-to-b hover:text-[#15181B]"
          onClick={() => {
            dispatch(setOrderBook({ ...orderBook, duration }))

            if (isLendPage) {
              dispatch(changeLendModalOpen(true))
            } else {
              dispatch(changeBorrowModalOpen(true))
            }
          }}
        >
          {isLendPage ? 'Lend' : 'Borrow'}
        </button>
      </Tooltip>
    )
  }

  return (
    <tr className="cursor-pointer bg-transparent text-[1.5rem] font-medium hover:bg-[#013C40]">
      <td className="px-6 py-6" onClick={() => onClickRow(orderBook)}>
        <div className="flex items-center">
          <div className="flex h-[4rem] w-[4rem] items-center justify-center rounded-full bg-white">
            {orderBook?.collectionImage && (
              <Image
                className="h-full w-full rounded-full"
                src={orderBook?.collectionImage}
                unoptimized
                style={{ objectFit: 'cover' }}
                width={0}
                height={0}
                alt=""
              />
            )}
          </div>
          <div className="ml-8">{orderBook.collectionName}</div>
        </div>
      </td>
      <td className="px-6 py-6" onClick={() => onClickRow(orderBook)}>
        <div className="flex items-center">
          <TextBlink text={toCurrencyFormat(orderBook.totalPool)} />{' '}
          <Image
            className="ml-3 h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={20}
            height={20}
            alt=""
          />
        </div>
      </td>
      <td className="px-6 py-6" onClick={() => onClickRow(orderBook)}>
        <div className="flex items-center">
          <TextBlink text={toCurrencyFormat(orderBook.bestOffer)} />
          <Image
            className="ml-3 h-[1.6rem] w-[1.6rem]"
            src="/images/svgs/sol.svg"
            width={20}
            height={20}
            alt=""
          />
        </div>
      </td>
      <td
        className="px-6 py-6 text-[#11AF22]"
        onClick={() => onClickRow(orderBook)}
      >
        {orderBook.apyAfterFee}%
      </td>
      <td className="px-6 py-6" onClick={() => onClickRow(orderBook)}>
        {Math.floor(duration)}d
      </td>
      <td className="px-6 py-6">{renderActionButton()}</td>
    </tr>
  )
}

export default OrderBookRow
