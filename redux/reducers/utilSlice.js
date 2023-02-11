const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  leftSideBarOpen: false,
  rightSideBarOpen: false,
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
  },
})

export const { changeLeftSideBarOpen, changeRightSideBarOpen } =
  utilSlice.actions

export default utilSlice.reducer
