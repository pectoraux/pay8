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
      console.log('fetchBettingSg1================>')
      const whereClause = isAddress(fromBetting)
        ? {
            // active: true,
            id_in: [fromBetting?.toLowerCase()],
          }
        : {
            // active: true
          }
      const bettings = await getBettings(0, 0, whereClause)
      console.log('fetchBettingSg================>', bettings)
      dispatch(setBettingsPublicData(bettings || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchBettingsAsync =
  ({ fromBetting }) =>
  async (dispatch) => {
    console.log('fetchBettings1================>', fromBetting)
    try {
      const bettings = await fetchBettings({ fromBetting })
      console.log('fetchBettings================>', bettings)
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
      console.log('setBettingsPublicData==============>', action.payload)
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
export const { setBettingsPublicData, setCurrBribeData, setCurrPoolData, setFilters } = PoolsSlice.actions

export default PoolsSlice.reducer
