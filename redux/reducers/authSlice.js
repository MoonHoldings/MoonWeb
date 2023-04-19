import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SERVER_URL } from 'app/constants/api'
import axios from 'axios'
import { signIn } from 'next-auth/react'

const initialState = {
  signUpSuccess: null,
  loginSuccess: null,
  error: null,
  loading: false,
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const res = await signIn('credentials', {
      email: email,
      password: password,
      redirect: false,
    })

    return res
  }
)

export const refreshAccessToken = createAsyncThunk(
  '/refresh_token',
  async () => {
    const res = await axios.post(
      'http://localhost:80/refresh_token',
      {},
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    )

    if (res.data) {
      const response = await signIn('credentials', {
        refreshAccessToken: true,
        accessToken: res.data.accessToken,
        email: res.data.email,
        redirect: false,
      })
      return res
    }
  }
)

export const getUser = createAsyncThunk('auth/getUser', async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `${SERVER_URL}/get-user`,
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
  reducers: {},

  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(refreshAccessToken.pending, (state, action) => {
        state.loading = false
      })
  },
})

export const { signUpUser } = authSlice.actions

export default authSlice.reducer
