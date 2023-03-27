const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
  solUsdPrice: null,
}

const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    changeSolUsdPrice(state, action) {
      state.solUsdPrice = action.payload
    },
  },
})

export const { changeSolUsdPrice } = cryptoSlice.actions

export default cryptoSlice.reducer
