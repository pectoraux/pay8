import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import keyBy from 'lodash/keyBy'
import { fetchPairs, fetchUserBalances } from './helpers'
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

export const fetchPairsAsync = () => async (dispatch) => {
  try {
    console.log('fetchPairs1================>')
    const pairs = await fetchPairs()
    console.log('fetchPairs================>', pairs)
    dispatch(setPairsPublicData(pairs || []))
  } catch (error) {
    console.error('[Pools Action]============> error when getting staking limits', error)
  }
}

export const fetchPoolsUserDataAsync = createAsyncThunk<{ sousId: number; stakingTokenBalance: any }[], string>(
  'pool/fetchPoolsUserData',
  async (account, { rejectWithValue }) => {
    try {
      const [stakingTokenBalances] = await Promise.all([fetchUserBalances(account)])
      console.log('stakingTokenBalances=============>', stakingTokenBalances)
      const userData = stakingTokenBalances || []
      return userData
    } catch (e) {
      return rejectWithValue(e)
    }
  },
)

export const PoolsSlice = createSlice({
  name: 'pools',
  initialState,
  reducers: {
    setPairsPublicData: (state, action) => {
      console.log('setPairsPublicData==============>', action.payload)
      state.data = [...action.payload]
    },
    setPairsUserData: (state, action) => {
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
    builder.addCase(fetchPoolsUserDataAsync.fulfilled, (state, action) => {
      const userData = action.payload
      const userDataSousIdMap = keyBy(userData, 'sousId')
      state.data = state.data.map((pool) => ({
        ...pool,
        userDataLoaded: true,
        userData: userDataSousIdMap[pool.sousId],
      }))
      state.userDataLoaded = true
    })
    builder.addCase(fetchPoolsUserDataAsync.rejected, (state, action) => {
      console.error('[Pools Action] Error fetching pool user data', action.payload)
    })
  },
})

// Actions
export const { setPairsPublicData, setPairsUserData, setCurrBribeData, setCurrPoolData } = PoolsSlice.actions

export default PoolsSlice.reducer
