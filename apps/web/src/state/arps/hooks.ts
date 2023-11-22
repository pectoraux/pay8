import useSWR from 'swr'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { batch, useSelector } from 'react-redux'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { FAST_INTERVAL } from 'config/constants'

import { fetchArpsAsync, fetchArpSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getPendingRevenue, getTag, getTotalLiquidity } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('arps-tags', async () => getTag())
  return data?.name ?? ''
}

export const useARPsConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromArp = router.query.arp

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchArpSgAsync({ fromArp }))
        dispatch(fetchArpsAsync({ fromArp, chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromArp = router.query.arp

  useSWR(
    ['/arps', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchArpSgAsync({ fromArp }))
          dispatch(fetchArpsAsync({ fromArp, chainId }))
        })
      }

      fetchPoolsDataWithFarms()
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      refreshInterval: FAST_INTERVAL,
      keepPreviousData: true,
    },
  )
}

export const usePool = (sousId): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useARPsConfigInitialize()
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

export const useGetPendingFromNote = (tokenId) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWR(['useGetPendingFromNote1', tokenId, chainId], async () =>
    getPendingRevenue(tokenId, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}

export const useGetTotalLiquidity = (tokenAddress, arpAddress) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWR(['useGetTotalLiquidity', tokenAddress, arpAddress, chainId], async () =>
    getTotalLiquidity(tokenAddress, arpAddress, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}
