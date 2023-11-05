import { isAddress } from 'utils'
import { createSlice } from '@reduxjs/toolkit'
import { getCards, fetchCards } from './helpers'
import { resetUserState } from '../global/actions'
import { keyBy } from 'lodash'

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

export const fetchCardSgAsync =
  ({ fromCard }) =>
  async (dispatch) => {
    try {
      const whereClause = isAddress(fromCard)
        ? {
            // active: true,
            id_in: [fromCard?.toLowerCase()],
          }
        : {
            // active: true
          }
      const cards = await getCards(0, 0, whereClause)
      dispatch(setCardsPublicData(cards || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchCardsAsync =
  ({ fromCard, chainId, init = false }) =>
  async (dispatch) => {
    try {
      const cards = await fetchCards({ fromCard, chainId })
      if (init) {
        dispatch(setInitialCardsConfig(cards || []))
      } else {
        dispatch(setCardsPublicData(cards || []))
      }
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Cards',
  initialState,
  reducers: {
    setInitialCardsConfig: (state, action) => {
      state.data = [...action.payload]
      console.log('state.data=================>', state.data)
      state.userDataLoaded = true
    },
    setCardsPublicData: (state, action) => {
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
export const { setInitialCardsConfig, setCardsPublicData, setCurrBribeData, setCurrPoolData } = PoolsSlice.actions

export default PoolsSlice.reducer
