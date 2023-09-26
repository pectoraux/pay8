import { createSlice } from '@reduxjs/toolkit'
import { getBills, fetchBills } from './helpers'
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

export const fetchBillSgAsync =
  ({ fromBill }) =>
  async (dispatch) => {
    try {
      const whereClause = isAddress(fromBill)
        ? {
            // active: true,
            id_in: [fromBill?.toLowerCase()],
          }
        : {
            // active: true
          }
      const bills = await getBills(0, 0, whereClause)
      dispatch(setBillsPublicData(bills || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchBillsAsync =
  ({ fromBill, chainId, init = false }) =>
  async (dispatch) => {
    try {
      const bills = await fetchBills({ fromBill, chainId })
      if (init) {
        dispatch(setInitialBillsConfig(bills || []))
      } else {
        dispatch(setBillsPublicData(bills || []))
      }
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Bills',
  initialState,
  reducers: {
    setInitialBillsConfig: (state, action) => {
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setBillsPublicData: (state, action) => {
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
export const { setInitialBillsConfig, setBillsPublicData, setCurrBribeData, setCurrPoolData, setFilters } =
  PoolsSlice.actions

export default PoolsSlice.reducer
