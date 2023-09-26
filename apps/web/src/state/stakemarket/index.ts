import { createSlice } from '@reduxjs/toolkit'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { fetchStakes } from './helpers'
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

export const fetchStakesAsync =
  (collectionId, chainId, init = false) =>
  async (dispatch) => {
    try {
      const stakes = await fetchStakes(collectionId, chainId)
      const reconstructedData = stakes
        .filter(
          (stake) => stake.tokenAddress !== ADDRESS_ZERO && parseInt(stake.sousId) === parseInt(stake.parentStakeId),
        )
        .reduce((resultArray, stake1) => {
          const partnerData = stakes.filter((stake2) => stake1.partnerStakeIds.includes(stake2.sousId.toString()))
          const applications = stake1?.applicationsConverted?.map((appId) =>
            stakes.find((stake2) => parseInt(stake2.sousId) === parseInt(appId)),
          )
          resultArray.push({
            ...stake1,
            partnerData,
            applications,
          })

          return resultArray
        }, [])
      const data = reconstructedData?.filter((d) => !d.appliedTo)
      if (init) {
        dispatch(setInitialStakesConfig(data || []))
      } else {
        dispatch(setStakesPublicData(data || []))
      }
    } catch (error) {
      console.error('[Pools Action]========> error when getting stakes', error)
    }
  }

export const PoolsSlice = createSlice({
  name: 'StakeMarket',
  initialState,
  reducers: {
    setInitialStakesConfig: (state, action) => {
      state.data = [...action.payload]
      state.userDataLoaded = true
    },
    setStakesPublicData: (state, action) => {
      const livePoolsSousIdMap = keyBy(action.payload, 'sousId')
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsSousIdMap[pool.sousId]
        return { ...pool, ...livePoolData }
      })
      state.userDataLoaded = true
    },
    setStakesUserData: (state, action) => {
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
  },
})

// Actions
export const {
  setInitialStakesConfig,
  setStakesPublicData,
  setStakesUserData,
  setCurrBribeData,
  setCurrPoolData,
  setFilters,
} = PoolsSlice.actions

export default PoolsSlice.reducer
