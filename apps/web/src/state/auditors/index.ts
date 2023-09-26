import { createSlice } from '@reduxjs/toolkit'
import { getAuditors, fetchAuditors } from './helpers'
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

export const fetchAuditorSgAsync =
  ({ fromAuditor }) =>
  async (dispatch) => {
    try {
      console.log('fetchAuditorSg1================>')
      const whereClause = isAddress(fromAuditor)
        ? {
            // active: true,
            id_in: [fromAuditor?.toLowerCase()],
          }
        : {
            // active: true
          }
      const auditors = await getAuditors(0, 0, whereClause)
      console.log('fetchAuditorSg================>', auditors)
      dispatch(setAuditorsPublicData(auditors || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchAuditorsAsync =
  ({ fromAuditor, chainId, init = false }) =>
  async (dispatch) => {
    console.log('fetchAuditors1================>', fromAuditor)
    try {
      const auditors = await fetchAuditors({ fromAuditor, chainId })
      console.log('fetchAuditors================>', auditors)
      if (init) {
        dispatch(setInitialAuditorsConfig(auditors || []))
      } else {
        dispatch(setAuditorsPublicData(auditors || []))
      }
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Auditors',
  initialState,
  reducers: {
    setInitialAuditorsConfig: (state, action) => {
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setAuditorsPublicData: (state, action) => {
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
export const { setInitialAuditorsConfig, setAuditorsPublicData, setCurrBribeData, setCurrPoolData, setFilters } =
  PoolsSlice.actions

export default PoolsSlice.reducer
