import React from 'react'
import Header from 'components/defi-loans/Header'
import SidebarsLayout from 'components/partials/SidebarsLayout'
import Search from 'components/defi-loans/Search'

const Lend = () => {
  const COLUMNS = [
    'Collection',
    'Total Pool',
    'Best Offer',
    'APY',
    'Duration',
    'Action',
  ]

  return (
    <SidebarsLayout>
      <div className="mt-[2rem] md:order-2">
        <Header
          title="Lend"
          description="Browse collections below, and name your price. The current best offer
          will be shown to borrowers. To take your offer, they lock in an NFT
          from that collection to use as collateral. You will be repaid at the
          end of the loan, plus interest. If they fail to repay, you get to keep
          the NFT."
        />
        <Search />
        <table className="w-full">
          <thead>
            <tr>
              {COLUMNS.map((column, index) => (
                <th
                  key={index}
                  className="bg-[#1F2126] py-6 px-6 text-left text-[1.3rem] font-normal"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="text-[1.4rem] font-medium">
              <td className="py-6 px-6">Moonholders</td>
              <td className="py-6 px-6">207.2k</td>
              <td className="py-6 px-6">0.80</td>
              <td className="py-6 px-6 text-[#11AF22]">200%</td>
              <td className="py-6 px-6">16d</td>
              <td className="py-6 px-6">
                <button
                  type="button"
                  className="rounded-xl border border-[#61D9EB] px-7 py-1 text-[1.3rem] text-[#61D9EB]"
                >
                  Lend
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </SidebarsLayout>
  )
}

export default Lend
