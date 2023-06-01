import client from 'utils/apollo-client'
import { GET_USER_NFTS } from 'utils/queries'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

import axios from 'axios'
import {
  AXIOS_CONFIG_HELLO_MOON_KEY,
  HELLO_MOON_URL,
} from 'application/constants/api'

const initialState = {
  collections: [],
  currentCollection: {},
  currentNft: {},
  candleStickData: [],
  currentCollectionId: '',
  loading: false,
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
        state.loading = true
      })
      .addCase(fetchCandleStickData.fulfilled, (state, action) => {
        state.candleStickData = action.payload
        state.loading = false
      })
      .addCase(fetchHelloMoonCollectionIds.pending, (state, action) => {
        state.loading = true
      })
      .addCase(fetchHelloMoonCollectionIds.fulfilled, (state, action) => {
        state.currentCollectionId = action.payload
        state.loading = false
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
    try {
      const { data: candleStickData } = await axios.post(
        `${HELLO_MOON_URL}/nft/collection/floorprice/candlesticks`,
        {
          limit: 100,
          granularity: granularity ?? 'ONE_DAY',
          helloMoonCollectionId: currentCollectionId ?? '',
        },
        AXIOS_CONFIG_HELLO_MOON_KEY
      )

      return candleStickData.data
    } catch (e) {
      console.log(e)
    }
  }
)

export const fetchHelloMoonCollectionIds = createAsyncThunk(
  'nft/fetchHelloMoonCollectionIds',
  async ({ mint }, thunkAPI) => {
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
          granularity: 'ONE_DAY',
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
