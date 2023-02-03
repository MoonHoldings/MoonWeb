const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  leftSideBarOpen: false,
}

const utilSlice = createSlice({
  name: 'util',
  initialState,
  reducers: {
    changeLeftSideBarOpen(state, action) {
      state.leftSideBarOpen = action.payload
    },
  },
})

export const { changeLeftSideBarOpen } = utilSlice.actions

export default utilSlice.reducer
