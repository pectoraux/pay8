import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
// import { transformPool, transformVault } from './helpers'
import { getVaultPosition, VaultPosition } from '../../utils/cakePool'

const selectPoolsData = (state: State) => state.bills?.data
const selectPoolData = (sousId) => (state: State) => state.bills?.data.find((p) => p.sousId === sousId)
const selectPoolData2 = (address) => (state: State) =>
  state.bills.data.find((p) => p.billAddress?.toLowerCase() === address?.toLowerCase())
const selectUserDataLoaded = (state: State) => state.bills?.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key && state.bills ? state.bills[key] : {}
const selectIfo = (state: State) => state.bills.ifo
const selectIfoUserCredit = (state: State) => state.bills.ifo.credit ?? BIG_ZERO

const selectCurrBribe = (state: State) => state.bills?.currBribe
const selectCurrPool = (state: State) => state.bills?.currPool
const selectFilters = (state: State) => state.bills?.filters
const selectFilteredData = (state: State) => {
  return state.bills?.data.filter((bill) => {
    return (
      (!state.bills.filters.country ||
        state.bills.filters.country.includes('All') ||
        state.bills.filters.country.filter((value) =>
          bill?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length) &&
      (!state.bills.filters.city ||
        state.bills.filters.city.includes('All') ||
        state.bills.filters.city.filter((value) =>
          bill?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length > 0) &&
      (!state.bills.filters.product ||
        state.bills.filters.product.includes('All') ||
        state.bills.filters.product.filter((value) =>
          bill?.products?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
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
      pool, // : transformPool(pool),
      userDataLoaded,
    }
  })

export const makePoolWithUserDataLoadingSelector2 = (address) =>
  createSelector([selectPoolData2(address), selectUserDataLoaded], (pool, userDataLoaded) => {
    return { pool, userDataLoaded }
  })

export const poolsWithUserDataLoadingSelector = createSelector(
  [selectPoolsData, selectUserDataLoaded],
  (pools, userDataLoaded) => {
    return {
      pools, // : pools.map(transformPool),
      userDataLoaded,
    }
  },
)

export const makeVaultPoolByKey = (key) => createSelector([selectVault(key)], (vault) => null) // transformVault(key, vault))

export const poolsWithVaultSelector = createSelector(
  [
    poolsWithUserDataLoadingSelector,
    makeVaultPoolByKey(VaultKey.CakeVault),
    makeVaultPoolByKey(VaultKey.CakeFlexibleSideVault),
  ],
  (poolsWithUserDataLoading, deserializedLockedCakeVault, deserializedFlexibleSideCakeVault) => {
    //   const { pools, userDataLoaded } = poolsWithUserDataLoading
    //   const cakePool = pools.find((pool) => !pool.isFinished && pool.sousId === 0)
    //   const withoutCakePool = pools.filter((pool) => pool.sousId !== 0)

    //   const cakeAutoVault = cakePool && {
    //     ...cakePool,
    //     ...deserializedLockedCakeVault,
    //     vaultKey: VaultKey.CakeVault,
    //     userData: { ...cakePool.userData, ...deserializedLockedCakeVault.userData },
    //   }

    //   const lockedVaultPosition = getVaultPosition(deserializedLockedCakeVault.userData)
    //   const hasFlexibleSideSharesStaked = deserializedFlexibleSideCakeVault.userData.userShares.gt(0)

    //   const cakeAutoFlexibleSideVault =
    //     cakePool && (lockedVaultPosition > VaultPosition.Flexible || hasFlexibleSideSharesStaked)
    //       ? [
    //           {
    //             ...cakePool,
    //             ...deserializedFlexibleSideCakeVault,
    //             vaultKey: VaultKey.CakeFlexibleSideVault,
    //             userData: { ...cakePool.userData, ...deserializedFlexibleSideCakeVault.userData },
    //           },
    //         ]
    //       : []

    //   const allPools = [...cakeAutoFlexibleSideVault, ...withoutCakePool]
    //   if (cakeAutoVault) {
    //     allPools.unshift(cakeAutoVault)
    //   }
    return {
      pools: [], // allPools,
      userDataLoaded: true,
    }
  },
)

export const makeVaultPoolWithKeySelector = (vaultKey) =>
  createSelector(poolsWithVaultSelector, ({ pools }) => pools.find((p) => p.vaultKey === vaultKey))

export const ifoCreditSelector = createSelector([selectIfoUserCredit], (ifoUserCredit) => {
  return new BigNumber(ifoUserCredit)
})

export const ifoCeilingSelector = createSelector([selectIfo], (ifoData) => {
  return new BigNumber(ifoData.ceiling)
})
