import { isAddress } from 'utils'
import { createSlice } from '@reduxjs/toolkit'
import { getCards, fetchCards } from './helpers'
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

export const fetchCardSgAsync =
  ({ fromCard }) =>
  async (dispatch) => {
    try {
      console.log('fetchCardSg1================>')
      const whereClause = isAddress(fromCard)
        ? {
            // active: true,
            id_in: [fromCard?.toLowerCase()],
          }
        : {
            // active: true
          }
      const cards = await getCards(0, 0, whereClause)
      console.log('fetchCardSg================>', cards)
      dispatch(setCardsPublicData(cards || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchCardsAsync =
  ({ fromCard }) =>
  async (dispatch) => {
    console.log('fetchCards1================>', fromCard)
    try {
      const cards = await fetchCards({ fromCard })
      console.log('fetchCards================>', cards)
      dispatch(setCardsPublicData(cards || []))
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'Cards',
  initialState,
  reducers: {
    setCardsPublicData: (state, action) => {
      console.log('setCardsPublicData==============>', action.payload)
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
  },
})

// Actions
export const { setCardsPublicData, setCurrBribeData, setCurrPoolData } = PoolsSlice.actions

export default PoolsSlice.reducer
