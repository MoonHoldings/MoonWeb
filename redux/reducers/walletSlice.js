import client from 'utils/apollo-client'
import { GET_USER_WALLETS } from 'utils/queries'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  addAddressStatus: 'idle',
  currentAddAddress: null,
  refreshWalletsStatus: 'idle',
  wallets: [],
  exchangeWallets: [],
  isComplete: false,
  completeMessage: '',
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    completeExchangeInfo(state, action) {
      state.isComplete = action.payload.isComplete
      state.completeMessage = action.payload.message
    },
  },
  extraReducers(builder) {
    builder.addCase(getUserWallets.fulfilled, (state, action) => {
      const userWallets = action.payload

      state.wallets = userWallets?.reduce((acc, item) => {
        if (item.address && item.name === null) {
          acc.push(item)
        }
        return acc
      }, [])
      state.exchangeWallets = userWallets?.reduce((acc, item) => {
        if (item.name && item.address) {
          acc.push(item)
        }
        return acc
      }, [])
    })
  },
})

export const getUserWallets = createAsyncThunk(
  'wallet/getUserWallets',
  async ({}, thunkAPI) => {
    try {
      const { getState } = thunkAPI
      const tokenHeader = getState().auth.tokenHeader
      const { data } = await client.query({
        query: GET_USER_WALLETS,
        fetchPolicy: 'no-cache',
        variables: {
          type: 'Auto',
        },
        context: tokenHeader,
      })

      return data?.getUserWallets
    } catch (e) {
      console.log(e)
    }
  }
)

export const { completeExchangeInfo } = walletSlice.actions

export default walletSlice.reducer
