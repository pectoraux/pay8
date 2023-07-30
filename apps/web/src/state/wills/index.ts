import { isAddress } from 'utils'
import { createSlice } from '@reduxjs/toolkit'
import { fetchWills, getWills } from './helpers'
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

export const fetchWillSgAsync =
  ({ fromWill }) =>
  async (dispatch) => {
    try {
      console.log('fetchWillSg1================>')
      const whereClause = isAddress(fromWill)
        ? {
            // active: true,
            id_in: [fromWill?.toLowerCase()],
          }
        : {
            // active: true
          }
      const wills = await getWills(0, 0, whereClause)
      console.log('fetchWillSg================>', wills)
      dispatch(setWillsPublicData(wills || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchWillsAsync =
  ({ fromWill }) =>
  async (dispatch) => {
    console.log('fetchWills1================>', fromWill)
    try {
      const wills = await fetchWills({ fromWill })
      console.log('fetchWills================>', wills)
      dispatch(setWillsPublicData(wills || []))
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Wills',
  initialState,
  reducers: {
    setWillsPublicData: (state, action) => {
      console.log('setWillsPublicData==============>', action.payload)
      state.data = [...action.payload]
    },
    setWillsUserData: (state, action) => {
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
export const { setWillsPublicData, setWillsUserData, setCurrBribeData, setCurrPoolData } = PoolsSlice.actions

export default PoolsSlice.reducer
