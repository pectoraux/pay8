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
    fromAccelerator,
    fromContributors,
    fromSponsors,
    fromAuditors,
    fromBusinesses,
    fromRamps,
    fromTransfers,
    chainId,
  }) =>
  async (dispatch) => {
    try {
      const trustbounties = await fetchBounties(
        0,
        fromAccelerator,
        fromContributors,
        fromSponsors,
        fromAuditors,
        fromBusinesses,
        fromRamps,
        fromTransfers,
        chainId,
      )
      dispatch(setBountiesPublicData(trustbounties || []))
    } catch (error) {
      console.error('[Pools Action] error when getting bounties', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Bounties',
  initialState,
  reducers: {
    setBountiesPublicData: (state, action) => {
      console.log('setBountiesPublicData==============>', action.payload)
      state.data = [...action.payload]
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
export const { setBountiesPublicData, setCurrBribeData, setCurrPoolData, setFilters } = PoolsSlice.actions

export default PoolsSlice.reducer
