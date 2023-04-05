import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Spinner, Tooltip } from 'flowbite-react'
import Header from 'components/defi-loans/Header'
import SidebarsLayout from 'components/partials/SidebarsLayout'
import Search from 'components/defi-loans/Search'
import LendOfferModal from 'components/modals/LendOfferModal'
import { useDispatch, useSelector } from 'react-redux'
import {
  changeLendOfferModalOpen,
  changeLoanDetailsModalOpen,
} from 'redux/reducers/utilSlice'
import {
  fetchLoans,
  fetchOrderBooks,
  setOrderBooks,
} from 'redux/reducers/sharkifySlice'
import mergeClasses from 'utils/mergeClasses'
import Pagination from 'components/defi-loans/Pagination'
import { useWallet } from '@solana/wallet-adapter-react'
import createAnchorProvider from 'utils/createAnchorProvider'
import { createSharkyClient } from '@sharkyfi/client'
import collectionNames from 'utils/collectionNames.json'
import { setLoanDetails } from 'redux/reducers/sharkifyLendSlice'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

import toCurrencyFormat from 'utils/toCurrencyFormat'
import LoanDetailsModal from 'components/modals/LoanDetailsModal'

const Lend = ({ orderBooks }) => {
  const dispatch = useDispatch()

  const {
    orderBooks: orderBooksLocal,
    loansByOrderBook,
    fetchOrderBooksStatus,
    fetchLoansStatus,
  } = useSelector((state) => state.sharkify)
  const { pageIndex, pageSize, search } = useSelector(
    (state) => state.sharkifyLend
  )
  const { publicKey } = useWallet()

  const isLoading =
    fetchOrderBooksStatus === 'loading' || fetchLoansStatus === 'loading'

  const COLUMNS = [
    'Collection',
    'Total Pool',
    'Best Offer',
    'APY',
    'Duration',
    'Action',
  ]

  useEffect(() => {
    dispatch(setOrderBooks(orderBooks))
  }, [orderBooks, dispatch])

  useEffect(() => {
    if (orderBooksLocal) {
      dispatch(fetchLoans())
    }
  }, [orderBooksLocal, dispatch])

  let filteredOrderBooks = orderBooksLocal

  if (search) {
    filteredOrderBooks = filteredOrderBooks?.filter((orderBook) =>
      orderBook?.collectionName?.toLowerCase().includes(search.toLowerCase())
    )
  }

  const totalItems = filteredOrderBooks?.length

  filteredOrderBooks = filteredOrderBooks?.slice(
    pageIndex,
    pageIndex + pageSize
  )

  const onClickRow = (orderBook) => {
    dispatch(
      setLoanDetails({
        collectionName: orderBook.collectionName,
        loan: loansByOrderBook[orderBook.pubKey],
      })
    )

    dispatch(changeLoanDetailsModalOpen(true))
  }

  return (
    <SidebarsLayout>
      <LendOfferModal />
      <LoanDetailsModal />

      <div className="pb-[4rem] pt-[2rem] md:order-2">
        <Header
          title="Lend"
          description="Browse collections below, and name your price. The current best offer
          will be shown to borrowers. To take your offer, they lock in an NFT
          from that collection to use as collateral. You will be repaid at the
          end of the loan, plus interest. If they fail to repay, you get to keep
          the NFT."
        />
        <Search />
        <div className="my-8 flex w-full items-center justify-end">
          <Pagination totalItems={totalItems} />
        </div>
        <div className={mergeClasses(!isLoading && 'overflow-x-auto')}>
          {isLoading ? (
            <div className="mt-12 flex w-full justify-center">
              <svg
                aria-hidden="true"
                className="mr-2 h-14 w-14 animate-spin fill-teal-400 text-gray-200 dark:text-gray-600"
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
            </div>
          ) : (
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {COLUMNS.map((column, index) => (
                    <th
                      key={index}
                      className="bg-[#1F2126] px-6 py-6 text-left text-[1.3rem] font-normal"
                    >
                      <button className="flex items-center">
                        {column}
                        <Image
                          // className="rotate-180 transform"
                          className={mergeClasses('ml-4')}
                          src="/images/svgs/table-sort-arrow.svg"
                          alt=""
                          width="10"
                          height="10"
                        />
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrderBooks?.map((orderBook, index) => {
                  const apr = orderBook?.apy?.fixed?.apy / 1000
                  const apy = 100 * (Math.exp(apr / 100) - 1)

                  const duration =
                    orderBook?.loanTerms?.fixed?.terms?.time?.duration / 86400

                  let loan
                  let totalPoolSol
                  let bestOfferSol

                  if (loansByOrderBook) {
                    loan = loansByOrderBook[orderBook.pubKey]
                    totalPoolSol = loan?.offeredLoansPool / LAMPORTS_PER_SOL
                    bestOfferSol =
                      loan?.latestOfferedLoans[0]?.principalLamports /
                        LAMPORTS_PER_SOL || 0
                  }

                  return (
                    <tr
                      className="cursor-pointer bg-transparent text-[1.5rem] font-medium hover:bg-[#013C40]"
                      key={index}
                    >
                      <td
                        className="px-6 py-6"
                        onClick={() => onClickRow(orderBook)}
                      >
                        {orderBook.collectionName}
                      </td>
                      <td
                        className="px-6 py-6"
                        onClick={() => onClickRow(orderBook)}
                      >
                        {toCurrencyFormat(totalPoolSol)}
                      </td>
                      <td
                        className="px-6 py-6"
                        onClick={() => onClickRow(orderBook)}
                      >
                        {toCurrencyFormat(bestOfferSol)}
                      </td>
                      <td
                        className="px-6 py-6 text-[#11AF22]"
                        onClick={() => onClickRow(orderBook)}
                      >
                        {Math.floor(apy)}%
                      </td>
                      <td
                        className="px-6 py-6"
                        onClick={() => onClickRow(orderBook)}
                      >
                        {Math.floor(duration)}d
                      </td>
                      <td className="px-6 py-6">
                        <Tooltip
                          className="rounded-xl px-[1.6rem] py-[1.2rem]"
                          content={
                            <span className="text-[1.2rem]">
                              Connect your wallet
                            </span>
                          }
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
                              dispatch(changeLendOfferModalOpen(true))
                            }}
                          >
                            Lend
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        <div className="my-8 flex w-full items-center justify-end">
          <Pagination totalItems={totalItems} />
        </div>
      </div>
    </SidebarsLayout>
  )
}

export async function getServerSideProps() {
  const provider = createAnchorProvider()
  const sharkyClient = createSharkyClient(provider)
  const { program } = sharkyClient

  let orderBooks = (await sharkyClient.fetchAllOrderBooks({ program })).map(
    ({ feeAuthority, pubKey, orderBookType, loanTerms, apy }) => ({
      apy,
      pubKey: pubKey.toBase58(),
      orderBookType: {
        ...orderBookType,
        nftList: {
          ...orderBookType.nftList,
          listAccount: orderBookType.nftList.listAccount.toBase58(),
        },
      },
      loanTerms: {
        ...loanTerms,
        fixed: {
          ...loanTerms.fixed,
          terms: {
            ...loanTerms.fixed.terms,
            time: {
              ...loanTerms.fixed.terms.time,
              duration: loanTerms.fixed.terms.time.duration.toNumber(),
            },
          },
        },
      },
      feeAuthority: feeAuthority.toBase58(),
    })
  )

  // orderBooks = orderBooks.filter((orderBook) =>
  //   enabledOrderBooks.includes(orderBook.pubKey)
  // )

  const nftListPubKeyToNameMap = collectionNames

  orderBooks = orderBooks
    .map((orderBook) => ({
      ...orderBook,
      collectionName:
        nftListPubKeyToNameMap[orderBook.orderBookType.nftList.listAccount]
          ?.collectionName || null,
      nftMint:
        nftListPubKeyToNameMap[orderBook.orderBookType.nftList.listAccount]
          ?.nftMint || null,
    }))
    .sort((a, b) => (a.collectionName < b.collectionName ? -1 : 1))

  return {
    props: {
      orderBooks: orderBooks.filter((orderBook) => orderBook.collectionName),
    },
  }
}

export default Lend
