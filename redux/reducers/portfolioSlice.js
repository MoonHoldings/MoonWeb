import { GET_USER_PORTFOLIO_TOTAL_BY_TYPE } from 'utils/queries'

const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')
import client from 'utils/apollo-client'
import { PortfolioType } from 'types/enums'

const initialState = {
  coins: [],
  coinSymbol: null,
  coinName: null,
  coinPrice: 0.0,
  loading: false,
  reload: false,
  cryptoTotal: 0.0,
  nftTotal: 0.0,
  loanTotal: 0.0,
  borrowTotal: 0.0,
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
    populatePortfolioTotals(state, action) {
      state.cryptoTotal = action.payload.cryptoTotal
      state.nftTotal = action.payload.nftTotal
      state.borrowTotal = action.payload.borrowTotal
      state.loanTotal = action.payload.loanTotal
    },
    clearCryptoTotal(state, action) {
      state.cryptoTotal = action.payload
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchPortfolioTotalByType.fulfilled, (state, action) => {
      const type = action?.payload?.type ?? ''
      if (type === PortfolioType.CRYPTO)
        state.cryptoTotal = action.payload.portfolioTotalByType
      if (type === PortfolioType.NFT)
        state.nftTotal = action.payload.portfolioTotalByType
      if (type === PortfolioType.BORROW)
        state.borrowTotal = action.payload.portfolioTotalByType
      if (type === PortfolioType.LOAN)
        state.loanTotal = action.payload.portfolioTotalByType

      state.loading = false
    })
  },
})

export const fetchPortfolioTotalByType = createAsyncThunk(
  'dashboard/fetchPortfolioTotalByType',
  async ({ type, walletAddress }) => {
    try {
      const { data } = await client.query({
        query: GET_USER_PORTFOLIO_TOTAL_BY_TYPE,
        variables: {
          type,
          wallets: [walletAddress],
        },
        fetchPolicy: 'no-cache',
      })

      const portfolioTotalByType = data?.getUserPortfolioTotalByType

      const returnObject = {
        type: type,
        portfolioTotalByType,
      }
      if (!portfolioTotalByType) return []
      else {
        return returnObject
      }
    } catch (e) {
      console.log(e)
    }
  }
)

export const {
  populatePortfolioCoins,
  loadingPortfolio,
  reloadPortfolio,
  populatePortfolioTotals,
  clearCryptoTotal,
} = portfolioSlice.actions

export default portfolioSlice.reducer
