import { isAddress } from 'utils'
import { createSlice } from '@reduxjs/toolkit'
import { fetchGame, fetchGames, getGames } from './helpers'
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

export const fetchGameSgAsync =
  ({ fromGame }) =>
  async (dispatch) => {
    try {
      console.log('fetchGameSg1================>')
      const whereClause = isAddress(fromGame)
        ? {
            // active: true,
            id_in: [fromGame?.toLowerCase()],
          }
        : {
            // active: true
          }
      const games = await getGames(0, 0, whereClause)
      console.log('fetchGameSg================>', games)
      dispatch(setGamesPublicData(games || []))
    } catch (error) {
      console.error('[Pools Action]============>sg', error)
    }
  }

export const fetchGamesAsync =
  ({ fromGame }) =>
  async (dispatch) => {
    console.log('fetchGames1================>', fromGame)
    try {
      const games = await fetchGames({ fromGame })
      console.log('fetchGames================>', games)
      dispatch(setGamesPublicData(games || []))
    } catch (error) {
      console.error('[Pools Action]============>', error)
    }
  }

export const fetchGameAsync = (gameAddress) => async (dispatch) => {
  try {
    console.log('fetchBusinesses1================>', gameAddress)
    const game = await fetchGame(gameAddress)
    console.log('fetchBusinesses================>', game, gameAddress)
    dispatch(setGamesPublicData([game] || []))
  } catch (error) {
    console.error('[Pools Action] error when getting staking limits', error)
  }
}

export const PoolsSlice = createSlice({
  name: 'Games',
  initialState,
  reducers: {
    setGamesPublicData: (state, action) => {
      console.log('setContributorsPublicData==============>', action.payload)
      state.data = [...action.payload]
    },
    setGameUserData: (state, action) => {
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
export const { setGamesPublicData, setGameUserData, setCurrBribeData, setCurrPoolData } = PoolsSlice.actions

export default PoolsSlice.reducer
