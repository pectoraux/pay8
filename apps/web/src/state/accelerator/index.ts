import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import keyBy from 'lodash/keyBy'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
} from '@pancakeswap/pools'
import { ChainId } from '@pancakeswap/sdk'

import { getViemClients } from 'utils/viem'
import { fetchAccelerator, fetchAcceleratorUserData } from './helpers'
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

export const fetchAcceleratorGaugesAsync = () => async (dispatch) => {
  try {
    const businesses = await fetchAccelerator()
    const data = businesses
    dispatch(setAcceleratorPublicData(data || []))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits======>', error)
  }
}

export const fetchAcceleratorUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; bribes: any }[],
  { account: string }
>('pool/fetchPoolsUserData', async ({ account }, { rejectWithValue }) => {
  try {
    const allBribes = await fetchAcceleratorUserData(account, pools)
    const userData = pools.map((pool) => ({
      sousId: parseInt(pool.sousId),
      allowance: 0,
      profileId: allBribes?.find((entry) => parseInt(entry.sousId) === parseInt(pool.sousId))?.profileId,
      tokenIds: allBribes?.find((entry) => parseInt(entry.sousId) === parseInt(pool.sousId))?.tokenIds,
      bribes: allBribes?.find((entry) => parseInt(entry.sousId) === parseInt(pool.sousId))?.augmentedBribes,
    }))
    return userData
  } catch (e) {
    return rejectWithValue(e)
  }
})

export const updateUserAllowance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserAllowance', async ({ sousId, account, chainId }) => {
  const allowances = await fetchPoolsAllowance({ account, chainId, provider: getViemClients })
  return { sousId, field: 'allowance', value: allowances[sousId] }
})

export const updateUserBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserBalance', async ({ sousId, account, chainId }) => {
  const tokenBalances = await fetchUserBalances({ account, chainId, provider: getViemClients })
  return { sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }
})

export const updateUserStakedBalance = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserStakedBalance', async ({ sousId, account, chainId }) => {
  const stakedBalances = await fetchUserStakeBalances({ account, chainId, provider: getViemClients })
  return { sousId, field: 'stakedBalance', value: stakedBalances[sousId] }
})

export const updateUserPendingReward = createAsyncThunk<
  { sousId: number; field: string; value: any },
  { sousId: number; account: string; chainId: ChainId }
>('pool/updateUserPendingReward', async ({ sousId, account, chainId }) => {
  const pendingRewards = await fetchUserPendingRewards({ chainId, account, provider: getViemClients })
  return { sousId, field: 'pendingReward', value: pendingRewards[sousId] }
})

export const PoolsSlice = createSlice({
  name: 'Accelerator',
  initialState,
  reducers: {
    setAcceleratorPublicData: (state, action) => {
      state.data = [...action.payload]
      pools = [...action.payload]
    },
    setAcceleratorUserData: (state, action) => {
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
    builder.addCase(fetchAcceleratorUserDataAsync.fulfilled, (state, action) => {
      const userData = action.payload
      const userDataSousIdMap = keyBy(userData, 'sousId')
      state.data = state.data.map((pool) => ({
        ...pool,
        userDataLoaded: true,
        userData: userDataSousIdMap[pool.sousId],
      }))
      state.userDataLoaded = true
    })
    builder.addCase(fetchAcceleratorUserDataAsync.rejected, (state, action) => {
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
export const { setAcceleratorPublicData, setCurrBribeData, setAcceleratorUserData, setCurrPoolData, setFilters } =
  PoolsSlice.actions

export default PoolsSlice.reducer
