import { createSlice } from '@reduxjs/toolkit'
import { fetchProfiles } from './helpers'
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
const pools = []

export const fetchProfilesAsync = () => async (dispatch) => {
  try {
    console.log('fetchProfiles1================>')
    const data = await fetchProfiles()
    console.log('fetchProfiles================>', data)
    dispatch(setProfilesPublicData(data || []))
    console.log('userData1================>', pools)
  } catch (error) {
    console.error('[Pools Action]profiles======>', error)
  }
}

export const PoolsSlice = createSlice({
  name: 'Profiles',
  initialState,
  reducers: {
    setProfilesPublicData: (state, action) => {
      console.log('setProfilesPublicData==============>', action.payload)
      state.data = [...action.payload]
    },
    setProfileUserData: (state, action) => {
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
export const { setProfilesPublicData, setProfileUserData, setCurrBribeData, setCurrPoolData } = PoolsSlice.actions

export default PoolsSlice.reducer
