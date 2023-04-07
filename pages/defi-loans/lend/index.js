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
  StreamClient,
  SharkyEventStream,
  CreateStreamsRequest,
  RestClient,
} from '@hellomoon/api'
import { HELLO_MOON_KEY } from 'app/constants/api'

const Lend = ({ orderBooks }) => {
  const dispatch = useDispatch()

  const { orderBooks: orderBooksLocal, loansByOrderBook } = useSelector(
    (state) => state.sharkify
  )

  useEffect(() => {
    dispatch(setOrderBooks(orderBooks))

    // const sharkyStream = new SharkyEventStream({
    //   target: {
    //     targetType: 'WEBSOCKET',
    //   },
    //   filters: {},
    // })

    // const streamClient = new StreamClient(HELLO_MOON_KEY)

    // streamClient
    //   .connect((data) => {
    //     // A fallback message catcher.  This shouldn't fire, but can be used for system messages come through
    //     console.log(data)
    //   })
    //   .then(
    //     (disconnect) => {
    //       const unsubscribe = streamClient.subscribe(
    //         'c9a29fc2-50cf-40bf-a199-fe4571dfcd19',
    //         (data) => {
    //           // An array of streamed events
    //           console.log(data)
    //         }
    //       )
    //     },
    //     (err) => {
    //       // Handle error
    //       console.log(err)
    //     }
    //   )
    //   .catch(console.error)
    // const websocket = require('websocket')
    // var WebSocketClient = require('websocket').w3cwebsocket
    // const client = new WebSocketClient('wss://kiki-stream.hellomoon.io')

    // client.onopen = function () {
    //   console.log('WebSocket Client Connected')
    // }

    // client.onmessage = function (message) {
    //   console.log(message)
    // }

    // client.on('connect', (connection) => {
    //   connection.on('message', (message) => {
    //     if (!message || message.type !== 'utf8') return
    //     const data = JSON.parse(message.utf8Data)
    //     if (data === 'You have successfully subscribed') {
    //       console.log('You have successfully subscribed')
    //     }

    //     // do logic under here
    //   })

    //   connection.sendUTF(
    //     JSON.stringify({
    //       action: 'subscribe',
    //       apiKey: HELLO_MOON_KEY,
    //       subscriptionId: '',
    //     })
    //   )
    // })

    // client.connect('wss://kiki-stream.hellomoon.io')
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
