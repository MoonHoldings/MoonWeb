const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  leftSideBarOpen: false,
  rightSideBarOpen: false,
  lendRightSideBarOpen: false,
  addWalletModalOpen: false,
  walletsModalOpen: false,
  lendModalOpen: false,
  borrowModalOpen: false,
  revokeOfferModalOpen: false,
  repayModalOpen: false,
  extendModalOpen: false,
  loanDetailsModalOpen: false,
  coinModalOpen: false,
  nftModalOpen: false,
  nftModalType: '',
  exchangeModalOpen: false,
  shouldReloadDashboardData: false,
}

const utilSlice = createSlice({
  name: 'util',
  initialState,
  reducers: {
    changeLeftSideBarOpen(state, action) {
      state.leftSideBarOpen = action.payload
    },
    changeRightSideBarOpen(state, action) {
      state.rightSideBarOpen = action.payload
    },
    changeLendRightSidebarOpen(state, action) {
      state.lendRightSideBarOpen = action.payload
    },
    changeAddWalletModalOpen(state, action) {
      state.addWalletModalOpen = action.payload
    },
    changeWalletsModalOpen(state, action) {
      state.walletsModalOpen = action.payload
    },
    changeLendModalOpen(state, action) {
      state.lendModalOpen = action.payload
    },
    changeBorrowModalOpen(state, action) {
      state.borrowModalOpen = action.payload
    },
    changeExtendModalOpen(state, action) {
      state.extendModalOpen = action.payload
    },
    changeRevokeOfferModalOpen(state, action) {
      state.revokeOfferModalOpen = action.payload
    },
    changeRepayModalOpen(state, action) {
      state.repayModalOpen = action.payload
    },
    changeLoanDetailsModalOpen(state, action) {
      state.loanDetailsModalOpen = action.payload
    },
    changeCoinModalOpen(state, action) {
      state.coinModalOpen = action.payload
    },
    changeNftModalOpen(state, action) {
      state.nftModalOpen = action.payload.isShow
      state.nftModalType = action.payload.type
    },
    changeExchangeModalOpen(state, action) {
      state.exchangeModalOpen = action.payload
    },
    reloadDashboard(state, action) {
      state.shouldReloadDashboardData = action.payload
    },
  },
})

export const {
  changeLeftSideBarOpen,
  changeRightSideBarOpen,
  changeLendRightSidebarOpen,
  changeAddWalletModalOpen,
  changeWalletsModalOpen,
  changeLendModalOpen,
  changeBorrowModalOpen,
  changeExtendModalOpen,
  changeRevokeOfferModalOpen,
  changeRepayModalOpen,
  changeLoanDetailsModalOpen,
  changeCoinModalOpen,
  changeNftModalOpen,
  reloadDashboard,
  changeExchangeModalOpen,
} = utilSlice.actions

export default utilSlice.reducer
