import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchContributorsGaugesAsync, fetchContributorsUserDataAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getTag } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('contributors-tags', async () => getTag())
  return data?.name ?? ''
}

export const useContributorConfigInitialize = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchContributorsGaugesAsync({ chainId }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchContributorsGaugesAsync({ chainId }))
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
  useContributorConfigInitialize()
  useFetchPublicPoolsData()
  // useSlowRefreshEffect(() => {
  //   batch(() => {
  //     if (account) {
  //       dispatch(fetchContributorsUserDataAsync({ account }))
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

export const useFilters = () => {
  return useSelector(filterSelector)
}
