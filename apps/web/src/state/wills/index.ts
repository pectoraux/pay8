import { keyBy } from 'lodash'
import { isAddress } from 'utils'
import { createSlice } from '@reduxjs/toolkit'
import { fetchWills, getWills } from './helpers'
import { resetUserState } from '../global/actions'

export const initialFilterState = Object.freeze({
  workspace: null,
  country: null,
  city: null,
})

const initialState: any = {
  data: [],
  userDataLoaded: false,
  apiData: [],
  filters: initialFilterState,
  currBribe: {},
  currPool: {},
}

export const fetchWillSgAsync =
  ({ fromWill }) =>
  async (dispatch) => {
    try {
      const whereClause = isAddress(fromWill)
        ? {
            // active: true,
            id_in: [fromWill?.toLowerCase()],
          }
        : {
            // active: true
          }
      const wills = await getWills(0, 0, whereClause)
      dispatch(setWillsPublicData(wills || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchWillsAsync =
  ({ fromWill, chainId, init = false }) =>
  async (dispatch) => {
    try {
      const wills = await fetchWills({ fromWill, chainId })
      if (init) {
        dispatch(setInitialWillsConfig(wills || []))
      } else {
        dispatch(setWillsPublicData(wills || []))
      }
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Wills',
  initialState,
  reducers: {
    setInitialWillsConfig: (state, action) => {
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setWillsPublicData: (state, action) => {
      const livePoolsSousIdMap = keyBy(action.payload, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
      state.userDataLoaded = true
    },
    setWillsUserData: (state, action) => {
      const { sousId } = action.payload
      state.data = state.data.map((pool) => {
        if (pool.sousId === sousId) {
          return { ...pool, userDataLoaded: true, userData: action.payload.data }
        }
        return pool
      })
    },
    setCurrBribeData: (state, action) => {
      state.currBribe = action.payload
    },
    setCurrPoolData: (state, action) => {
      state.currPool = action.payload
    },
    setFilters: (state, action) => {
      state.filters = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      state.data = state.data.map(({ userData, ...pool }) => {
        return { ...pool }
      })
      state.userDataLoaded = false
    })
  },
})

// Actions
export const {
  setInitialWillsConfig,
  setWillsPublicData,
  setWillsUserData,
  setCurrBribeData,
  setCurrPoolData,
  setFilters,
} = PoolsSlice.actions

export default PoolsSlice.reducer
