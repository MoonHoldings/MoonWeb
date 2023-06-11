import axios from 'axios'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')
import { signAndSendTransaction } from '@shyft-to/js'

import {
  AXIOS_CONFIG_HELLO_MOON_KEY,
  AXIOS_CONFIG_SHYFT_KEY,
  HELLO_MOON_URL,
  SHYFT_KEY,
  SHYFT_URL,
} from 'application/constants/api'
import { GRANULARITY } from 'types/enums'
import { GET_USER_NFTS } from 'utils/queries'
import { displayNotifModal } from 'utils/notificationModal'
import client from 'utils/apollo-client'

const initialState = {
  collections: [],
  currentCollection: {},
  ownedNfts: [],
  currentNft: {},
  candleStickData: [],
  selectedNfts: [],
  currentCollectionId: '',
  loadingCollection: false,
  loadingCandle: false,
  loadingTransfer: false,
  loadingBurning: false,
  headerData: {
    ath: 0,
    atl: 0,
    volume: 0,
    listing_count: 0,
    owner_count: 0,
    supply: 0,
  },
}

const nftSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    updateCollectionFloorPrice(state, action) {
      const { index, floorPrice } = action.payload
      state.collections[index] = { ...state.collections[index], floorPrice }
    },
    populateCurrentCollection(state, action) {
      const filteredMints = action.payload.collection.nfts
        .filter((nft) => nft.owner === action.payload.publicKey)
        .map((nft) => nft.mint)

      state.ownedNfts = filteredMints
      state.currentCollection = action.payload.collection
      state.candleStickData = []
      state.currentCollectionId = ''
    },
    populateCurrentNft(state, action) {
      state.currentNft = { ...action.payload }
    },
    populateCollections(state, action) {
      state.collections = action.payload
    },
    selectNft(state, action) {
      const existingIndex = state.selectedNfts.findIndex(
        (item) => item.mint === action.payload.mint
      )

      if (existingIndex !== -1) {
        // If action.payload exists, remove the item from the array
        state.selectedNfts.splice(existingIndex, 1)
      } else {
        if (state.selectedNfts.length == 7) {
          displayNotifModal(
            'warning',
            'Warning! You have selected the maximum allowed nfts to send/burn',
            action.payload.notification
          )
        } else {
          // If action.payload does not exist, add it to the array along with the name
          state.selectedNfts.push({
            mint: action.payload.mint,
            name: action.payload.name,
          })
        }
      }
    },
    deselectAllNfts(state, action) {
      state.selectedNfts = []
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserNfts.fulfilled, (state, action) => {
        state.collections = action.payload
      })
      .addCase(fetchCandleStickData.pending, (state, action) => {
        state.loadingCandle = true
      })
      .addCase(fetchCandleStickData.fulfilled, (state, action) => {
        state.headerData = {
          ath: action.payload.ath,
          atl: action.payload.atl,
          volume: action.payload.volume,
          listing_count: action.payload.listing_count,
          owner_count: action.payload.owner_count,
          supply: action.payload.supply,
        }
        state.candleStickData = action.payload.candleStickData ?? []
        state.loadingCandle = false
      })
      .addCase(fetchHelloMoonCollectionIds.pending, (state, action) => {
        state.loadingCollection = true
      })
      .addCase(fetchHelloMoonCollectionIds.fulfilled, (state, action) => {
        state.currentCollectionId = action.payload
        state.loadingCollection = false
      })
      .addCase(transferNfts.pending, (state, action) => {
        state.loadingTransfer = true
      })
      .addCase(transferNfts.fulfilled, (state, action) => {
        state.loadingTransfer = false
      })
      .addCase(burnNfts.pending, (state, action) => {
        state.loadingBurning = true
      })
      .addCase(burnNfts.fulfilled, (state, action) => {
        state.loadingBurning = false
      })
  },
})

export const fetchUserNfts = createAsyncThunk('nft/fetchUserNfts', async () => {
  try {
    const { data } = await client.query({
      query: GET_USER_NFTS,
      fetchPolicy: 'no-cache',
    })
    const nfts = data?.getUserNfts
    const collections = {}

    if (!nfts.length) return []

    for (const nft of nfts) {
      let collectionName = nft?.collection?.name ?? nft.name.split('#')[0]

      if (collectionName) {
        if (!collections[collectionName]) {
          collections[collectionName] = {
            floorPrice:
              nft?.collection?.floorPrice === undefined
                ? null
                : nft?.collection?.floorPrice,
            image: nfts?.collection?.image ?? nft?.image,
            name: collectionName,
            nfts: [],
          }
        }

        collections[collectionName].nfts.push(nft)
      }
    }
    return Object.values(collections)
  } catch (e) {
    console.log(e)
  }
})

