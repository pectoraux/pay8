import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchReferralGaugesAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getTag, getWeight } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('referrals-tags', async () => getTag())
  return data?.name ?? ''
}

export const useSponsorsConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchReferralGaugesAsync({ chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchReferralGaugesAsync({ chainId }))
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
  useSponsorsConfigInitialize()
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

export const useFilters = () => {
  return useSelector(filterSelector)
}

export const usePoolsWithFilterSelector = () => {
  return useSelector(poolsWithFilterSelector)
}

export const useGetWeight = (profileId, vaAddress) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWR(['useGetWeight-referral', profileId, vaAddress, chainId], async () =>
    getWeight(profileId, vaAddress, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}
