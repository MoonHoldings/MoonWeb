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
  loanDetailsModalOpen: false,
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
    changeRevokeOfferModalOpen(state, action) {
      state.revokeOfferModalOpen = action.payload
    },
    changeLoanDetailsModalOpen(state, action) {
      state.loanDetailsModalOpen = action.payload
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
  changeRevokeOfferModalOpen,
  changeLoanDetailsModalOpen,
} = utilSlice.actions

export default utilSlice.reducer
