import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import keyBy from 'lodash/keyBy'
import { fetchBusinesses, fetchBusinessesUserData } from './helpers'
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

let pools = []

export const fetchBusinessGaugesAsync = () => async (dispatch) => {
  try {
    const businesses = await fetchBusinesses()
    const data = businesses
    dispatch(setBusinessesPublicData(data || []))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits======>', error)
  }
}

export const fetchBusinessesUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; bribes: any }[],
  { account: string }
>('pool/fetchPoolsUserData', async ({ account }, { rejectWithValue }) => {
  try {
    const allBribes = await fetchBusinessesUserData(account, pools)
    const userData = pools.map((pool) => ({
      sousId: parseInt(pool.sousId),
      allowance: 0,
      profileId: allBribes?.find((entry) => parseInt(entry.sousId) === parseInt(pool.sousId))?.profileId,
      // tokenIds: allBribes?.find((entry) => parseInt(entry.sousId) === parseInt(pool.sousId))?.tokenIds,
      bribes: allBribes?.find((entry) => parseInt(entry.sousId) === parseInt(pool.sousId))?.augmentedBribes,
    }))
    console.log('userData================>', userData)
    return userData
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const PoolsSlice = createSlice({
  name: 'Businesses',
  initialState,
  reducers: {
    setBusinessesPublicData: (state, action) => {
      console.log('setBusinessesPublicData==============>', action.payload)
      state.data = [...action.payload]
    },
    setBusinessesUserData: (state, action) => {
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
    builder.addCase(fetchBusinessesUserDataAsync.fulfilled, (state, action) => {
      const userData = action.payload
      const userDataSousIdMap = keyBy(userData, 'sousId')
      state.data = state.data.map((pool) => ({
        ...pool,
        userDataLoaded: true,
        userData: userDataSousIdMap[pool.sousId],
      }))
      state.userDataLoaded = true
    })
    builder.addCase(fetchBusinessesUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
  },
})

// Actions
export const { setBusinessesPublicData, setBusinessesUserData, setCurrBribeData, setCurrPoolData, setFilters } =
  PoolsSlice.actions

export default PoolsSlice.reducer
