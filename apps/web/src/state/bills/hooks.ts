import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { FAST_INTERVAL } from 'config/constants'

import { fetchBillsAsync, fetchBillSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getPendingRevenue, getTag } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('bills-tags', async () => getTag())
  return data?.name ?? ''
}

export const useBillsConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromBill = router.query.bill

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchBillSgAsync({ fromBill }))
        dispatch(fetchBillsAsync({ fromBill, chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromBill = router.query.bill

  useSWR(
    ['/bills', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchBillSgAsync({ fromBill }))
          dispatch(fetchBillsAsync({ fromBill, chainId }))
        })
      }

      fetchPoolsDataWithFarms()
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      revalidateOnReconnect: false,
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
  useBillsConfigInitialize()
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
  const { data, mutate } = useSWR(['useGetPendingFromNote-bill', tokenId, chainId], async () =>
    getPendingRevenue(tokenId, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}
