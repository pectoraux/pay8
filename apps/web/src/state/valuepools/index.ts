import { isAddress } from 'utils'
import { createSlice } from '@reduxjs/toolkit'
import { LEVIATHANS } from 'config/constants/exchange'
import { fetchValuepools, getValuepoolsSg } from './helpers'
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

export const fetchValuepoolSgAsync =
  ({ fromVesting, fromValuepool }) =>
  async (dispatch) => {
    try {
      console.log('sgallva1==============>')
      const whereClause = isAddress(fromValuepool)
        ? {
            active: true,
            id_in: [fromValuepool?.toLowerCase()],
          }
        : fromVesting
        ? {
            active: true,
            id_in: LEVIATHANS,
          }
        : {
            active: true,
          }
      const valuepools = await getValuepoolsSg(0, 0, whereClause)
      const data = valuepools
      console.log('sgallva==============>', data)
      dispatch(setValuepoolsPublicData(data || []))
    } catch (error) {
      console.error('[Pools Action] error when getting valuepools from sg=================>', error)
    }
  }

export const fetchValuepoolsAsync =
  ({ fromVesting, fromValuepool }) =>
  async (dispatch) => {
    try {
      console.log('allva1==============>')
      const valuepools = await fetchValuepools({ fromVesting, fromValuepool })
      const data = valuepools
      console.log('allva==============>', data)
      dispatch(setValuepoolsPublicData(data || []))
    } catch (error) {
      console.error('[Pools Action] error when getting valuepools=================>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Valuepools',
  initialState,
  reducers: {
    setValuepoolsPublicData: (state, action) => {
      console.log('setValuepoolsPublicData==============>', action.payload)
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setValuepoolsUserData: (state, action) => {
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
export const { setValuepoolsPublicData, setValuepoolsUserData, setCurrBribeData, setCurrPoolData, setFilters } =
  PoolsSlice.actions

export default PoolsSlice.reducer
