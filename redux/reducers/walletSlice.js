import { AXIOS_CONFIG_SHYFT_KEY, SHYFT_URL } from 'app/constants/api'
import axios from 'axios'
import decrypt from 'utils/decrypt'
import encrypt from 'utils/encrypt'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  addAddressStatus: 'idle',
  addingNftImageStatus: 'idle',
  addingSingleNftStatus: 'idle',
  allWallets: [],
  collections: [],
  currentCollection: {},
  currentNft: {},
  singleNFT: {},
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    populateWalletsAndCollections(state, action) {
      state.allWallets = action.payload.allWallets
      state.collections = action.payload.collections
    },
    populateCurrentCollection(state, action) {
      state.currentCollection = action.payload
    },
    populateCurrentNft(state, action) {
      state.currentNft = { ...action.payload }
      console.log(state.currentNft)
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
    removeAllWallets(state, action) {
      state.allWallets = []
      state.collections = []
      state.currentCollection = {}
      state.singleNFT = {}

      localStorage.removeItem('walletState')
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
      .addCase(insertSingleNFT.pending, (state, action) => {
        state.addingSingleNftStatus = 'loading'
      })
      .addCase(insertSingleNFT.fulfilled, (state, action) => {
        state.addingSingleNftStatus = 'successful'
        state.singleNFT = action.payload
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

        if (collection.nfts) {
          collection.update_authority = collection.nfts[0].update_authority
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
            const thisResColl = resCollections[i]

            const recordIndex = state.collections.findIndex(
              (coll) => coll.name === thisResColl.name
            )

            if (recordIndex >= 0) {
              let newNfts = []
              let stateNfts = [...state.collections[recordIndex].nfts]
              let resNfts = [...thisResColl.nfts]

              for (let x = 0; x < resNfts.length; x++) {
                const matchedIndex = stateNfts.findIndex(
                  (n) => n.name === resNfts[x].name
                )

                if (matchedIndex === -1) {
                  newNfts = [...newNfts, resNfts[x]]
                }
              }

              if (newNfts.length !== 0) {
                stateNfts = [...stateNfts, ...newNfts]
              }

              state.collections[recordIndex].nfts = [...stateNfts]
            } else {
              state.collections = [...state.collections, thisResColl]
            }
          }
        } else {
          // ? First wallet and collections added
          state.collections = [...resCollections]
        }
      }

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
          attributes: res.attributes,
          collection: res.collection,
          // Add Attributes & Info { name, collection.name }
        })
      }

      const finalCollection = { ...collection, nfts: mappedNfts }

      const encryptedText = localStorage.getItem('walletState')
      const decrypted = decrypt(encryptedText)
      const newObj = { ...decrypted, currentCollection: { ...finalCollection } }
      const encryptedNewObj = encrypt(newObj)
      localStorage.setItem('walletState', encryptedNewObj)

      console.log('finalCollection', finalCollection)

      return finalCollection
    } catch (error) {
      console.error('Error: collection.js > insertCurrentCollection', error)
    }
  }
)

export const insertSingleNFT = createAsyncThunk(
  'wallet/insertSingleNFT',
  async (collection) => {
    let mappedNfts = []
    let collNfts = collection.nfts
    try {
      for (let i = 0; i < collNfts.length; i++) {
        const response = await axios.get(`${collNfts[i].metadata_uri}`)
        const res = response.data
        console.log('>>> res', res)
        mappedNfts.push({
          ...collNfts[i],
          image: res.image,
          attributes: res.attributes,
          collection: res.collection,
          // Add Attributes & Info { name, collection.name }
        })
      }

      const singleNFT = { ...collection, nfts: mappedNfts }

      console.log('singleNFT', singleNFT)

      return singleNFT
    } catch (error) {
      console.error('Error: collection.js > insertSingleNFT', error)
    }
  }
)

export const {
  populateWalletsAndCollections,
  removeWallet,
  changeAddAddressStatus,
  removeAllWallets,
  populateCurrentCollection,
  populateCurrentNft,
} = walletSlice.actions

export default walletSlice.reducer
