import HistoryTable from 'components/defi-loans/HistoryTable'
import Search from 'components/defi-loans/Search'
import Link from 'next/link'
import React from 'react'

const History = () => {
  return (
    <div className="pb-[4rem] pt-[2rem] md:order-2">
      <h1 className="text-[3rem]">
        <Link href="/defi-loans/lend" className="hover:underline">
          Lend
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
