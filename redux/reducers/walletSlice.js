import {
  AXIOS_CONFIG_SHYFT_KEY,
  AXIOS_CONFIG_HELLO_MOON_KEY,
  HELLO_MOON_URL,
  SHYFT_URL,
} from 'app/constants/api'
const { Connection, PublicKey } = require('@solana/web3.js')
import axios from 'axios'
import decrypt from 'utils/decrypt'
import encrypt from 'utils/encrypt'
import fetchURI from 'utils/fetchURI'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  addAddressStatus: 'idle',
  fetchingNftDataStatus: 'idle',
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
    updateCollectionFloorPrice(state, action) {
      const { index, floorPrice } = action.payload
      state.collections[index] = { ...state.collections[index], floorPrice }
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
        state.fetchingNftDataStatus = 'loading'
      })
      .addCase(insertCurrentCollection.fulfilled, (state, action) => {
        state.fetchingNftDataStatus = 'successful'
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
  const endpoint =
    'https://api.shyft.to/sol/v1/nft/read?network=mainnet-beta&token_address='

  // Create an array of Promises for fetching metadata for each address
  const promises = addresses.map(async (address) => {
    const res = await axios.get(endpoint + address, AXIOS_CONFIG_SHYFT_KEY)

    return res?.data?.result
  })

  // Use Promise.allSettled to fetch metadata for all addresses in parallel regardless if any fail
  const results = await Promise.allSettled(promises)

  return results
}

const fetchHelloMoonCollectionIds = async (addresses) => {
  const { data: collectionIdResponse } = await axios.post(
    `${HELLO_MOON_URL}/nft/collection/mints`,
    {
      nftMint: addresses,
    },
    AXIOS_CONFIG_HELLO_MOON_KEY
  )

  return collectionIdResponse
}

export const addAddress = createAsyncThunk(
  'wallet/addAddress',
  async ({ walletAddress, callback }, { getState }) => {
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
            collectionHash[collection?.name] = collection
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
            let address = collectionMetaData[i]?.value?.mint

            if (address) {
              collectionMetaDataHash[address] = collectionMetaData[i]?.value
            }
          }

          for (let i = 0; i < nfts.length; i++) {
            let nft = nfts[i]
            let collectionName =
              nft?.collection?.name || nft?.collection?.address
            let collectionImage = nft.cached_image_uri
              ? nft.cached_image_uri
              : nft.image_uri

            let address = nft?.collection?.address

            if (address) {
              if (collectionMetaDataHash[address] === undefined) continue

              if (collectionMetaDataHash[address]?.name) {
                collectionName = collectionMetaDataHash[address]?.name
              }

              if (collectionMetaDataHash[address]?.image_uri) {
                collectionImage = collectionMetaDataHash[address]?.image_uri
              }
            }

            if (collectionName === undefined) {
              collectionName = 'unknown'
            }

            if (collectionHash[collectionName] === undefined) {
              collectionHash[collectionName] = {
                name: collectionName,
                image: collectionImage,
                nfts: [{ ...nft, wallet: walletAddress }],
                wallet: walletAddress,
                address,
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

          // This contains the old and newly added collections
          const updatedCollections = Object.keys(collectionHash).map(
            (key) => collectionHash[key]
          )

          // Get newly added collections
          const newCollections = updatedCollections.filter(
            (collection) =>
              collection.helloMoonCollectionId === undefined &&
              collection.name !== 'unknown'
          )
          // For each collection, get the address of the first nft in the array
          const newNftMoonIds = newCollections.map(
            (collection) => collection?.nfts[0]?.mint
          )

          // Fetch the helloMoonCollectionId for each nft per collection
          const { data: newHelloMoonCollectionIds } =
            await fetchHelloMoonCollectionIds(newNftMoonIds)

          for (let i = 0; i < newHelloMoonCollectionIds?.length; i++) {
            const helloMoonIdMap = newHelloMoonCollectionIds[i]
            const collectionIndex = updatedCollections.findIndex(
              (collection) =>
                collection.nfts.find(
                  (nft) => nft.mint === helloMoonIdMap.nftMint
                ) !== undefined
            )

            if (collectionIndex > -1) {
              // Update the helloMoonCollectionId of each collection
              // This will be used for HelloMoon API integration
              updatedCollections[collectionIndex] = {
                ...updatedCollections[collectionIndex],
                helloMoonCollectionId: helloMoonIdMap.helloMoonCollectionId,
              }
            }
          }

          walletState = {
            collections: updatedCollections,
            allWallets: [...allWallets, walletAddress],
          }
        }

        const encryptedText = encrypt(walletState)
        localStorage.setItem('walletState', encryptedText)

        if (callback) {
          callback()
        }

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

      // TODO: Fetch listing data of nfts

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
  updateCollectionFloorPrice,
  removeWallet,
  changeAddAddressStatus,
  removeAllWallets,
  populateCurrentCollection,
  populateCurrentNft,
} = walletSlice.actions

export default walletSlice.reducer
