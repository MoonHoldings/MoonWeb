import client from 'utils/apollo-client'
import { GET_USER_WALLETS } from 'utils/queries'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

const initialState = {
  addAddressStatus: 'idle',
  currentAddAddress: null,
  refreshWalletsStatus: 'idle',
  wallets: [],
}

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(getUserWallets.fulfilled, (state, action) => {
      state.wallets = action.payload
    })
  },
})

export const getUserWallets = createAsyncThunk(
  'wallet/getUserWallets',
  async () => {
    try {
      const { data } = await client.query({
        query: GET_USER_WALLETS,
        fetchPolicy: 'no-cache',
        variables: {
          type: 'Auto',
        },
      })

      return data?.getUserWallets
    } catch (e) {
      console.log(e)
    }
  }
)

export const {} = walletSlice.actions

export default walletSlice.reducer
