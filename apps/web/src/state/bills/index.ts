import { createSlice } from '@reduxjs/toolkit'
import { getBills, fetchBills } from './helpers'
import { resetUserState } from '../global/actions'
import { isAddress } from 'utils'

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
  ({ fromBill }) =>
  async (dispatch) => {
    try {
      const bills = await fetchBills({ fromBill })
      dispatch(setBillsPublicData(bills || []))
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Bills',
  initialState,
  reducers: {
    setBillsPublicData: (state, action) => {
      state.data = [...action.payload]
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
export const { setBillsPublicData, setCurrBribeData, setCurrPoolData, setFilters } = PoolsSlice.actions

export default PoolsSlice.reducer
