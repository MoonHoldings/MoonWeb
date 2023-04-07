import Image from 'next/image'
import { Tooltip } from 'flowbite-react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import toCurrencyFormat from 'utils/toCurrencyFormat'
import { changeLendOfferModalOpen } from 'redux/reducers/utilSlice'
import { setOrderBook } from 'redux/reducers/sharkifyLendSlice'

const OrderBookRow = ({ orderBook, onClickRow }) => {
  const dispatch = useDispatch()
  const { loansByOrderBook } = useSelector((state) => state.sharkify)
  const { publicKey } = useWallet()

  const totalPoolSol =
    loansByOrderBook?.[orderBook.pubKey]?.offeredLoansPool / LAMPORTS_PER_SOL

  const bestOfferSol =
    loansByOrderBook?.[orderBook.pubKey]?.latestOfferedLoans?.[0]
      ?.principalLamports / LAMPORTS_PER_SOL || 0

  const apr = orderBook?.apy?.fixed?.apy / 1000
  const apy = 100 * (Math.exp(apr / 100) - 1)
  const duration = orderBook?.loanTerms?.fixed?.terms?.time?.duration / 86400

  return (
    <tr className="cursor-pointer bg-transparent text-[1.5rem] font-medium hover:bg-[#013C40]">
      <td className="px-6 py-6" onClick={() => onClickRow(orderBook)}>
        {orderBook.collectionName}
      </td>
      <td className="px-6 py-6" onClick={() => onClickRow(orderBook)}>
        <div className="flex items-center">
          {toCurrencyFormat(totalPoolSol)}{' '}
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
          {toCurrencyFormat(bestOfferSol)}
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
        {Math.floor(apy)}%
      </td>
      <td className="px-6 py-6" onClick={() => onClickRow(orderBook)}>
        {Math.floor(duration)}d
      </td>
      <td className="px-6 py-6">
        <Tooltip
          className="rounded-xl px-[1.6rem] py-[1.2rem]"
          content={<span className="text-[1.2rem]">Connect your wallet</span>}
          placement="bottom"
          theme={{
            arrow: {
              base: 'absolute z-10 h-5 w-5 rotate-45 bg-gray-900 dark:bg-gray-700',
            },
          }}
          trigger={publicKey === null ? 'hover' : null}
        >
          <button
            disabled={publicKey === null}
            type="button"
            className="rounded-xl border border-[#61D9EB] from-[#61D9EB] to-[#63EDD0] px-7 py-1 text-[1.3rem] text-[#61D9EB] hover:border-[#f0f6f0] hover:bg-gradient-to-b hover:text-[#15181B]"
            onClick={() => {
              dispatch(
                setOrderBook({
                  ...orderBook,
                  bestOfferSol: toCurrencyFormat(bestOfferSol),
                  apy: `${Math.floor(apy)}%`,
                  duration: `${Math.floor(duration)}d`,
                })
              )
              dispatch(changeLendOfferModalOpen(true))
            }}
          >
            Lend
          </button>
        </Tooltip>
      </td>
    </tr>
  )
}

export default OrderBookRow
