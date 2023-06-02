import client from 'utils/apollo-client'
import { GET_USER_NFTS } from 'utils/queries'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

import axios from 'axios'
import {
  AXIOS_CONFIG_HELLO_MOON_KEY,
  HELLO_MOON_URL,
} from 'application/constants/api'
import { GRANULARITY } from 'types/enums'

const initialState = {
  collections: [],
  currentCollection: {},
  currentNft: {},
  candleStickData: [],
  currentCollectionId: '',
  loadingCollection: false,
  loadingCandle: false,
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
      state.currentCollection = action.payload
      state.candleStickData = []
      state.currentCollectionId = ''
    },
    populateCurrentNft(state, action) {
      state.currentNft = { ...action.payload }
    },
    populateCollections(state, action) {
      state.collections = action.payload
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
        state.candleStickData = action.payload.candleStickData
        state.loadingCandle = false
      })
      .addCase(fetchHelloMoonCollectionIds.pending, (state, action) => {
        state.loadingCollection = true
      })
      .addCase(fetchHelloMoonCollectionIds.fulfilled, (state, action) => {
        state.currentCollectionId = action.payload
        state.loadingCollection = false
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
  async ({ granularity, currentCollectionId }, { getState }) => {
    const fetchCandleStickData = axios.post(
      `${HELLO_MOON_URL}/nft/collection/floorprice/candlesticks`,
      {
        limit: 100,
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

export const {
  updateCollectionFloorPrice,
  populateCurrentCollection,
  populateCollections,
  populateCurrentNft,
} = nftSlice.actions

export default nftSlice.reducer
