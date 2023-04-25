const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

export const SortOptions = {
  NAME: 'Collection',
  TOTAL_POOL: 'Total Pool',
  BEST_OFFER: 'Best Offer',
  APY: 'APY',
  DURATION: 'Duration',
}

export const SortOrder = {
  ASC: 'ASC',
  DESC: 'DESC',
}

export const SHARKY_PAGE_SIZE = 50

const initialState = {
  sortOption: SortOptions.TOTAL_POOL,
  sortOrder: SortOrder.DESC,
  pageIndex: 0,
  pageSize: SHARKY_PAGE_SIZE,
  search: '',
  loanDetails: null,
  revokeLoan: null,
  repayLoan: null,
  orderBook: null,
}

const sharkifyLendSlice = createSlice({
  name: 'sharkifyLend',
  initialState,
  reducers: {
    changePageIndex(state, action) {
      state.pageIndex = action.payload
    },
    changePage(state, action) {
      state.pageIndex = (action.payload - 1) * state.pageSize
    },
    search(state, action) {
      state.pageIndex = 0
      state.search = action.payload
    },
    previousPage(state, action) {
      if (state.pageIndex > 0) {
        state.pageIndex -= state.pageSize
      }
    },
    nextPage(state, action) {
      if (state.pageIndex + state.pageSize <= action.payload.length) {
        state.pageIndex += state.pageSize
      }
    },
    setLoanDetails(state, action) {
      state.loanDetails = action.payload
    },
    setRevokeLoan(state, action) {
      state.revokeLoan = action.payload
    },
    setRepayLoan(state, action) {
      state.repayLoan = action.payload
    },
    setOrderBook(state, action) {
      state.orderBook = action.payload
    },
    setSortOption(state, action) {
      if (state.sortOption !== action.payload) {
        state.sortOrder = SortOrder.DESC
        state.sortOption = action.payload
      } else {
        state.sortOrder =
          state.sortOrder === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC
      }
    },
  },
})

export const {
  changePageIndex,
  changePage,
  previousPage,
  nextPage,
  search,
  setLoanDetails,
  setRevokeLoan,
  setRepayLoan,
  setOrderBook,
  setSortOption,
} = sharkifyLendSlice.actions

export default sharkifyLendSlice.reducer
