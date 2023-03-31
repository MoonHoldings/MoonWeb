import React from 'react'
import Header from 'components/defi-loans/Header'
import SidebarsLayout from 'components/partials/SidebarsLayout'
import Search from 'components/defi-loans/Search'
import LendOfferModal from 'components/modals/LendOfferModal'
import { useDispatch } from 'react-redux'
import { changeLendOfferModalOpen } from 'redux/reducers/utilSlice'

const Lend = () => {
  const dispatch = useDispatch()

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
      <LendOfferModal />
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
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                {COLUMNS.map((column, index) => (
                  <th
                    key={index}
                    className="bg-[#1F2126] px-6 py-6 text-left text-[1.3rem] font-normal"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="text-[1.4rem] font-medium">
                <td className="px-6 py-6">Moonholders</td>
                <td className="px-6 py-6">207.2k</td>
                <td className="px-6 py-6">0.80</td>
                <td className="px-6 py-6 text-[#11AF22]">200%</td>
                <td className="px-6 py-6">16d</td>
                <td className="px-6 py-6">
                  <button
                    type="button"
                    className="rounded-xl border border-[#61D9EB] px-7 py-1 text-[1.3rem] text-[#61D9EB]"
                    onClick={() => dispatch(changeLendOfferModalOpen(true))}
                  >
                    Lend
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SidebarsLayout>
  )
}

export default Lend
