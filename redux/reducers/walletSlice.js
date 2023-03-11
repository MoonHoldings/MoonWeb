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

      const encryptedText = localStorage.getItem('walletState')
      const decrypted = decrypt(encryptedText)
      const newObj = { ...decrypted, currentNft: { ...action.payload } }
      const newEncryptedObj = encrypt(newObj)
      localStorage.setItem('walletState', newEncryptedObj)
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
    const state = getState()
    const getCollections = (state) => state.wallet.collections
    const getWallets = (state) => state.wallet.allWallets
    let collections = [...getCollections(state)]
    let allWallets = [...getWallets(state)]

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
        if (collections.length > 0) {
          //======= ? Add any new incoming collections into collections =======
          for (let i = 0; i < resCollections.length; i++) {
            const recordIndex = collections.findIndex(
              (coll) => coll.name === resCollections[i].name
            )

            if (recordIndex >= 0) {
              let newNfts = []
              for (let x = 0; x < resCollections[i].nfts.length; x++) {
                const matchedIndex = collections[recordIndex].nfts.findIndex(
                  (n) => n.name === resCollections[i].nfts[x].name
                )

                if (matchedIndex === -1) {
                  newNfts = [...newNfts, resCollections[i].nfts[x]]
                }
              }

              collections[recordIndex] = {
                ...collections[recordIndex],
                nfts: [...collections[recordIndex].nfts, ...newNfts],
              }
            } else {
              collections = [...collections, resCollections[i]]
            }
          }
        } else {
          // ? First wallet and collections added
          collections = [...resCollections]
        }
      }

      // ? Get collection image and unique wallets
      for (let i = 0; i < collections.length; i++) {
        if (!collections[i].image && collections[i].nfts) {
          let skipableNfts = []
          let fetchRes

          for (let y = 0; y < collections[i].nfts[y]; y++) {
            try {
              const fetchResponse = await axios.get(
                `${collections[i].nfts[y].metadata_uri}`
              )

              if (!fetchRes) fetchRes = fetchResponse.data
            } catch (error) {
              skipableNfts = [...skipableNfts, collections[i].nfts[y]]
            }
          }
          const filteredNfts = collections[i].nfts.filter((nft) => {
            const doesExist = skipableNfts.some((sn) => sn.name === nft.name)

            return !doesExist
          })

          collections[i] = {
            ...collections[i],
            nfts: [...filteredNfts],
          }

          if (fetchRes) {
            collections[i].image = fetchRes.image
            collections[i].description = fetchRes.description
            collections[i].collection = fetchRes.collection
          } else {
            collections[i].image = ''
            collections[i].description = ''
            collections[i].collection = {}
          }

          collections[i].nfts.forEach((nft) => {
            if (!nft.collection) nft = { ...nft, collection: {} }
          })
        }
        const currentWallet = collections[i].wallet
        allWallets = [...allWallets, currentWallet]
      }

      allWallets = [...new Set(allWallets)]

      const walletState = {
        allWallets: allWallets,
        collections: collections,
      }

      const encryptedText = encrypt(walletState)
      localStorage.setItem('walletState', encryptedText)

      return walletState
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
