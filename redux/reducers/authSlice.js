import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  status: 'idle',
  signupResult: {},
  error: null,
}

export const signup = createAsyncThunk('auth/signup', async (creds) => {
  try {
    const response = await axios.post(
      `http://localhost:9000/api/register`,
      creds,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    return response.data
  } catch (error) {
    return {
      success: false,
      message: error,
    }
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(signup.pending, (state, action) => {
        state.status = 'pending'
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.signupResult = action.payload
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const signupResult = (state) => state.signupResult

export default authSlice.reducer