export const fetchCandleStickData = createAsyncThunk(
  'nft/fetchCandleStickData',
  async ({ granularity, currentCollectionId }) => {
    const limit =
      granularity == GRANULARITY.FIVE_MIN || granularity == GRANULARITY.ONE_MIN
        ? 200
        : 100
    const fetchCandleStickData = axios.post(
      `${HELLO_MOON_URL}/nft/collection/floorprice/candlesticks`,
      {
        limit: limit,
        granularity: granularity ?? 'ONE_DAY',
        helloMoonCollectionId: currentCollectionId ?? '',
      },
      AXIOS_CONFIG_HELLO_MOON_KEY
    )

    const fetchAllTimeData = axios.post(
      `${HELLO_MOON_URL}/nft/collection/all-time`,
      {
        helloMoonCollectionId: currentCollectionId ?? '',
      },
      AXIOS_CONFIG_HELLO_MOON_KEY
    )

    const fetchCollectionStats = axios.post(
      `${HELLO_MOON_URL}/nft/collection/leaderboard/stats`,
      {
        granularity: 'ONE_DAY', // fix to one day
        helloMoonCollectionId: currentCollectionId ?? '',
      },
      AXIOS_CONFIG_HELLO_MOON_KEY
    )
    try {
      const [candleStickResponse, allTimeResponse, collectionStatsResponse] =
        await Promise.all([
          fetchCandleStickData,
          fetchAllTimeData,
          fetchCollectionStats,
        ])

      const { data: candleStickData } = candleStickResponse
      const { data: allTimeData } = allTimeResponse
      const { data: collectionStatsData } = collectionStatsResponse

      const collectionStats =
        collectionStatsData.data.length > 0 && collectionStatsData.data[0]
      const collection = {
        candleStickData: candleStickData.data,
        ath: allTimeData.allTimeHighPriceLamports,
        atl: allTimeData.allTimeLowPriceLamports,
        volume: collectionStats.volume,
        supply: collectionStats.supply,
        listing_count: collectionStats.listing_count,
        owner_count: collectionStats.current_owner_count,
      }

      return collection
    } catch (e) {
      console.log(e)
    }
  }
)

export const fetchHelloMoonCollectionIds = createAsyncThunk(
  'nft/fetchHelloMoonCollectionIds',
  async ({ granularity, mint }, thunkAPI) => {
    const { dispatch } = thunkAPI

    const { data: collectionIdResponse } = await axios.post(
      `${HELLO_MOON_URL}/nft/mints-by-owner`,
      {
        nftMint: mint,
      },
      AXIOS_CONFIG_HELLO_MOON_KEY
    )

    if (collectionIdResponse.data.length == 1)
      dispatch(
        fetchCandleStickData({
          granularity: granularity ?? GRANULARITY.ONE_DAY,
          currentCollectionId:
            collectionIdResponse.data[0].helloMoonCollectionId,
        })
      )
    else return ''
  }
)

export const transferNfts = createAsyncThunk(
  'nft/transferNfts',
  async (
    { fromAddress, toAddress, connection, wallet, notification },
    thunkAPI
  ) => {
    const { dispatch, getState } = thunkAPI
    const mintArray = getState().nft.selectedNfts?.map((item) => item.mint)

    try {
      const data = await axios.post(
        `${SHYFT_URL}/nft/transfer_many`,
        {
          from_address: fromAddress,
          to_address: toAddress,
          token_addresses: mintArray,
          network: 'mainnet-beta',
        },
        AXIOS_CONFIG_SHYFT_KEY
      )

      if (data.data.result.encoded_transactions[0])
        dispatch(
          confirmTransaction({
            encodedTransaction: data.data.result.encoded_transactions[0],
            connection: connection,
            wallet: wallet,
            notification: notification,
          })
        )
      return ''
    } catch (e) {
      displayNotifModal(
        'Error',
        `Failed to confirm the transaction.`,
        notification
      )
      console.log(e)
    }
  }
)

export const burnNfts = createAsyncThunk(
  'nft/burnNfts',
  async ({ fromAddress, connection, wallet, notification }, thunkAPI) => {
    const { dispatch, getState } = thunkAPI
    const mintArray = getState().nft.selectedNfts?.map((item) => item.mint)
    try {
      const data = await axios.delete(`${SHYFT_URL}/nft/burn_many`, {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': SHYFT_KEY,
        },
        data: {
          wallet: fromAddress,
          close_accounts: true,
          nft_addresses: mintArray,
          network: 'mainnet-beta',
        },
      })

      if (data.data?.result.encoded_transactions[0]) {
        dispatch(
          confirmTransaction({
            encodedTransaction: data.data.result.encoded_transactions[0],
            connection: connection,
            wallet: wallet,
            notification: notification,
          })
        )
      }
      return ''
    } catch (e) {
      displayNotifModal(
        'Error',
        `Failed to confirm the transaction.`,
        notification
      )
      console.log(e)
    }
  }
)
export const confirmTransaction = createAsyncThunk(
  'nft/confirmTransaction',
  async (
    { encodedTransaction, connection, wallet, notification },
    thunkAPI
  ) => {
    const { dispatch } = thunkAPI
    try {
      const txnSignature = await signAndSendTransaction(
        connection,
        encodedTransaction,
        wallet.adapter
      )

      if (txnSignature != null) {
        displayNotifModal(
          'Success',
          `Done! You've successfully completed your transaction.`,
          notification
        )
        dispatch(deselectAllNfts())
      }
    } catch (error) {
      displayNotifModal(
        'Error',
        `Failed to confirm the transaction.`,
        notification
      )
      throw new Error(error)
    }
  }
)

export const {
  updateCollectionFloorPrice,
  populateCurrentCollection,
  populateCollections,
  populateCurrentNft,
  selectNft,
  deselectAllNfts,
} = nftSlice.actions

export default nftSlice.reducer
