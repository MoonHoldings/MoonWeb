import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SERVER_URL } from 'app/constants/api'
import axios from 'axios'
import client from 'utils/apollo-client'
import { LOGIN_USER } from 'utils/mutations'

const initialState = {
  loading: false,
  modalLoading: false,
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    try {
      const res = await client.mutate({
        mutation: LOGIN_USER,
        variables: {
          email: email,
          password: password,
        },
      })
      const user = res.data.login

      if (user) {
        return { email: user.email, jid: user.accessToken }
      }
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
        return res.data
      } else {
        return false
      }
    } catch (error) {
      return error
    }
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
