const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  leftSideBarOpen: false,
  rightSideBarOpen: false,
  addWalletModalOpen: false,
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
    changeAddWalletModalOpen(state, action) {
      state.addWalletModalOpen = action.payload
    },
  },
})

export const {
  changeLeftSideBarOpen,
  changeRightSideBarOpen,
  changeAddWalletModalOpen,
} = utilSlice.actions

export default utilSlice.reducer
