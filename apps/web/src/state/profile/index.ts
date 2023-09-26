import { createSlice } from '@reduxjs/toolkit'
import { fetchProfiles } from './helpers'
import { resetUserState } from '../global/actions'
import { keyBy } from 'lodash'

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

const pools = []

export const fetchProfilesAsync =
  ({ chainId, init = false }) =>
  async (dispatch) => {
    try {
      const data = await fetchProfiles({ chainId })
      if (init) {
        dispatch(setInitialProfilesConfig(data || []))
      } else {
        dispatch(setProfilesPublicData(data || []))
      }
    } catch (error) {
      console.error('[Pools Action]profiles======>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Referrals',
  initialState,
  reducers: {
    setInitialProfilesConfig: (state, action) => {
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setProfilesPublicData: (state, action) => {
      const livePoolsSousIdMap = keyBy(action.payload, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
      state.userDataLoaded = true
    },
    setPoolsUserData: (state, action) => {
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
export const { setInitialProfilesConfig, setProfilesPublicData, setPoolsUserData, setCurrBribeData, setCurrPoolData } =
  PoolsSlice.actions

export default PoolsSlice.reducer
