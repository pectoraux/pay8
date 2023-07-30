import { useMemo, useEffect, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useWeb3React } from '@pancakeswap/wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchReferralGaugesAsync, fetchReferralsUserDataAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchReferralGaugesAsync())
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId])
}

export const usePool = (sousId: number): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  useFetchPublicPoolsData()
  // useFastRefreshEffect(() => {
  //   batch(() => {
  //     if (account) {
  //       dispatch(fetchReferralsUserDataAsync({ account }))
  //     }
  //   })
  // }, [account, dispatch])
}

export const useCurrBribe = () => {
  return useSelector(currBribeSelector)
}

export const useCurrPool = () => {
  return useSelector(currPoolSelector)
}

export const usePoolsWithFilterSelector = () => {
  return useSelector(poolsWithFilterSelector)
}
