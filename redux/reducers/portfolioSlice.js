const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  coins: [],
  coinSymbol: null,
  coinName: null,
  coinPrice: 0.0,
  loading: false,
  reload: false,
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    loadingPortfolio(state, action) {
      state.loading = action.payload
    },
    reloadPortfolio(state, action) {
      state.reload = action.payload
    },
    populatePortfolioCoins(state, action) {
      state.coins = action.payload.coins
      state.coinSymbol = action.payload.symbol
      state.coinName = action.payload.name
      state.coinPrice = action.payload.coinPrice
    },
  },
})

export const { populatePortfolioCoins, loadingPortfolio, reloadPortfolio } =
  portfolioSlice.actions

export default portfolioSlice.reducer
