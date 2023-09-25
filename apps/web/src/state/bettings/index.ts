import { createSlice } from '@reduxjs/toolkit'
import { getBettings, fetchBettings } from './helpers'
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

export const fetchBettingSgAsync =
  ({ fromBetting }) =>
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
  ({ fromBetting, chainId }) =>
  async (dispatch) => {
    try {
      const bettings = await fetchBettings({ fromBetting, chainId })
      dispatch(setBettingsPublicData(bettings || []))
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Bettings',
  initialState,
  reducers: {
    setBettingsPublicData: (state, action) => {
      state.data = [...action.payload]
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
export const { setBettingsPublicData, setCurrBribeData, setCurrPoolData, setFilters } = PoolsSlice.actions

export default PoolsSlice.reducer
