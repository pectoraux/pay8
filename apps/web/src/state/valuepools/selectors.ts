import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
// import { transformPool, transformVault } from './helpers'
import { getVaultPosition, VaultPosition } from '../../utils/cakePool'

const selectPoolsData = (state: State) => state.valuepools?.data
const selectPoolData = (sousId) => (state: State) => state.valuepools?.data.find((p) => p.sousId === sousId)
const selectPoolData2 = (address) => (state: State) =>
  state.valuepools.data.find((p) => p.id?.toLowerCase() === address?.toLowerCase())
const selectPoolData3 = (address) => (state: State) =>
  state.valuepools.data.find((p) => !!p.tokens.map((tk) => tk.id.toLowerCase() === address?.toLowerCase()))
const selectUserDataLoaded = (state: State) => state.valuepools?.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key && state.valuepools ? state.valuepools[key] : {}
const selectIfo = (state: State) => state.valuepools.ifo
const selectIfoUserCredit = (state: State) => state.valuepools.ifo.credit ?? BIG_ZERO

const selectCurrBribe = (state: State) => state.valuepools?.currBribe
const selectCurrPool = (state: State) => state.valuepools?.currPool
const selectFilters = (state: State) => state.valuepools?.filters
const selectFilteredData = (state: State) => {
  return state.valuepools?.data.filter((valuepool) => {
    return (
      (!state.valuepools.filters.country ||
        state.valuepools.filters.country.includes('All') ||
        state.valuepools.filters.country.filter((value) =>
          valuepool?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length) &&
      (!state.valuepools.filters.city ||
        state.valuepools.filters.city.includes('All') ||
        state.valuepools.filters.city.filter((value) =>
          valuepool?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length > 0) &&
      (!state.valuepools.filters.product ||
        state.valuepools.filters.product.filter((value) =>
          valuepool?.products?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
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

export const makePoolWithUserDataLoadingSelector3 = (address) =>
  createSelector([selectPoolData3(address), selectUserDataLoaded], (pool, userDataLoaded) => {
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
