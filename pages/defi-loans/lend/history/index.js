import HistoryTable from 'components/defi-loans/HistoryTable'
import { Spin } from 'antd'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { CSVLink } from 'react-csv'
import { useLazyQuery } from '@apollo/client'
import mergeClasses from 'utils/mergeClasses'
import { GET_LEND_HISTORY_CSV } from 'utils/queries'
import { useWallet } from '@solana/wallet-adapter-react'
import { displayNotifModal } from 'utils/notificationModal'

const History = () => {
  const router = useRouter()
  const isLendPage = router.pathname.includes('lend')
  const { publicKey } = useWallet()
  const [getLendHistoryCsv, { loading }] = useLazyQuery(GET_LEND_HISTORY_CSV)
  const [csvData, setCsvData] = useState([])
  const csvLinkRef = useRef()

  const getCsvData = async () => {
    setCsvData([])

    const { data } = await getLendHistoryCsv({
      variables: { address: publicKey.toBase58() },
    })

    if (!data?.getLendHistoryCsv?.length) {
      displayNotifModal(
        'error',
        'There is currently no available data to be downloaded.',
        'No Data'
      )

      return null
    } else {
      setCsvData(
        data?.getLendHistoryCsv?.map((loan) => ({
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
