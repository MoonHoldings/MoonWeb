import { AXIOS_CONFIG_SHYFT_KEY, SHYFT_URL } from 'app/constants/api'
import axios from 'axios'
import encrypt from 'utils/encrypt'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  addAddressStatus: 'idle',
  addingNftImageStatus: 'idle',
  allWallets: [],
  collections: [],
  currentCollection: {},
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    populateWalletsAndCollections(state, action) {
      state.allWallets = action.payload.allWallets
      state.collections = action.payload.collections
    },
    removeWallet(state, action) {
      // Remove all NFTs from Collections associated with wallet
      for (let i = 0; i < state.collections.length; i++) {
        if (state.collections[i].nfts) {
          for (let x = 0; x < state.collections[i].nfts.length; x++) {
            if (state.collections[i].nfts[x].wallet === action.payload) {
              state.collections[i].nfts.splice(x, 1)
              x--
            }
          }
        }
      }

      // If collection has no NFTS remove it
      const filteredCollections = state.collections.filter((collection) => {
        if (collection.nfts && collection.nfts.length > 0) return collection
      })

      state.collections = filteredCollections

      // Remove Wallet
      const walletToRemove = state.allWallets.findIndex(
        (item) => item === action.payload
      )
      state.allWallets.splice(walletToRemove, 1)

      const walletState = {
        allWallets: state.allWallets,
        collections: state.collections,
      }
      const encryptedText = encrypt(walletState)
      localStorage.setItem('walletState', encryptedText)
    },
    changeAddAddressStatus(state, action) {
      state.addAddressStatus = action.payload
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
      .addCase(insertCurrentCollection.pending, (state, action) => {
        state.addingNftImageStatus = 'loading'
      })
      .addCase(insertCurrentCollection.fulfilled, (state, action) => {
        state.addingNftImageStatus = 'successful'
        state.currentCollection = action.payload
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
    console.log(state)

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

        if (collection.nfts) {
          collection.nfts.forEach((nft) => {
            nft.wallet = walletAddress
            nft.image = ''
          })
        }
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
      console.log('state.collections', state.collections)

      // ? Get collection image and unique wallets
      for (let i = 0; i < state.collections.length; i++) {
        if (!state.collections[i].image && state.collections[i].nfts) {
          const fetchResponse = await axios.get(
            `${state.collections[i].nfts[0].metadata_uri}`
          )

          const fetchRes = fetchResponse.data
          state.collections[i].image = fetchRes.image
          state.collections[i].description = fetchRes.description
          state.collections[i].collection = fetchRes.collection

          state.collections[i].nfts.forEach((nft) => {
            if (!nft.collection) nft = { ...nft, collection: {} }
          })
        }

        const currentWallet = state.collections[i].wallet
        state.allWallets = [...state.allWallets, currentWallet]
      }
      console.log('state.collections', state.collections)
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

export const insertCurrentCollection = createAsyncThunk(
  'wallet/insertCurrentCollection',
  async (collection) => {
    let mappedNfts = []
    let collNfts = collection.nfts
    try {
      for (let i = 0; i < collNfts.length; i++) {
        const response = await axios.get(`${collNfts[i].metadata_uri}`)
        const res = response.data

        mappedNfts.push({
          ...collNfts[i],
          image: res.image,
          // Add Attributes & Info { name, collection.name }
        })
      }

      const finalCollection = { ...collection, nfts: mappedNfts }

      console.log('finalCollection', finalCollection)

      return finalCollection
    } catch (error) {
      console.error('Error: collection.js > insertCurrentCollection', error)
    }
  }
)

export const {
  populateWalletsAndCollections,
  removeWallet,
  changeAddAddressStatus,
} = walletSlice.actions

export default walletSlice.reducer
