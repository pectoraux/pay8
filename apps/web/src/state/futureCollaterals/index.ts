import { createSlice } from '@reduxjs/toolkit'
import { fetchFutureCollaterals, getCollaterals } from './helpers'
import { resetUserState } from '../global/actions'
import { isAddress } from 'utils'
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

let pools = []

export const fetchFutureCollateralSgAsync =
  ({ fromFutureCollateral }) =>
  async (dispatch) => {
    try {
      const whereClause = isAddress(fromFutureCollateral)
        ? {
            // active: true,
            id_in: [fromFutureCollateral?.toLowerCase()],
          }
        : {
            // active: true
          }
      const futureCollaterals = await getCollaterals(0, 0, whereClause)
      dispatch(setFutureCollateralsPublicData(futureCollaterals || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchFutureCollateralsAsync =
  ({ fromFutureCollateral, chainId, init = false }) =>
  async (dispatch) => {
    try {
      const futureCollaterals = await fetchFutureCollaterals({ fromFutureCollateral, chainId })
      if (init) {
        dispatch(setInitialFutureCollateralsConfig(futureCollaterals || []))
      } else {
        dispatch(setFutureCollateralsPublicData(futureCollaterals || []))
      }
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Collaterals',
  initialState,
  reducers: {
    setInitialFutureCollateralsConfig: (state, action) => {
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setFutureCollateralsPublicData: (state, action) => {
      const livePoolsSousIdMap = keyBy(action.payload, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
      state.userDataLoaded = true
    },
    setFutureCollateralsUserData: (state, action) => {
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
  setInitialFutureCollateralsConfig,
  setFutureCollateralsPublicData,
  setFutureCollateralsUserData,
  setCurrBribeData,
  setCurrPoolData,
  setFilters,
} = PoolsSlice.actions

export default PoolsSlice.reducer
