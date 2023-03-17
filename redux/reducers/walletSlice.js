import { AXIOS_CONFIG_SHYFT_KEY, SHYFT_URL } from 'app/constants/api'
const { Connection, PublicKey } = require('@solana/web3.js')
import axios from 'axios'
import decrypt from 'utils/decrypt'
import encrypt from 'utils/encrypt'
import fetchURI from 'utils/fetchURI'

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

const fetchNftMetaData = async (nft) => {
  try {
    const response = await axios.get(nft.metadata_uri)
    const { image, description } = response.data
    return { image, description }
  } catch (error) {
    console.error(`Error fetching metadata for NFT ${nft.name}:`, error)
    return {}
  }
}

const parseAddress = (address) => {
  const _address = address

  return (
    _address.substring(0, 4) + '...' + _address.substring(_address.length - 4)
  )
}

const bulkFetchCollectionMetadata = async (addresses) => {
  const endpoint = 'https://api-mainnet.magiceden.io/rpc/getNFTByMintAddress/'

  // Create an array of Promises for fetching metadata for each address
  const promises = addresses.map(async (address) => {
    const res = await axios.get(endpoint + address)
    return res?.data?.results
  })

  // Use Promise.all to fetch metadata for all addresses in parallel
  const results = await Promise.all(promises)

  return results
}

export const addAddress = createAsyncThunk(
  'wallet/addAddress',
  async (walletAddress, { getState }) => {
    const state = getState()

    let collections = [...state.wallet.collections]
    let allWallets = state.wallet.allWallets

    let walletState = {
      collections: collections,
      allWallets: allWallets,
    }

    // Check if wallet exists already
    if (!allWallets.includes(walletAddress)) {
      try {
        const response = await axios.get(
          `${SHYFT_URL}/nft/read_all?network=mainnet-beta&address=${walletAddress}`,
          AXIOS_CONFIG_SHYFT_KEY
        )
        const res = response.data

        if (res.success && res.result.length) {
          const collectionHash = {}
          const nfts = res.result

          collections.forEach((collection) => {
            collectionHash[collection.name] = collection
          })

          const uniqueCollectionAddressHash = {}

          // Build hash for nfts that has collection address property
          for (let i = 0; i < nfts.length; i++) {
            let nft = nfts[i]

            if (nft?.collection?.address) {
              uniqueCollectionAddressHash[nft?.collection?.address] = true
            }
          }

          // Fetch metadata of each address
          const uniqueCollectionAddresses = Object.keys(
            uniqueCollectionAddressHash
          ).map((key) => key)
          const collectionMetaData = await bulkFetchCollectionMetadata(
            uniqueCollectionAddresses
          )
          const collectionMetaDataHash = {}

          // Build hash for each metadata, using the address as key
          for (let i = 0; i < collectionMetaData.length; i++) {
            let address = collectionMetaData[i]?.mintAddress

            if (address) {
              collectionMetaDataHash[address] = collectionMetaData[i]
            }
          }

          console.log('collectionMetaDataHash', collectionMetaDataHash)

          for (let i = 0; i < nfts.length; i++) {
            let nft = nfts[i]
            let collectionName =
              nft?.collection?.name || nft?.collection?.address
            let collectionImage = nft.cached_image_uri
              ? nft.cached_image_uri
              : nft.image_uri

            if (nft?.collection?.address) {
              let address = nft?.collection?.address

              if (collectionMetaDataHash[address]?.title) {
                collectionName = collectionMetaDataHash[address]?.title
              }

              if (collectionMetaDataHash[address]?.properties?.files[0]?.uri) {
                collectionImage =
                  collectionMetaDataHash[address]?.properties?.files[0]?.uri
              }
            }

            if (collectionName === undefined) {
              collectionName = 'unknown'
            }

            if (collectionName.length > 20) {
              collectionName = parseAddress(collectionName)
            }

            if (collectionHash[collectionName] === undefined) {
              collectionHash[collectionName] = {
                name: collectionName,
                image: collectionImage,
                nfts: [{ ...nft, wallet: walletAddress }],
                wallet: walletAddress,
              }
            } else {
              collectionHash[collectionName] = {
                ...collectionHash[collectionName],
                nfts: [
                  ...collectionHash[collectionName].nfts,
                  {
                    ...nft,
                    wallet: walletAddress,
                  },
                ],
              }
            }
          }

          walletState = {
            collections: Object.keys(collectionHash).map(
              (key) => collectionHash[key]
            ),
            allWallets: [...allWallets, walletAddress],
          }

          console.log(walletState)
        }

        const encryptedText = encrypt(walletState)
        localStorage.setItem('walletState', encryptedText)

        return walletState
      } catch (error) {
        console.error('Error: nft.js > addAddress', error)
      }
    } else {
      console.log('Wallet already exists')
    }
  }
)

