import HistoryTable from 'components/defi-loans/HistoryTable'
import Search from 'components/defi-loans/Search'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const History = () => {
  const router = useRouter()
  const isLendPage = router.pathname.includes('lend')

  return (
    <div className="pb-[4rem] pt-[2rem] md:order-2">
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
      {/* <Search /> */}
      <HistoryTable />
    </div>
  )
}
export default History
