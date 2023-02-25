import { AXIOS_CONFIG_SHYFT_KEY, SHYFT_URL } from 'app/constants/api'
import axios from 'axios'
import encrypt from 'utils/encrypt'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  addAddressStatus: 'idle',
  allWallets: [],
  collections: [],
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    populateWallets(state, action) {
      state.allWallets = action.payload
    },
    populateCollections(state, action) {
      state.collections = action.payload
    },
    populateWalletsAndCollections(state, action) {
      state.allWallets = action.payload.allWallets
      state.collections = action.payload.collections
    },
  },
  extraReducers(builder) {
    builder
      .addCase(addAddress.pending, (state, action) => {
        state.addAddressStatus = 'loading'
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addAddressStatus = 'successful'

        state.allWallets = action.payload.allWallets
        state.collections = action.payload.collections
      })
  },
})

export const addAddress = createAsyncThunk(
  'wallet/addAddress',
  async (walletAddress, { getState }) => {
    let state = {}
    let AllState = getState().wallet
    Object.entries(AllState).forEach((st) => {
      state[st[0]] = st[1]
    })

    try {
      const response = await axios.get(
        `${SHYFT_URL}/wallet/collections?network=mainnet-beta&wallet_address=${walletAddress}`,
        AXIOS_CONFIG_SHYFT_KEY
      )
      const res = await response.data
      const resCollections = res.result.collections.map((col) => col)

      // ? Add NFT update_authority to collection & Associate NFTs with wallet
      resCollections.forEach((collection) => {
        collection.wallet = walletAddress
        collection.update_authority = collection.nfts[0].update_authority
        collection.nfts.forEach((nft) => (nft.wallet = walletAddress))
      })
      if (res.success && resCollections) {
        if (state.collections.length > 0) {
          //======= ? Add any new incoming collections into collections =======
          for (let i = 0; i < resCollections.length; i++) {
            const recordIndex = state.collections.findIndex(
              (el) => el.name === resCollections[i].name
            )
            if (recordIndex !== -1) {
              for (let x = 0; x < resCollections[i].nfts.length; x++) {
                const matchedNftIndex = state.collections[
                  recordIndex
                ].nfts.findIndex(
                  (nft) => nft.name === resCollections[i].nfts[x].name
                )
                if (matchedNftIndex === -1) {
                  state.collections = [
                    ...state.collections,
                    resCollections[i].nfts[x],
                  ]
                }
              }
            } else {
              state.collections = [...state.collections, resCollections[i]]
            }
          }
        } else {
          // ? First wallet and collections added
          state.collections = [...resCollections]
        }
      }

      // ? Get collection image and unique wallets
      for (let i = 0; i < state.collections.length; i++) {
        if (!state.collections[i].image) {
          const fetchResponse = await axios.get(
            `${state.collections[0].nfts[0].metadata_uri}`
          )
          const fetchRes = fetchResponse.data
          state.collections[i].image = fetchRes.image
          state.collections[i].description = fetchRes.description
          state.collections[i].collection = fetchRes.collection
        }
        // Add collection details to each nft
        if (state.collections[i].nfts) {
          state.collections[i].nfts.forEach((nft) => {
            if (!nft.collection) nft = { ...nft, collection: {} }
          })
        }

        const currentWallet = state.collections[i].wallet
        state.allWallets = [...state.allWallets, currentWallet]
      }
      state.allWallets = [...new Set(state.allWallets)]

      const walletState = {
        allWallets: state.allWallets,
        collections: state.collections,
      }
      const encryptedText = encrypt(walletState)
      localStorage.setItem('walletState', encryptedText)

      return state
    } catch (error) {
      console.error('Error: nft.js > addAddress', error)
    }
  }
)

export const {
  populateWallets,
  populateCollections,
  populateWalletsAndCollections,
} = walletSlice.actions

export default walletSlice.reducer
