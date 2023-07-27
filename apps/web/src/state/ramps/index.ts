import { createAsyncThunk, createSlice, PayloadAction, isAnyOf } from '@reduxjs/toolkit'
import BigNumber from 'bignumber.js'
import keyBy from 'lodash/keyBy'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { bscTokens } from '@pancakeswap/tokens'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { fetchTokenUSDValue } from '@pancakeswap/utils/llamaPrice'
import {
  fetchPoolsTimeLimits,
  fetchPoolsTotalStaking,
  fetchPoolsProfileRequirement,
  fetchPoolsStakingLimits,
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserPendingRewards,
  fetchUserStakeBalances,
  fetchPublicIfoData,
  fetchUserIfoCredit,
  fetchPublicVaultData,
  fetchPublicFlexibleSideVaultData,
  fetchVaultUser,
  fetchVaultFees,
  fetchFlexibleSideVaultUser,
  getCakeVaultAddress,
  getCakeFlexibleSideVaultAddress,
  getPoolsConfig,
  isLegacyPool,
  getPoolAprByTokenPerSecond,
  getPoolAprByTokenPerBlock,
} from '@pancakeswap/pools'
import { ChainId } from '@pancakeswap/sdk'

import {
  PoolsState,
  SerializedPool,
  SerializedVaultFees,
  SerializedCakeVault,
  SerializedLockedVaultUser,
  PublicIfoData,
  SerializedVaultUser,
  SerializedLockedCakeVault,
} from 'state/types'
import { Address, erc20ABI } from 'wagmi'
import { isAddress } from 'utils'
import { publicClient } from 'utils/wagmi'
import { getViemClients } from 'utils/viem'
import { getPoolsPriceHelperLpFiles } from 'config/constants/priceHelperLps/index'
import { farmV3ApiFetch } from 'state/farmsV3/hooks'
import { getCakePriceFromOracle } from 'hooks/useCakePriceAsBN'

import fetchFarms from '../farms/fetchFarms'
import getFarmsPrices from '../farms/getFarmsPrices'
import { fetchRamps, getAccountSg, fetchRampData } from './helpers'
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
    console.log('fetchBusinesses1================>')
    const ramps = await fetchRamps()
    const data = ramps.filter((ramp) => !!ramp)
    console.log('fetchBusinesses================>', data, ramps)
    dispatch(setRampsPublicData(data || []))
  } catch (error) {
    console.error('[Pools Action]===============>', error)
  }
}

export const fetchRampsUserDataAsync = createAsyncThunk<
  { sousId: number; allowance: any; stakingTokenBalance: any; stakedBalance: any; pendingReward: any }[],
  string
>('pool/fetchPoolsUserData', async (account, { rejectWithValue }) => {
  try {
    console.log('fetchRampsUserDataAsync1===============>', account)
    const [accountData] = await Promise.all([getAccountSg(account, 'stripe')])
    console.log('fetchRampsUserDataAsync===============>', accountData)
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
    setPoolsPublicData: (state, action) => {
      const livePoolsData: SerializedPool[] = action.payload
      const livePoolsSousIdMap = keyBy(livePoolsData, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
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
export const { setRampsPublicData, setPoolsPublicData, setPoolUserData } = PoolsSlice.actions

export default PoolsSlice.reducer
