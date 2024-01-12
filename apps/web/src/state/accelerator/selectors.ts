import { createSelector } from '@reduxjs/toolkit'
import { State } from '../types'

const selectPoolsData = (state: State) => state.accelerator?.data
const selectPoolData = (sousId) => (state: State) => state.accelerator?.data.find((p) => p.sousId === sousId)
const selectUserDataLoaded = (state: State) => state.accelerator?.userDataLoaded

const selectCurrBribe = (state: State) => state.accelerator?.currBribe
const selectCurrPool = (state: State) => state.accelerator?.currPool
const selectFilters = (state: State) => state.accelerator?.filters
const selectFilteredData = (state: State) => {
  return state.accelerator?.data.filter((acc) => {
    return (
      (!state.accelerator.filters.country ||
        state.accelerator.filters.country.includes('All') ||
        state.accelerator.filters.country.filter((value) =>
          acc?.collection?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length) &&
      (!state.accelerator.filters.city ||
        state.accelerator.filters.city.includes('All') ||
        state.accelerator.filters.city.filter((value) =>
          acc?.collection?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length > 0) &&
      (!state.accelerator.filters.product ||
        state.accelerator.filters.product.filter((value) =>
          acc?.collection?.products?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length > 0)
    )
  })
}
export const filterSelector = createSelector([selectFilters], (filters) => {
  return filters
})

export const currBribeSelector = createSelector([selectCurrBribe], (currBribe) => {
  return currBribe
})

export const currPoolSelector = createSelector([selectCurrPool], (currPool) => {
  return currPool
})

export const poolsWithFilterSelector = createSelector(
  [selectFilteredData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return { pools, userDataLoaded }
  },
)

export const makePoolWithUserDataLoadingSelector = (sousId) =>
  createSelector([selectPoolData(sousId), selectUserDataLoaded], (pool, userDataLoaded) => {
    return {
      pool,
      userDataLoaded,
    }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return {
      pools,
      userDataLoaded,
    }
  },
)
