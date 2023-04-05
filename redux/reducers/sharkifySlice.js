import { createSharkyClient, enabledOrderBooks } from '@sharkyfi/client'
import { AXIOS_CONFIG_HELLO_MOON_KEY, HELLO_MOON_URL } from 'app/constants/api'
import createAnchorProvider from 'utils/createAnchorProvider'
import collectionNames from 'utils/collectionNames.json'
import axios from 'axios'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  orderBooks: null,
  loansByOrderBook: null,
  nftList: null,
  fetchOrderBooksStatus: 'idle',
  fetchLoansStatus: 'idle',
  fetchNftListStatus: 'idle',
}

const sharkifySlice = createSlice({
  name: 'sharkify',
  initialState,
  reducers: {
    setOrderBooks(state, action) {
      state.orderBooks = action.payload
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchOrderBooks.pending, (state, _) => {
        state.fetchOrderBooksStatus = 'loading'
      })
      .addCase(fetchOrderBooks.fulfilled, (state, action) => {
        state.fetchOrderBooksStatus = 'successful'
        state.orderBooks = action.payload
      })
      .addCase(fetchLoans.pending, (state, _) => {
        state.fetchLoansStatus = 'loading'
      })
      .addCase(fetchLoans.fulfilled, (state, action) => {
        state.fetchLoansStatus = 'successful'
        state.loansByOrderBook = action.payload
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

export const fetchLoans = createAsyncThunk('sharkify/fetchLoans', async () => {
  const provider = createAnchorProvider()
  const sharkyClient = createSharkyClient(provider)
  const { program } = sharkyClient

  const loans = await sharkyClient.fetchAllLoans({ program })

  const loansByOrderBook = loans.reduce((accumulator, loan) => {
    const orderBookKey = loan.data.orderBook.toBase58()

    const parsedLoan = {
      principalLamports: loan.data.principalLamports.toNumber(),
      orderBook: loan.data.orderBook.toBase58(),
      valueTokenMint: loan.data.valueTokenMint.toBase58(),
      offerTime: loan?.data?.loanState?.offer?.offer?.offerTime?.toNumber(),
      takenTime:
        loan?.data?.loanState?.taken?.taken?.terms?.time?.start.toNumber(),
      pubKey: loan.pubKey.toBase58(),
      supportsFreezingCollateral: loan.supportsFreezingCollateral,
      isCollateralFrozen: loan.isCollateralFrozen,
      isHistorical: loan.isHistorical,
      state: loan.state,
    }

    accumulator[orderBookKey] = accumulator[orderBookKey] || []
    accumulator[orderBookKey].push(parsedLoan)
    return accumulator
  }, {})

  const loansData = {}

  Object.entries(loansByOrderBook).forEach(([key, loans]) => {
    const takenLoans = loans
      .filter((loan) => loan.state === 'taken')
      .sort((a, b) => b.takenTime - a.takenTime)
    const offeredLoans = loans
      .filter((loan) => loan.state === 'offered')
      .sort((a, b) => b.principalLamports - a.principalLamports)

    const takenLoansPool = takenLoans.reduce(
      (sum, takenLoan) => sum + takenLoan.principalLamports,
      0
    )
    const offeredLoansPool = offeredLoans.reduce(
      (sum, offeredLoan) => sum + offeredLoan.principalLamports,
      0
    )

    loansData[key] = {
      totalTakenLoans: takenLoans.length,
      totalOfferedLoans: offeredLoans.length,
      takenLoansPool,
      offeredLoansPool,
      latestTakenLoans: takenLoans.slice(0, 5),
      latestOfferedLoans: offeredLoans.slice(0, 5),
    }
  })

  return loansData
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
        nftMint: collection?.mints[collection?.mints.length - 1].toBase58(),
      }
    })

    return nftListPubKeyToNameMap
  }
)

const fetchMintInformation = async (nftMint) => {
  console.log('fetchMintInformation', nftMint)

  const { data } = await axios.post(
    `${HELLO_MOON_URL}/nft/mint_information`,
    {
      nftMint,
    },
    AXIOS_CONFIG_HELLO_MOON_KEY
  )

  return data?.data
}

export const fetchOrderBooks = createAsyncThunk(
  'sharkify/fetchOrderBooks',
  async (_, { getState, dispatch }) => {
    const sharkifyState = getState().sharkify
    const { pageIndex, pageSize } = getState().sharkifyLend
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

    const nftListPubKeyToNameMap = collectionNames

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

    // Fetch nft meta data using nftMint in hello moon

    // console.log(
    //   'nftMintInfos',
    //   orderBooks
    //     .slice(pageIndex, pageSize -)
    //     .map((orderBook) => orderBook?.nftMint)
    // )
    // Fetch collection meta data in hello moon
    // Fetch image uri using axios
    // Map to each collection

    return orderBooks
  }
)

export const { setOrderBooks } = sharkifySlice.actions

export default sharkifySlice.reducer
