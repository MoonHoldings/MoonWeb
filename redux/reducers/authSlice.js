import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
  loginType: '',
  signUpSuccess: null,
  loginSuccess: null,
  error: null,
  user: null,
}

export const signup = createAsyncThunk('auth/signup', async (creds) => {
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_MOON_SERVER_URL}/api/register`,
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
      `${process.env.NEXT_PUBLIC_MOON_SERVER_URL}/api/login`,
      creds,
      {
        withCredentials: true,
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

export const getUser = createAsyncThunk('auth/getUser', async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${process.env.NEXT_PUBLIC_MOON_SERVER_URL}/api/get-user`,
      withCredentials: true,
    })

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
  reducers: {
    changeLoginType(state, action) {
      state.loginType = action.payload
    },
  },
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
        state.user = action.payload.user
      })
      .addCase(login.rejected, (state, action) => {
        state.signUpSuccess = false
        state.error = action.payload
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user
      })
  },
})

export const { changeLoginType } = authSlice.actions

export default authSlice.reducer
