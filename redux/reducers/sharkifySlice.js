import { createSharkyClient, enabledOrderBooks } from '@sharkyfi/client'
import createAnchorProvider from 'utils/createAnchorProvider'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  orderBooks: null,
  nftList: null,
  fetchOrderBooksStatus: 'idle',
  fetchNftListStatus: 'idle',
}

const sharkifySlice = createSlice({
  name: 'sharkify',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchOrderBooks.pending, (state, _) => {
        state.fetchOrderBooksStatus = 'loading'
      })
      .addCase(fetchOrderBooks.fulfilled, (state, action) => {
        state.fetchOrderBooksStatus = 'successful'
        state.orderBooks = action.payload
      })
      .addCase(fetchNftList.pending, (state, _) => {
        state.fetchNftListStatus = 'loading'
      })
      .addCase(fetchNftList.fulfilled, (state, action) => {
        state.fetchNftListStatus = 'successful'
        state.nftList = action.payload
      })
  },
})

export const fetchNftList = createAsyncThunk(
  'sharkify/fetchNftList',
  async () => {
    const provider = createAnchorProvider()
    const sharkyClient = createSharkyClient(provider)
    const { program } = sharkyClient

    const collectionNames = await sharkyClient.fetchAllNftLists({ program })
    const nftListPubKeyToNameMap = {}

    collectionNames.forEach((collection) => {
      nftListPubKeyToNameMap[collection.pubKey.toBase58()] = {
        collectionName: collection.collectionName,
        nftMint: collection?.mints[0].toBase58(),
      }
    })

    return nftListPubKeyToNameMap
  }
)

export const fetchOrderBooks = createAsyncThunk(
  'sharkify/fetchOrderBooks',
  async (_, { getState, dispatch }) => {
    const sharkifyState = getState().sharkify
    const currentOrderBooks = sharkifyState.orderBooks

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

    orderBooks = orderBooks.filter((orderBook) =>
      enabledOrderBooks.includes(orderBook.pubKey)
    )

    // Refetch nftList only if order books length changed
    if (orderBooks.length !== currentOrderBooks?.length) {
      await dispatch(fetchNftList())
    }

    const nftListPubKeyToNameMap = sharkifyState.nftList

    orderBooks = orderBooks
      .map((orderBook) => ({
        ...orderBook,
        collectionName:
          nftListPubKeyToNameMap[orderBook.orderBookType.nftList.listAccount]
            ?.collectionName,
        nftMint:
          nftListPubKeyToNameMap[orderBook.orderBookType.nftList.listAccount]
            ?.nftMint,
      }))
      .sort((a, b) => (a.collectionName < b.collectionName ? -1 : 1))

    // Fetch nft meta data
    // Fetch collection meta data
    // Fetch image uri
    // Map to each collection

    return orderBooks
  }
)

export const { changeSolUsdPrice } = sharkifySlice.actions

export default sharkifySlice.reducer
