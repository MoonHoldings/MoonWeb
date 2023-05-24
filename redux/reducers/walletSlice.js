import client from 'utils/apollo-client'

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
  extraReducers(builder) {},
})

export const {} = walletSlice.actions

export default walletSlice.reducer
