import { createSlice } from '@reduxjs/toolkit'
import { fetchFutureCollaterals, getCollaterals } from './helpers'
import { resetUserState } from '../global/actions'
import { isAddress } from 'utils'

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

export const fetchFutureCollateralSgAsync =
  ({ fromFutureCollateral }) =>
  async (dispatch) => {
    try {
      console.log('fetchFutureCollateralSg1================>')
      const whereClause = isAddress(fromFutureCollateral)
        ? {
            // active: true,
            id_in: [fromFutureCollateral?.toLowerCase()],
          }
        : {
            // active: true
          }
      const futureCollaterals = await getCollaterals(0, 0, whereClause)
      console.log('fetchFutureCollateralSg================>', futureCollaterals)
      dispatch(setFutureCollateralsPublicData(futureCollaterals || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchFutureCollateralsAsync =
  ({ fromFutureCollateral }) =>
  async (dispatch) => {
    console.log('fetchFutureCollaterals1================>', fromFutureCollateral)
    try {
      const futureCollaterals = await fetchFutureCollaterals({ fromFutureCollateral })
      console.log('fetchFutureCollaterals================>', futureCollaterals)
      dispatch(setFutureCollateralsPublicData(futureCollaterals || []))
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Collaterals',
  initialState,
  reducers: {
    setFutureCollateralsPublicData: (state, action) => {
      console.log('setContributorsPublicData==============>', action.payload)
      state.data = [...action.payload]
    },
    setFutureCollateralsUserData: (state, action) => {
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
export const { setFutureCollateralsPublicData, setFutureCollateralsUserData, setCurrBribeData, setCurrPoolData } =
  PoolsSlice.actions

export default PoolsSlice.reducer