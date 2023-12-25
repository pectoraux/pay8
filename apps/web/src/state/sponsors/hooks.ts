import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { FAST_INTERVAL } from 'config/constants'
import { fetchSponsorsAsync, fetchSponsorSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  makePoolWithUserDataLoadingSelector2,
  filterSelector,
} from './selectors'
import { getTag } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('sponsors-tags', async () => getTag())
  return data?.name ?? ''
}

export const useSponsorsConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromSponsor = router.query.sponsor

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchSponsorSgAsync({ fromSponsor }))
        dispatch(fetchSponsorsAsync({ fromSponsor, chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromSponsor = router.query.sponsor

  useSWR(
    ['/sponsors', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchSponsorSgAsync({ fromSponsor }))
          dispatch(fetchSponsorsAsync({ fromSponsor, chainId }))
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

export const usePool2 = (id): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector2(id), [id])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useSponsorsConfigInitialize()
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
