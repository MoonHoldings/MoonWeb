import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { createWrapper, HYDRATE } from 'next-redux-wrapper'
import authReducer from './reducers/authSlice'
import utilSlice from './reducers/utilSlice'
import walletSlice from './reducers/walletSlice'

const reducer = combineReducers({
  auth: authReducer,
  util: utilSlice,
  wallet: walletSlice,
})

const makeConfiguredStore = (reducer) => configureStore({ reducer })

const makeStore = () => {
  const isServer = typeof window === 'undefined'

  if (isServer) {
    return makeConfiguredStore(reducer)
  } else {
    // we need it only on client side
    const { persistStore, persistReducer } = require('redux-persist')
    const storage = require('redux-persist/lib/storage').default

    const persistConfig = {
      key: 'root',
      whitelist: ['auth', 'util', 'wallet'],
      storage,
    }

    const persistedReducer = persistReducer(persistConfig, reducer)
    const store = makeConfiguredStore(persistedReducer)

    store.__persistor = persistStore(store)

    return store
  }
}

export const wrapper = createWrapper(makeStore, { debug: true })
