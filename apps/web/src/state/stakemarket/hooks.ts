import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { requiresApproval } from 'utils/requiresApproval'
import { FAST_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { fetchStakesAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getNote, getStake, getStakeApplication, getTag } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('stakemarket-tags', async () => getTag())
  return data?.name ?? ''
}

export const useStakesConfigInitialize = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const collectionId = useRouter().query.collectionAddress as string

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchStakesAsync(collectionId ?? 0, chainId, init))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const collectionId = useRouter().query.collectionAddress as string

  useSWR(
    ['/stakes', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchStakesAsync(collectionId ?? 0, chainId))
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

export const usePool = (sousId: number): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useStakesConfigInitialize()
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

export const useGetRequiresApproval = (c, a, s) => {
  const { data, status, mutate } = useSWR(
    ['sm', 'allowance', c?.address?.toLowerCase(), a?.toLowerCase(), s?.toLowerCase()],
    async () => requiresApproval(c, a, s),
  )
  return {
    status,
    refetch: mutate,
    needsApproval: data ?? true,
  }
}

export const useFilters = () => {
  return useSelector(filterSelector)
}

export const useGetStakeApplication = (stakeId: string) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['getStakeApplication', stakeId, chainId], async () => getStakeApplication(stakeId, chainId))
  return { data, refetch, status }
}

export const useGetStake = (stakeId: string) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['getStake', stakeId, chainId], async () => getStake(stakeId, chainId))
  return data
}

export const useGetNote = (tokenId) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWR(['useGetNote', tokenId, chainId], async () => getNote(tokenId, chainId))
  return {
    data,
    refetch: mutate,
  }
}
