import { createSlice } from '@reduxjs/toolkit'
import { getArps, fetchArps } from './helpers'
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

export const fetchArpSgAsync =
  ({ fromArp }) =>
  async (dispatch) => {
    try {
      const whereClause = isAddress(fromArp)
        ? {
            // active: true,
            id_in: [fromArp?.toLowerCase()],
          }
        : {
            // active: true
          }
      const arps = await getArps(0, 0, whereClause)
      dispatch(setArpsPublicData(arps || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchArpsAsync =
  ({ fromArp }) =>
  async (dispatch) => {
    try {
      const arps = await fetchArps({ fromArp })
      dispatch(setArpsPublicData(arps || []))
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'ARPs',
  initialState,
  reducers: {
    setArpsPublicData: (state, action) => {
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
export const { setArpsPublicData, setCurrBribeData, setCurrPoolData, setFilters } = PoolsSlice.actions

export default PoolsSlice.reducer
