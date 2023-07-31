import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import keyBy from 'lodash/keyBy'
import { fetchReferrals, fetchReferralsUserData } from './helpers'
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

export const fetchReferralGaugesAsync = () => async (dispatch) => {
  try {
    console.log('fetchReferrals1================>')
    const referrals = await fetchReferrals()
    console.log('fetchReferrals================>', referrals)
    const data = referrals
    dispatch(setReferralsPublicData(data || []))
    console.log('userData1================>', pools)
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits======>', error)
  }
}

export const fetchReferralsUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; bribes: any }[],
  { account: string }
>('pool/fetchPoolsUserData', async ({ account }, { rejectWithValue }) => {
  try {
    const allBribes = await fetchReferralsUserData(account, pools)
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
  name: 'Referrals',
  initialState,
  reducers: {
    setReferralsPublicData: (state, action) => {
      console.log('setReferralsPublicData==============>', action.payload)
      state.data = [...action.payload]
    },
    setReferralsUserData: (state, action) => {
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
    builder.addCase(fetchReferralsUserDataAsync.fulfilled, (state, action) => {
      const userData = action.payload
      const userDataSousIdMap = keyBy(userData, 'sousId')
      state.data = state.data.map((pool) => ({
        ...pool,
        userDataLoaded: true,
        userData: userDataSousIdMap[pool.sousId],
      }))
      state.userDataLoaded = true
    })
    builder.addCase(fetchReferralsUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
  },
})

// Actions
export const { setReferralsPublicData, setReferralsUserData, setCurrBribeData, setCurrPoolData } = PoolsSlice.actions

export default PoolsSlice.reducer