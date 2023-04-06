import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Header from 'components/defi-loans/Header'
import SidebarsLayout from 'components/partials/SidebarsLayout'
import Search from 'components/defi-loans/Search'
import LendOfferModal from 'components/modals/LendOfferModal'
import { changeLoanDetailsModalOpen } from 'redux/reducers/utilSlice'
import { fetchLoans, setOrderBooks } from 'redux/reducers/sharkifySlice'

import createAnchorProvider from 'utils/createAnchorProvider'
import { createSharkyClient } from '@sharkyfi/client'
import collectionNames from 'utils/collectionNames.json'
import { setLoanDetails } from 'redux/reducers/sharkifyLendSlice'
import LoanDetailsModal from 'components/modals/LoanDetailsModal'
import OrderBookTable from 'components/defi-loans/OrderBookTable'

import {
  dataStreamFilters,
  SharkyEventStream,
  StreamClient,
} from '@hellomoon/api'
import { HELLO_MOON_KEY } from 'app/constants/api'

const Lend = ({ orderBooks }) => {
  const dispatch = useDispatch()

  const { orderBooks: orderBooksLocal, loansByOrderBook } = useSelector(
    (state) => state.sharkify
  )

  useEffect(() => {
    dispatch(setOrderBooks(orderBooks))

    // const stream = new SharkyEventStream({
    //   target: {
    //     targetType: 'WEBSOCKET',
    //   },
    //   filters: {
    //     eventType: dataStreamFilters.enum.equals('OfferLoan'),
    //   },
    // })

    // const client = new StreamClient(HELLO_MOON_KEY)
    // client
    //   .subscribe(stream.subscriptionId, (data) => {
    //     // An array of data dependent on what you are subscribed to
    //     console.log(data)
    //   })
    //   .then((disconnect) => {
    //     // Disconnect after 10 seconds, setTimeout is optional.
    //     setTimeout(disconnect, 10000)
    //   })
    //   .catch(console.error)
  }, [orderBooks, dispatch])

  useEffect(() => {
    if (orderBooksLocal) {
      dispatch(fetchLoans())
    }
  }, [orderBooksLocal, dispatch])

  const onClickRow = (orderBook) => {
    dispatch(
      setLoanDetails({
        collectionName: orderBook.collectionName,
        loan: loansByOrderBook[orderBook.pubKey],
      })
    )

    dispatch(changeLoanDetailsModalOpen(true))
  }

  return (
    <SidebarsLayout>
      <LendOfferModal />
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
        <Search />
        <OrderBookTable onClickRow={onClickRow} />
      </div>
    </SidebarsLayout>
  )
}

export async function getServerSideProps() {
  const provider = createAnchorProvider()
  const sharkyClient = createSharkyClient(provider)
  const { program } = sharkyClient

  let orderBooks = (await sharkyClient.fetchAllOrderBooks({ program })).map(
    ({ feeAuthority, pubKey, orderBookType, loanTerms, apy }) => ({
      apy,
      pubKey: pubKey.toBase58(),
      orderBookType: {
        ...orderBookType,
        nftList: {
          ...orderBookType.nftList,
          listAccount: orderBookType.nftList.listAccount.toBase58(),
        },
      },
      loanTerms: {
        ...loanTerms,
        fixed: {
          ...loanTerms.fixed,
          terms: {
            ...loanTerms.fixed.terms,
            time: {
              ...loanTerms.fixed.terms.time,
              duration: loanTerms.fixed.terms.time.duration.toNumber(),
            },
          },
        },
      },
      feeAuthority: feeAuthority.toBase58(),
    })
  )

  // orderBooks = orderBooks.filter((orderBook) =>
  //   enabledOrderBooks.includes(orderBook.pubKey)
  // )

  const nftListPubKeyToNameMap = collectionNames

  orderBooks = orderBooks
    .map((orderBook) => ({
      ...orderBook,
      collectionName:
        nftListPubKeyToNameMap[orderBook.orderBookType.nftList.listAccount]
          ?.collectionName || null,
      nftMint:
        nftListPubKeyToNameMap[orderBook.orderBookType.nftList.listAccount]
          ?.nftMint || null,
    }))
    .sort((a, b) => (a.collectionName < b.collectionName ? -1 : 1))

  return {
    props: {
      orderBooks: orderBooks.filter((orderBook) => orderBook.collectionName),
    },
  }
}

export default Lend
