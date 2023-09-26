import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWR from 'swr'
import { FAST_INTERVAL } from 'config/constants'

import { fetchAuditorsAsync, fetchAuditorSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getProtocolsSg, getTag } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('auditors-tags', async () => getTag())
  return data?.name ?? ''
}

export const useGetProtocols = (userAddress) => {
  const { data, status } = useSWR(['auditors-protocols', userAddress], async () => getProtocolsSg(userAddress))
  const protocols = data ?? ({} as any)
  return { data: protocols, status }
}

export const useAuditorsConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromAuditor = router.query.auditor

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchAuditorSgAsync({ fromAuditor }))
        dispatch(fetchAuditorsAsync({ fromAuditor, chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromAuditor = router.query.auditor

  useSWR(
    ['/auditors', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchAuditorSgAsync({ fromAuditor }))
          dispatch(fetchAuditorsAsync({ fromAuditor, chainId }))
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
  useAuditorsConfigInitialize()
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
