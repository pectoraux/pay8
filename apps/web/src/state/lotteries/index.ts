import { createSlice } from '@reduxjs/toolkit'
import { fetchLotteries, getLotteries } from './helpers'
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

export const fetchLotteriesSgAsync =
  ({ fromLottery }) =>
  async (dispatch) => {
    try {
      console.log('fetchLotterySg1================>')
      const whereClause = isAddress(fromLottery)
        ? {
            // active: true,
            id_in: [fromLottery?.toLowerCase()],
          }
        : {
            // active: true
          }
      const lotteries = await getLotteries(0, 0, whereClause)
      console.log('fetchLotterySg================>', lotteries)
      dispatch(setLotteriesPublicData(lotteries || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchLotteriesAsync =
  ({ fromLottery }) =>
  async (dispatch) => {
    console.log('fetchLottery1================>', fromLottery)
    try {
      const lotteries = await fetchLotteries({ fromLottery })
      console.log('fetchLottery================>', lotteries)
      dispatch(setLotteriesPublicData(lotteries || []))
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Lotteries',
  initialState,
  reducers: {
    setLotteriesPublicData: (state, action) => {
      console.log('setContributorsPublicData==============>', action.payload)
      state.data = [...action.payload]
    },
    setLotteriesUserData: (state, action) => {
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
export const { setLotteriesPublicData, setLotteriesUserData, setCurrBribeData, setCurrPoolData } = PoolsSlice.actions

export default PoolsSlice.reducer