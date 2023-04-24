import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SERVER_URL } from 'app/constants/be'
import axios from 'axios'
import { signIn } from 'next-auth/react'

const initialState = {
  loading: false,
  modalLoading: false,
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    try {
      e.preventDefault()
      const res = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      })

      return res
    } catch (error) {
      return error
    }
  }
)

export const refreshAccessToken = createAsyncThunk(
  '/refresh_token',
  async () => {
    try {
      const res = await axios.post(
        `${SERVER_URL}/refresh_token`,
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
        // return response
      }
    } catch (error) {}
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticatePending(state, action) {
      state.modalLoading = true
    },
    authenticateComplete(state, action) {
      state.modalLoading = false
    },
  },

  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state, action) => {
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
      })
      .addCase(refreshAccessToken.pending, (state, action) => {
        state.loading = true
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false
      })
  },
})

export const { authenticatePending, authenticateComplete } = authSlice.actions

export default authSlice.reducer
