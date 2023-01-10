import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  status: 'idle',
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
})

export default authSlice.reducer
