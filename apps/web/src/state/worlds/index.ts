import { createSlice } from '@reduxjs/toolkit'
import { fetchWorlds } from './helpers'
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

export const fetchWorldsAsync = () => async (dispatch) => {
  try {
    console.log('fetchWorlds1================>')
    const worlds = await fetchWorlds()
    console.log('fetchWorld================>', worlds)
    dispatch(setWorldsPublicData(worlds || []))
  } catch (error) {
    console.error('[Pools Action]============> error when getting worlds', error)
  }
}

export const PoolsSlice = createSlice({
  name: 'Worlds',
  initialState,
  reducers: {
    setWorldsPublicData: (state, action) => {
      console.log('setWorldsPublicData==============>', action.payload)
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setWorldsUserData: (state, action) => {
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
export const { setWorldsPublicData, setWorldsUserData, setCurrBribeData, setCurrPoolData, setFilters } =
  PoolsSlice.actions

export default PoolsSlice.reducer
