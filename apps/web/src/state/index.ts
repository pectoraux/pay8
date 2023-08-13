import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import farmsReducer from './farms'
import { updateVersion } from './global/actions'
import lotteryReducer from './lottery'
import poolsReducer from './pools'
import transactions from './transactions/reducer'
import user from './user/reducer'
import potteryReducer from './pottery'
import rampsReducer from './ramps'
import stakemarketReducer from './stakemarket'
import trustbountiesReducer from './trustbounties'
import acceleratorReducer from './accelerator'
import businessesReducer from './businesses'
import auditorsReducer from './auditors'
import bettingsReducer from './bettings'
import billsReducer from './bills'
import contributorsReducer from './contributors'
import futureCollateralsReducer from './futureCollaterals'
import cardsReducer from './cards'
import gamesReducer from './games'
import lotteriesReducer from './lotteries'
import referralsReducer from './referrals'
import sponsorsReducer from './sponsors'
import valuepoolsReducer from './valuepools'
import willsReducer from './wills'
import worldsReducer from './worlds'
import arpsReducer from './arps'
import globalReducer from './global/reducer'
import profileReducer from './profile'

const PERSISTED_KEYS: string[] = ['user', 'transactions']

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  blacklist: ['profile'],
  storage,
  version: 1,
}

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    global: globalReducer,
    farms: farmsReducer,
    pools: poolsReducer,
    lottery: lotteryReducer,
    pottery: potteryReducer,
    ramps: rampsReducer,
    stakemarket: stakemarketReducer,
    trustbounties: trustbountiesReducer,
    accelerator: acceleratorReducer,
    auditors: auditorsReducer,
    businesses: businessesReducer,
    bettings: bettingsReducer,
    bills: billsReducer,
    contributors: contributorsReducer,
    futureCollaterals: futureCollateralsReducer,
    cards: cardsReducer,
    games: gamesReducer,
    lotteries: lotteriesReducer,
    referrals: referralsReducer,
    sponsors: sponsorsReducer,
    valuepools: valuepoolsReducer,
    wills: willsReducer,
    worlds: worldsReducer,
    arps: arpsReducer,
    profile: profileReducer,

    // Exchange
    user,
    transactions,
  }),
)

// eslint-disable-next-line import/no-mutable-exports
let store: ReturnType<typeof makeStore>

export function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}

export const initializeStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = makeStore({
      ...store.getState(),
      ...preloadedState,
    })
    // Reset the current store
    store = undefined
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) {
    store = _store
  }

  return _store
}

store = initializeStore()

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store

export const persistor = persistStore(store, undefined, () => {
  store.dispatch(updateVersion())
})

export function useStore(initialState) {
  return useMemo(() => initializeStore(initialState), [initialState])
}
