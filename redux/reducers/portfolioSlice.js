const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  coins: [],
  coinSymbol: null,
  coinName: null,
  coinPrice: 0.0,
  loading: false,
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    loadingPortfolio(state, action) {
      state.loading = action.payload
    },

    populatePortfolioCoins(state, action) {
      state.coins = action.payload.coins
      state.coinSymbol = action.payload.symbol
      state.coinName = action.payload.name
      state.coinPrice = action.payload.coinPrice
    },
  },
})

export const { populatePortfolioCoins, loadingPortfolio } =
  portfolioSlice.actions

export default portfolioSlice.reducer
