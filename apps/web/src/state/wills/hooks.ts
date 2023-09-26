import useSWR from 'swr'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchWillsAsync, fetchWillSgAsync } from '.'
import { FAST_INTERVAL } from 'config/constants'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getTag } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('wills-tags6', async () => getTag())
  return data?.name ?? ''
}

export const useWillsConfigInitialize = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const fromWill = router.query.will
  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchWillSgAsync({ fromWill }))
        dispatch(fetchWillsAsync({ fromWill, chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromWill = router.query.will

  useSWR(
    ['/wills', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          const init = true
          dispatch(fetchWillSgAsync({ fromWill }))
          dispatch(fetchWillsAsync({ fromWill, chainId }))
        })
      }

      fetchPoolsDataWithFarms()
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
      refreshInterval: FAST_INTERVAL * 3,
      keepPreviousData: true,
    },
  )
}

export const usePool = (sousId): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useFetchPublicPoolsData()
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
