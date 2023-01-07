import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const SERVER_URL = 'http://localhost:9000/api'

const initialState = {
  status: '',
  error: '',
}

export const signup = createAsyncThunk('auth/signup', async (creds) => {
  try {
    const response = await axios.post(
      SERVER_URL + '/register',
      { ...creds },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )
    return [...response.data]
  } catch (error) {
    return error.message
  }
})

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(signup.pending, (state, action) => {
        state.status = 'pending'
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'success'
        return action.payload
      })
      .addCase(signup.rejected, (state, action) => {
        state.error = action.error.message
      })
  },
})

export default userSlice.reducer
