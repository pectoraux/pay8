import BigNumber from 'bignumber.js'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { createSelector } from '@reduxjs/toolkit'
import { State, VaultKey } from '../types'
// import { transformPool, transformVault } from './helpers'
import { getVaultPosition, VaultPosition } from '../../utils/cakePool'

const selectPoolsData = (state: State) => state.cards?.data
const selectPoolData = (sousId) => (state: State) =>
  state.cards?.data.find((p) => parseInt(p.sousId) === parseInt(sousId))
const selectPoolData2 = (address) => (state: State) =>
  state.cards.data.find((p) => p.rampAddress?.toLowerCase() === address?.toLowerCase())
const selectUserDataLoaded = (state: State) => state.cards?.userDataLoaded
const selectVault = (key: VaultKey) => (state: State) => key && state.cards ? state.cards[key] : {}
const selectIfo = (state: State) => state.cards.ifo
const selectIfoUserCredit = (state: State) => state.cards.ifo.credit ?? BIG_ZERO

const selectCurrBribe = (state: State) => state.cards?.currBribe
const selectCurrPool = (state: State) => state.cards?.currPool
const selectFilteredData = (state: State) => {
  return state.cards?.data.filter(
    (ramp) =>
      (!state.cards.filters.workspace ||
        state.cards.filters.workspace === 'All' ||
        ramp?.workspace?.toLowerCase() === state.cards.filters.workspace?.toLowerCase()) &&
      (!state.cards.filters.country ||
        state.cards.filters.country === 'All' ||
        ramp?.country?.toLowerCase() === state.cards.filters.country?.toLowerCase()) &&
      (!state.cards.filters.city ||
        state.cards.filters.city === 'All' ||
        ramp?.city?.toLowerCase() === state.cards.filters.city?.toLowerCase()),
  )
}

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
