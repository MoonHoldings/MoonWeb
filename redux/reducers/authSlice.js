import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  signUpSuccess: null,
  loginSuccess: null,
  error: null,
  user: {},
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

export const login = createAsyncThunk('auth/login', async (creds) => {
  try {
    const response = await axios.post(
      `http://localhost:9000/api/login`,
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
      .addCase(signup.fulfilled, (state, action) => {
        state.signUpSuccess = action.payload.success
      })
      .addCase(signup.rejected, (state, action) => {
        state.signUpSuccess = false
        state.error = action.payload
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loginSuccess = action.payload.success
        state.user = action.success
      })
      .addCase(login.rejected, (state, action) => {
        state.signUpSuccess = false
        state.error = action.payload
      })
  },
})

export default authSlice.reducer
