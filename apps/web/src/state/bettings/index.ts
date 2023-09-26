import { createSlice } from '@reduxjs/toolkit'
import { getBettings, fetchBettings } from './helpers'
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

export const fetchBettingSgAsync =
  ({ fromBetting, init = false }) =>
  async (dispatch) => {
    try {
      const whereClause = isAddress(fromBetting)
        ? {
            // active: true,
            id_in: [fromBetting?.toLowerCase()],
          }
        : {
            // active: true
          }
      const bettings = await getBettings(0, 0, whereClause)
      dispatch(setBettingsPublicData(bettings || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchBettingsAsync =
  ({ fromBetting, chainId, init = false }) =>
  async (dispatch) => {
    try {
      const bettings = await fetchBettings({ fromBetting, chainId })
      if (init) {
        dispatch(setInitialBettingsConfig(bettings || []))
      } else {
        dispatch(setBettingsPublicData(bettings || []))
      }
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Bettings',
  initialState,
  reducers: {
    setInitialBettingsConfig: (state, action) => {
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setBettingsPublicData: (state, action) => {
      const livePoolsSousIdMap = keyBy(action.payload, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
      state.userDataLoaded = true
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
export const { setInitialBettingsConfig, setBettingsPublicData, setCurrBribeData, setCurrPoolData, setFilters } =
  PoolsSlice.actions

export default PoolsSlice.reducer
