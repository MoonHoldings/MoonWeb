import HistoryTable from 'components/defi-loans/HistoryTable'
import { Spin, notification } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { CSVLink } from 'react-csv'
import { useLazyQuery } from '@apollo/client'
import mergeClasses from 'utils/mergeClasses'
import { GET_BORROW_HISTORY_CSV } from 'utils/queries'
import { useWallet } from '@solana/wallet-adapter-react'

const History = () => {
  const router = useRouter()
  const isLendPage = router.pathname.includes('lend')
  const { publicKey } = useWallet()
  const [getBorrowHistoryCsv, { loading }] = useLazyQuery(
    GET_BORROW_HISTORY_CSV
  )
  const [csvData, setCsvData] = useState([])
  const csvLinkRef = useRef()

  const getCsvData = async () => {
    setCsvData([])

    const { data } = await getBorrowHistoryCsv({
      variables: { address: publicKey.toBase58() },
    })

    if (!data?.getBorrowHistoryCsv?.length) {
      notification.open({
        closeIcon: (
          <svg
            className="ml-2"
            viewBox="64 64 896 896"
            focusable="false"
            data-icon="close"
            width="0.9em"
            height="0.9em"
            fill="#ffffff"
            aria-hidden="true"
          >
            <path d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 00203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"></path>
          </svg>
        ),
        type: 'error',
        className: 'bg-[#191C20] text-white',
        description: `There is currently no available data to be downloaded`,
        duration: 2,
        placement: 'top',
        message: <p className="text-white">No Data</p>,
      })

      return null
    } else {
      setCsvData(
        data?.getBorrowHistoryCsv?.map((loan) => ({
          collectionName: loan.collectionName,
          collateralName: loan.collateralName,
          amountOffered: loan.amountOffered,
          offerInterest: loan.offerInterest,
          borrowInterest: loan.borrowInterest,
          apy: loan.apy,
          status: loan.status,
        }))
      )
    }
  }

  useEffect(() => {
    if (csvData?.length) {
      csvLinkRef.current.link.click()
    }
  }, [csvData])

  return (
    <div className="pb-[4rem] pt-[2rem] md:order-2">
      <div className="flex justify-between">
        <h1 className="text-[3rem]">
          <Link
            href={`/defi-loans/${isLendPage ? 'lend' : 'borrow'}`}
            className="text-[#ffffff4d] underline"
          >
            {isLendPage ? 'Lend' : 'Borrow'}
          </Link>
          <span className="mx-3">&gt;</span>
          History
        </h1>

        <button
          className={mergeClasses(
            'inline-flex',
            'items-center',
            'justify-center',
            'rounded-xl',
            'border',
            'border-transparent',
            'py-3.5',
            'px-5',
            'md:text-[1.4rem]',
            'text-[1.2rem]',
            'text-white',
            'focus:outline-none',
            'bg-[#25282C]',
            'mr-6'
          )}
          onClick={getCsvData}
        >
          Download CSV {loading && <Spin className="ml-3" />}
        </button>
        <CSVLink
          className="hidden"
          data={csvData}
          filename="MoonHoldings-sharkyfi-history.csv"
          ref={csvLinkRef}
          target="_blank"
        />
      </div>

      <HistoryTable />
    </div>
  )
}
export default History
