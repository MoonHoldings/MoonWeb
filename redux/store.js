import { configureStore } from '@reduxjs/toolkit'
import authReducer from './reducers/authSlice'
import utilSlice from './reducers/utilSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    util: utilSlice,
  },
})
