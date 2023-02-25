import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import utilSlice from './reducers/utilSlice'
import walletSlice from './reducers/walletSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    util: utilSlice,
    wallet: walletSlice,
  },
})
