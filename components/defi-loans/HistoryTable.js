import React, { useEffect, useState } from 'react'
import mergeClasses from 'utils/mergeClasses'
import Pagination from './Pagination'
import { useRouter } from 'next/router'
import { LOAN_SUMMARY } from 'utils/queries'
import { useWallet } from '@solana/wallet-adapter-react'
import HistoryRow from './HistoryRow'
import { useLazyQuery } from '@apollo/client'

const HistoryTable = ({ onClickRow, loading }) => {
  const { publicKey } = useWallet()
  const [paginationIndex, setPaginationIndex] = useState(-1)
  const [paginationTokens, setPaginationTokens] = useState([])
  const router = useRouter()

  const [getLoanSummary, { data: loanSummary, loading: loadingLoanSummary }] =
    useLazyQuery(LOAN_SUMMARY)

  const isLendPage = router.pathname.includes('lend')

  useEffect(() => {
    if (publicKey && !loadingLoanSummary) {
      const wallet = publicKey?.toBase58()

      if (isLendPage) {
        getLoanSummary({
          variables: {
            lender: wallet,
            paginationToken: paginationTokens[paginationIndex],
          },
        })
      } else {
        getLoanSummary({
          variables: {
            borrower: wallet,
            paginationToken: paginationTokens[paginationIndex],
          },
        })
      }
    }
  }, [
    loadingLoanSummary,
    publicKey,
    isLendPage,
    getLoanSummary,
    paginationTokens,
    paginationIndex,
  ])

  useEffect(() => {
    const token = loanSummary?.getLoanSummary?.paginationToken

    if (token && !paginationTokens.includes(token)) {
      setPaginationTokens((prevTokens) => [...prevTokens, token])
    }
  }, [loanSummary, paginationTokens])

  const totalItems = 0
  const COLUMNS = ['Collection', 'Offer', 'Interest', 'APY', 'Status']

  const renderColumns = () => {
    return COLUMNS.map((column, index) => (
      <th
        key={index}
        className="bg-[#1F2126] px-6 py-6 text-left text-[1.3rem] font-normal"
      >
        {column !== 'Action' ? (
          <button
            className="flex items-center"
            // onClick={() => dispatch(setSortOption(column))}
          >
            {column}
            {/* <Image
              className={mergeClasses(
                'ml-4',
                sortOrder === SortOrder.DESC &&
                  sortOption === column &&
                  'rotate-180 transform'
              )}
              src={`/images/svgs/table-sort-arrow${
                sortOption === column ? '-active' : ''
              }.svg`}
              alt=""
              width="10"
              height="10"
            /> */}
          </button>
        ) : (
          'Action'
        )}
      </th>
    ))
  }

  return (
    <>
      <div className="my-8 flex w-full items-center justify-end">
        <Pagination
          totalItems={totalItems}
          disabled={loadingLoanSummary}
          onNext={() => {
            if (paginationIndex + 1 < paginationTokens.length) {
              setPaginationIndex((index) => index + 1)
            }
          }}
          onPrevious={() => {
            if (paginationIndex > -1) {
              setPaginationIndex((index) => index - 1)
            }
          }}
          previousDisabled={paginationIndex === -1}
          nextDisabled={paginationIndex === paginationTokens.length - 1}
        />
      </div>
      <div className={mergeClasses(!loadingLoanSummary && 'overflow-x-auto')}>
        {loadingLoanSummary ? (
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
              <tr>{renderColumns()}</tr>
            </thead>
            <tbody>
              {loanSummary?.getLoanSummary?.data?.map((data, index) => (
                <HistoryRow history={data} key={index} />
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="my-8 flex w-full items-center justify-end">
        <Pagination totalItems={totalItems} disabled={loading} />
      </div>
    </>
  )
}

export default HistoryTable
