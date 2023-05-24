const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  solUsdPrice: 0,
  shouldUpdateCurrency: false,
  currentCurrency: 'SOL',
  loading: false,
}

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    changeSolUsdPrice(state, action) {
      state.solUsdPrice = action.payload
    },
    updateCurrency(state, action) {
      state.currentCurrency = action.payload
      state.shouldUpdateCurrency = true
    },
    updateShouldUpdateCurrency(state, action) {
      state.shouldUpdateCurrency = action.payload
    },
    loadingCrypto(state, action) {
      state.loading = action.payload
    },
  },
})

export const {
  changeSolUsdPrice,
  updateCurrency,
  updateShouldUpdateCurrency,
  loadingCrypto,
} = cryptoSlice.actions

export default cryptoSlice.reducer
