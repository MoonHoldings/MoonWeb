import { AXIOS_CONFIG_SHYFT_KEY, SHYFT_URL } from 'app/constants/api'
import axios from 'axios'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  addAddressStatus: 'idle',
  wallets: [],
}

export const addAddress = createAsyncThunk(
  'wallet/addAddress',
  async (walletAddress) => {
    try {
      const response = await axios.get(
        `${SHYFT_URL}/wallet/collections?network=mainnet-beta&wallet_address=${walletAddress}`,
        AXIOS_CONFIG_SHYFT_KEY
      )

      const res = await response.data
      const resCollections = res.result.collections.map((col) => col)

      // ? Add NFT update_authority to collection & Associate NFTs with wallet
      console.log('resCollections', resCollections)
    } catch (error) {
      console.log(error)
    }
  }
)

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(addAddress.pending, (state, action) => {
        state.addAddressStatus = 'loading'
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addAddressStatus = 'successful'
      })
  },
})

export const {} = walletSlice.actions

export default walletSlice.reducer
