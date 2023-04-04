import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import { createWrapper } from 'next-redux-wrapper'

import authSlice from './reducers/authSlice'
import utilSlice from './reducers/utilSlice'
import walletSlice from './reducers/walletSlice'
import cryptoSlice from './reducers/cryptoSlice'
import sharkifySlice from './reducers/sharkifySlice'
import sharkifyLendSlice from './reducers/sharkifyLendSlice'

const reducer = combineReducers({
  auth: authSlice,
  util: utilSlice,
  wallet: walletSlice,
  crypto: cryptoSlice,
  sharkify: sharkifySlice,
  sharkifyLend: sharkifyLendSlice,
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
      whitelist: [
        'auth',
        'util',
        'wallet',
        'crypto',
        'sharkify',
        'sharkifyLend',
      ],
      storage,
    }

    const persistedReducer = persistReducer(persistConfig, reducer)
    const store = makeConfiguredStore(persistedReducer)

    store.__persistor = persistStore(store)

    return store
  }
}

export const wrapper = createWrapper(makeStore, { debug: true })
