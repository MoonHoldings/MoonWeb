import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Header from 'components/defi-loans/Header'
import Search from 'components/defi-loans/Search'
import { changeLoanDetailsModalOpen } from 'redux/reducers/utilSlice'
import { setOrderBooks } from 'redux/reducers/sharkifySlice'
import {
  SHARKY_PAGE_SIZE,
  setLoanDetails,
  search,
} from 'redux/reducers/sharkifyLendSlice'
import OrderBookTable from 'components/defi-loans/OrderBookTable'
import { GET_ORDER_BOOKS } from 'utils/queries'
import { useLazyQuery } from '@apollo/client'
import { useWallet } from '@solana/wallet-adapter-react'

const Borrow = () => {
  const dispatch = useDispatch()

  const {
    pageIndex,
    search: searchString,
    sortOption,
    sortOrder,
  } = useSelector((state) => state.sharkifyLend)
  const { publicKey } = useWallet()
  const [getOrderBooks, { loading, data }] = useLazyQuery(GET_ORDER_BOOKS)

  useEffect(() => {
    dispatch(search(''))
  }, [dispatch])

  useEffect(() => {
    getOrderBooks({
      variables: {
        args: {
          filter: {
            search: searchString,
          },
          pagination: {
            limit: SHARKY_PAGE_SIZE,
            offset: pageIndex,
          },
          sort: {
            order: sortOrder,
            type: sortOption,
          },
          borrowWalletAddress: publicKey?.toBase58(),
          isBorrowPage: true,
        },
      },
    })
  }, [pageIndex, sortOrder, sortOption, searchString, getOrderBooks, publicKey])

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
    <div className="pb-[4rem] pt-[2rem] md:order-2">
      <Header
        title="Borrow"
        description="Instantly take a loan against your NFTs. Escrow-free loans allows you to keep the collateral NFT in your wallet. When you accept a loan offer, a secure contract is created, freezing the NFT in-wallet. Not repaying by the due date means the lender can repossess your NFT. Successfully pay the loan in full by the expiration date to automatically thaw the NFT."
      />
      <Search onChange={(text) => dispatch(search(text))} />
      <OrderBookTable onClickRow={onClickRow} loading={loading} />
    </div>
  )
}

export default Borrow
