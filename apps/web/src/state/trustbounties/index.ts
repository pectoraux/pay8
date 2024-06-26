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
  ({
    collectionId,
    fromAccelerator,
    fromContributors,
    fromSponsors,
    fromAuditors,
    fromBusinesses,
    fromRamps,
    fromTransfers,
    chainId,
    init = false,
  }) =>
  async (dispatch) => {
    try {
      const trustbounties = await fetchBounties(
        collectionId,
        fromAccelerator,
        fromContributors,
        fromSponsors,
        fromAuditors,
        fromBusinesses,
        fromRamps,
        fromTransfers,
        chainId,
      )
      if (init) {
        dispatch(setInitialBountiesConfig(trustbounties || []))
      } else {
        dispatch(setBountiesPublicData(trustbounties || []))
      }
    } catch (error) {
      console.error('[Pools Action] error when getting bounties', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Bounties',
  initialState,
  reducers: {
    setInitialBountiesConfig: (state, action) => {
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setBountiesPublicData: (state, action) => {
      const livePoolsSousIdMap = keyBy(action.payload, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
      state.userDataLoaded = true
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
export const { setInitialBountiesConfig, setBountiesPublicData, setCurrBribeData, setCurrPoolData, setFilters } =
  PoolsSlice.actions

export default PoolsSlice.reducer
