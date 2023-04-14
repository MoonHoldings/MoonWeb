import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from 'components/defi-loans/Header'
import SidebarsLayout from 'components/partials/SidebarsLayout'
import Search from 'components/defi-loans/Search'
import LendOfferModal from 'components/modals/LendOfferModal'
import { changeLoanDetailsModalOpen } from 'redux/reducers/utilSlice'
import { setOrderBooks } from 'redux/reducers/sharkifySlice'
import {
  SHARKY_PAGE_SIZE,
  setLoanDetails,
} from 'redux/reducers/sharkifyLendSlice'
import LoanDetailsModal from 'components/modals/LoanDetailsModal'
import RevokeOfferModal from 'components/modals/RevokeOfferModal'
import OrderBookTable from 'components/defi-loans/OrderBookTable'
import { GET_ORDER_BOOKS } from 'utils/queries'
import { useLazyQuery } from '@apollo/client'

const Lend = () => {
  const dispatch = useDispatch()

  const { pageIndex, search, sortOption, sortOrder } = useSelector(
    (state) => state.sharkifyLend
  )
  const [getOrderBooks, { loading, data }] = useLazyQuery(GET_ORDER_BOOKS)

  useEffect(() => {
    getOrderBooks({
      variables: {
        args: {
          filter: {
            search,
          },
          pagination: {
            limit: SHARKY_PAGE_SIZE,
            offset: pageIndex,
          },
          sort: {
            order: sortOrder,
            type: sortOption,
          },
        },
      },
      pollInterval: 1000,
    })
  }, [pageIndex, sortOrder, sortOption, search, getOrderBooks])

  useEffect(() => {
    if (data) {
      const { getOrderBooks: orderBooksData } = data

      dispatch(
        setOrderBooks({
          orderBooks: orderBooksData.data,
          total: orderBooksData.count,
        })
      )
    }
  }, [data, dispatch])

  const onClickRow = (orderBook) => {
    dispatch(setLoanDetails(orderBook.id))
    dispatch(changeLoanDetailsModalOpen(true))
  }

  return (
    <SidebarsLayout>
      <LendOfferModal />
      <RevokeOfferModal />
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
        <Search initialValue={search} />
        <OrderBookTable onClickRow={onClickRow} loading={loading} />
      </div>
    </SidebarsLayout>
  )
}

export default Lend
