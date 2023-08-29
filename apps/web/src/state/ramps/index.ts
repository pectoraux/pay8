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

import { fetchRamps, getAccountSg, fetchRampData, fetchRamp } from './helpers'
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

export const fetchRampsAsync = () => async (dispatch) => {
  try {
    const ramps = await fetchRamps()
    const data = ramps.filter((ramp) => !!ramp)
    dispatch(setRampsPublicData(data || []))
  } catch (error) {
    console.error('[Pools Action]===============>', error)
  }
}

export const fetchRampAsync = (rampAddress) => async (dispatch) => {
  try {
    const ramp = await fetchRamp(rampAddress)
    dispatch(setRampsPublicData([ramp] || []))
  } catch (error) {
    console.error('[Pools Action]=============> error when getting staking limits', error)
  }
}

export const fetchRampsUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[],
  string
>('pool/fetchPoolsUserData', async (account, { rejectWithValue }) => {
  try {
    const [accountData] = await Promise.all([getAccountSg(account, 'stripe')])
    const userData = []
    return userData
  } catch (e) {
    console.log('err fetchRampsUserDataAsync===============>', e)
    return rejectWithValue(e)
  }
})

export const updateRamp = createAsyncThunk<{ rampAddress: string; value: any }, { rampAddress: string }>(
  'pool/updateRamp',
  async ({ rampAddress }) => {
    const data = await fetchRampData(rampAddress)
    return { rampAddress, value: data }
  },
)

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
  name: 'Ramps',
  initialState,
  reducers: {
    setRampsPublicData: (state, action) => {
      state.data = [...action.payload]
    },
    setPoolUserData: (state, action) => {
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
    builder.addCase(
      fetchRampsUserDataAsync.fulfilled,
      (
        state,
        action: PayloadAction<
          { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[]
        >,
      ) => {
        const userData = action.payload
        const userDataSousIdMap = keyBy(userData, 'sousId')
        state.data = state.data.map((pool) => ({
          ...pool,
          userDataLoaded: true,
          userData: userDataSousIdMap[pool.sousId],
        }))
        state.userDataLoaded = true
      },
    )
    builder.addCase(fetchRampsUserDataAsync.rejected, (state, action) => {
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
    builder.addMatcher(
      isAnyOf(updateRamp.fulfilled),
      (state, action: PayloadAction<{ rampAddress: string; value: any }>) => {
        const { rampAddress, value } = action.payload
        const index = state.data.findIndex((p: any) => p.rampAddress === rampAddress)
        state.data[index] = { ...value, ...state.data[index] }
      },
    )
  },
})

// Actions
export const { setRampsPublicData, setCurrBribeData, setPoolUserData, setCurrPoolData, setFilters } = PoolsSlice.actions

export default PoolsSlice.reducer
