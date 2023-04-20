import Image from 'next/image'
import { Tooltip } from 'antd'
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
        color="#1F2126"
        title={
          <span className="text-[1.35rem]">
            {noWalletConnected
              ? 'Connect your wallet'
              : noOwnedNftsInBorrow
              ? 'No NFTs owned from this collection'
              : ''}
          </span>
        }
        trigger={disabled ? 'hover' : null}
      >
        <button
          disabled={disabled}
          type="button"
          className="rounded-xl border border-[#61D9EB] from-[#61D9EB] to-[#63EDD0] px-7 py-1 text-[1.3rem] text-[#61D9EB] hover:border-[#f0f6f0] hover:bg-gradient-to-b hover:text-[#15181B]"
          onClick={() => {
            dispatch(
              setOrderBook({
                ...orderBook,
                duration,
                durationSeconds: orderBook?.duration,
              })
            )

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
        <div className="flex items-center">
          {isLendPage
            ? orderBook?.apyAfterFee + '%'
            : orderBook?.interest < 0.01
            ? orderBook?.interest?.toFixed(3)
            : orderBook?.interest?.toFixed(2)}
          {!isLendPage && !orderBook?.interest && (
            <svg
              aria-hidden="true"
              className="ml-2 mr-2 h-7 w-7 animate-spin fill-black"
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
        {Math.floor(duration)}d
      </td>
      <td className="px-6 py-6">{renderActionButton()}</td>
    </tr>
  )
}

export default OrderBookRow