export const addAddress2 = createAsyncThunk(
  'wallet/addAddress',
  async (walletAddress, { getState }) => {
    const state = getState()

    let collections = [...state.wallet.collections]
    let allWallets = state.wallet.allWallets
    const currentCollectionsLength = collections.length

    // Check if wallet exists already
    if (!allWallets.includes(walletAddress)) {
      try {
        const response = await axios.get(
          `${SHYFT_URL}/wallet/collections?network=mainnet-beta&wallet_address=${walletAddress}`,
          AXIOS_CONFIG_SHYFT_KEY
        )
        const res = await response.data
        const resCollections = res.result.collections.map((col) => col)

        // Add NFT update_authority to collection & Associate NFTs with wallet
        resCollections.forEach((collection) => {
          collection.wallet = walletAddress

          if (collection.nfts) {
            collection.update_authority = collection.nfts[0].update_authority

            collection.nfts.forEach((nft) => {
              nft.wallet = walletAddress
            })
          }
        })

        if (res.success && resCollections) {
          if (collections.length > 0) {
            // Add any new incoming collections into collections
            for (let i = 0; i < resCollections.length; i++) {
              const recordIndex = collections.findIndex(
                (coll) => coll.name === resCollections[i].name
              )

              if (recordIndex >= 0) {
                let newNfts = []

                for (let x = 0; x < resCollections[i].nfts.length; x++) {
                  const matchedIndex = collections[recordIndex].nfts.findIndex(
                    (n) =>
                      n.metadata_uri === resCollections[i].nfts[x].metadata_uri
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
            // First wallet and collections added
            collections = [...resCollections]
          }

          // Get collection image and unique wallets
          for (let i = currentCollectionsLength; i < collections.length; i++) {
            if (!collections[i].image && collections[i].nfts) {
              // fetch metadata for first NFT
              if (collections[i].nfts.length) {
                const metadata = await fetchNftMetaData(collections[i].nfts[0])

                // update collection with metadata and image
                collections[i] = {
                  ...collections[i],
                  image: metadata.image || '',
                  description: metadata.description || '',
                  collection: metadata.collection || '',
                }
              }
            }
          }
        }

        const walletState = {
          collections: collections.filter(
            (collection) => collection.image !== ''
          ),
          allWallets: [...allWallets, walletAddress],
        }

        const encryptedText = encrypt(walletState)
        localStorage.setItem('walletState', encryptedText)

        return walletState
      } catch (error) {
        console.error('Error: nft.js > addAddress', error)
      }
    } else {
      console.log('Wallet already exists')
    }
  }
)

export const insertCurrentCollection = createAsyncThunk(
  'wallet/insertCurrentCollection',
  async ({ collection, redirect }) => {
    try {
      const encryptedText = localStorage.getItem('walletState')
      const decrypted = decrypt(encryptedText)
      const newObj = { ...decrypted, currentCollection: { ...collection } }
      const encryptedNewObj = encrypt(newObj)

      localStorage.setItem('walletState', encryptedNewObj)

      if (redirect) {
        redirect()
      }

      return collection
    } catch (error) {
      console.error(
        'Error: collection.js > insertCurrentCollection',
        error.response
      )
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
