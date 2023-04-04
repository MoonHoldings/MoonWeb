import React, { useEffect } from 'react'
import Image from 'next/image'
import { Spinner } from 'flowbite-react'
import Header from 'components/defi-loans/Header'
import SidebarsLayout from 'components/partials/SidebarsLayout'
import Search from 'components/defi-loans/Search'
import LendOfferModal from 'components/modals/LendOfferModal'
import { useDispatch, useSelector } from 'react-redux'
import { changeLendOfferModalOpen } from 'redux/reducers/utilSlice'
import { fetchNftList, fetchOrderBooks } from 'redux/reducers/sharkifySlice'
import mergeClasses from 'utils/mergeClasses'
import { nextPage, previousPage } from 'redux/reducers/sharkifyLendSlice'
import Pagination from 'components/defi-loans/Pagination'

const Lend = () => {
  const dispatch = useDispatch()

  const { orderBooks, fetchOrderBooksStatus } = useSelector(
    (state) => state.sharkify
  )
  const { pageIndex, pageSize, search } = useSelector(
    (state) => state.sharkifyLend
  )

  const isLoading = fetchOrderBooksStatus === 'loading'

  const COLUMNS = [
    'Collection',
    'Total Pool',
    'Best Offer',
    'APY',
    'Duration',
    'Action',
  ]

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    dispatch(fetchOrderBooks())
  }

  let filteredOrderBooks = orderBooks

  if (search) {
    filteredOrderBooks = filteredOrderBooks?.filter((orderBook) =>
      orderBook?.collectionName?.includes(search)
    )
  }

  const totalItems = filteredOrderBooks?.length

  filteredOrderBooks = filteredOrderBooks?.slice(
    pageIndex,
    pageIndex + pageSize
  )

  return (
    <SidebarsLayout>
      <LendOfferModal />
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
              <Spinner className="h-14 w-14 fill-[#62EAD2]" />
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

                  return (
                    <tr className="text-[1.4rem] font-medium" key={index}>
                      <td className="px-6 py-6">{orderBook.collectionName}</td>
                      <td className="px-6 py-6">207.2k</td>
                      <td className="px-6 py-6">0.80</td>
                      <td className="px-6 py-6 text-[#11AF22]">
                        {Math.floor(apy)}%
                      </td>
                      <td className="px-6 py-6">{duration}d</td>
                      <td className="px-6 py-6">
                        <button
                          disabled
                          type="button"
                          className="rounded-xl border border-[#61D9EB] px-7 py-1 text-[1.3rem] text-[#61D9EB]"
                          onClick={() =>
                            dispatch(changeLendOfferModalOpen(true))
                          }
                        >
                          Lend
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </SidebarsLayout>
  )
}

export default Lend
