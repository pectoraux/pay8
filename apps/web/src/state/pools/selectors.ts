import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.pools.data
const selectCurrBribe = (state: State) => state.pools.currBribe
const selectCurrPool = (state: State) => state.pools.currPool
const selectFilters = (state: State) => state.pools?.filters
const selectFilteredData = (state: State) => {
  return state.pools?.data.filter((pool) => {
    return (
      (!state.pools.filters.country ||
        state.pools.filters.country.includes('All') ||
        state.pools.filters.country.filter((value) =>
          pool?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length) &&
      (!state.pools.filters.city ||
        state.pools.filters.city.includes('All') ||
        state.pools.filters.city.filter((value) =>
          pool?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length > 0) &&
      (!state.pools.filters.product ||
        state.pools.filters.product.filter((value) =>
          pool?.products?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length > 0)
    )
  })
}
export const filterSelector = createSelector([selectFilters], (filters) => {
  return filters
})
const selectPoolData = (sousId) => (state: State) => state.pools.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.pools.userDataLoaded

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool, userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools, userDataLoaded }
  },
)

export const poolsWithFilterSelector = createSelector(
  [selectFilteredData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools, userDataLoaded }
  },
)

export const currBribeSelector = createSelector([selectCurrBribe], (currBribe) => {
  return currBribe
})

export const currPoolSelector = createSelector([selectCurrPool], (currPool) => {
  return currPool
})
