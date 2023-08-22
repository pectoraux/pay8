import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'

const selectPoolsData = (state: State) => state.trustbounties?.data
const selectPoolData = (sousId) => (state: State) => state.trustbounties?.data.find((p) => p.sousId === sousId)
const selectPoolData2 = (address) => (state: State) =>
  state.trustbounties.data.find((p) => p.tbAddress?.toLowerCase() === address?.toLowerCase())
const selectUserDataLoaded = (state: State) => state.trustbounties?.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key && state.trustbounties ? state.trustbounties[key] : {}
const selectIfo = (state: State) => state.trustbounties.ifo
const selectIfoUserCredit = (state: State) => state.trustbounties.ifo.credit ?? BIG_ZERO

const selectCurrBribe = (state: State) => state.trustbounties?.currBribe
const selectCurrPool = (state: State) => state.trustbounties?.currPool
const selectFilters = (state: State) => state.trustbounties?.filters
const selectFilteredData = (state: State) => {
  return state.trustbounties?.data.filter((trustbountie) => {
    return (
      (!state.trustbounties.filters.country ||
        state.trustbounties.filters.country.includes('All') ||
        state.trustbounties.filters.country.filter((value) =>
          trustbountie?.countries?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length) &&
      (!state.trustbounties.filters.city ||
        state.trustbounties.filters.city.includes('All') ||
        state.trustbounties.filters.city.filter((value) =>
          trustbountie?.cities?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
        )?.length > 0) &&
      (!state.trustbounties.filters.product ||
        state.trustbounties.filters.product.includes('All') ||
        state.trustbounties.filters.product.filter((value) =>
          trustbountie?.products?.toLowerCase()?.split(',').includes(value?.toLowerCase()),
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
