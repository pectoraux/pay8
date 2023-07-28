import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import keyBy from 'lodash/keyBy'
import { fetchBounties } from './helpers'
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

export const fetchBountiesAsync =
  ({ fromAccelerator, fromContributors, fromSponsors, fromAuditors, fromBusinesses, fromRamps, fromTransfers }) =>
  async (dispatch) => {
    try {
      console.log('fetchBounties1================>')
      const trustbounties = await fetchBounties(
        0,
        fromAccelerator,
        fromContributors,
        fromSponsors,
        fromAuditors,
        fromBusinesses,
        fromRamps,
        fromTransfers,
      )
      console.log('fetchBounties================>', trustbounties)
      dispatch(setBountiesPublicData(trustbounties || []))
    } catch (error) {
      console.error('[Pools Action] error when getting staking limits', error)
    }
  }

export const fetchBountiesUserDataAsync = createAsyncThunk<{ sousId: number; allowance: any }[], string>(
  'pool/fetchPoolsUserData',
  async (account, { rejectWithValue }) => {
    try {
      console.log('allProtocolIds1==============>')
      const allProtocolIds = [] // await fetchBountiesUserData(account)
      console.log('allProtocolIds==============>', allProtocolIds)
      return allProtocolIds
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const updateUserAllowance = createAsyncThunk<
  { value: any; sousId: any; field: any },
  { value: any; sousId: any; field: any }
>('pool/updateUserAllowance', async ({ value, sousId, field }) => {
  // const allowances = await fetchPoolsAllowance(account)
  // return { sousId, field: 'allowance', value: allowances[sousId] }
  return {
    value,
    sousId,
    field,
  }
})

export const updateUserBalance = createAsyncThunk<{ value: any; sousId: any; field: any }, { value: any; sousId: any }>(
  'pool/updateUserBalance',
  async ({ value, sousId }) => {
    // const allowances = await fetchPoolsAllowance(account)
    // return { sousId, field: 'allowance', value: allowances[sousId] }
    return {
      value,
      sousId,
      field: 'user',
    }
  },
)

export const updateUserStakedBalance = createAsyncThunk<
  { value: any; sousId: any; field: any },
  { value: any; sousId: any; field: any }
>('pool/updateUserStakedBalance', async ({ value, sousId, field }) => {
  // const allowances = await fetchPoolsAllowance(account)
  // return { sousId, field: 'allowance', value: allowances[sousId] }
  return {
    value,
    sousId,
    field,
  }
})

export const updateUserPendingReward = createAsyncThunk<
  { value: any; sousId: any; field: any },
  { value: any; sousId: any; field: any }
>('pool/updateUserPendingReward', async ({ value, sousId, field }) => {
  // const allowances = await fetchPoolsAllowance(account)
  // return { sousId, field: 'allowance', value: allowances[sousId] }
  return {
    value,
    sousId,
    field,
  }
})

export const PoolsSlice = createSlice({
  name: 'Bounties',
  initialState,
  reducers: {
    setBountiesPublicData: (state, action) => {
      console.log('setBountiesPublicData==============>', action.payload)
      state.data = [...action.payload]
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
    builder.addCase(fetchBountiesUserDataAsync.fulfilled, (state, action) => {
      const userData = action.payload
      const userDataSousIdMap = keyBy(userData, 'sousId')
      state.data = state.data.map((pool) => ({
        ...pool,
        userDataLoaded: true,
        userData: userDataSousIdMap[pool.sousId],
      }))
      state.userDataLoaded = true
    })
    builder.addCase(fetchBountiesUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
    builder.addMatcher(
      isAnyOf(
        updateUserAllowance.fulfilled,
        updateUserBalance.fulfilled,
        updateUserStakedBalance.fulfilled,
        updateUserPendingReward.fulfilled,
      ),
      (state, action: PayloadAction<{ sousId: number; field: string; value: any }>) => {
        const { field, value, sousId } = action.payload
        const index = state.data.findIndex((p) => p.sousId === sousId)

        if (index >= 0) {
          state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
        }
      },
    )
  },
})

// Actions
export const { setBountiesPublicData, setCurrBribeData, setCurrPoolData } = PoolsSlice.actions

export default PoolsSlice.reducer
