import client from 'utils/apollo-client'
import { GET_USER_NFTS } from 'utils/queries'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  addAddressStatus: 'idle',
  currentAddAddress: null,
  refreshWalletsStatus: 'idle',
  refreshFloorPriceStatus: 'idle',
  fetchingNftDataStatus: 'idle',
  collections: [],
  currentCollection: {},
  currentNft: {},
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    updateCollectionFloorPrice(state, action) {
      const { index, floorPrice } = action.payload
      state.collections[index] = { ...state.collections[index], floorPrice }
    },
    populateCurrentCollection(state, action) {
      state.currentCollection = action.payload
    },
    populateCurrentNft(state, action) {
      state.currentNft = { ...action.payload }
    },
    populateCollections(state, action) {
      state.collections = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchUserNfts.fulfilled, (state, action) => {
      state.collections = action.payload
    })
  },
})

export const fetchUserNfts = createAsyncThunk(
  'wallet/fetchUserNfts',
  async () => {
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
  }
)

export const {
  updateCollectionFloorPrice,
  populateCurrentCollection,
  populateCollections,
  populateCurrentNft,
} = walletSlice.actions

export default walletSlice.reducer
