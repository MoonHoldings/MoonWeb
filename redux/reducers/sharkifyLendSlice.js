const { createSlice, createAsyncThunk } = require('@reduxjs/toolkit')

export const SortOptions = {
  NAME: 'Collection',
  TOTAL_POOL: 'Total Pool',
  BEST_OFFER: 'Best Offer',
  APY: 'APY',
  DURATION: 'Duration',
}

export const SortOrder = {
  ASC: 'asc',
  DESC: 'desc',
}

const initialState = {
  sortOption: SortOptions.NAME,
  sortOrder: SortOrder.ASC,
  pageIndex: 0,
  pageSize: 20,
  search: '',
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
  },
})

export const { changePageIndex, changePage, previousPage, nextPage, search } =
  sharkifyLendSlice.actions

export default sharkifyLendSlice.reducer
