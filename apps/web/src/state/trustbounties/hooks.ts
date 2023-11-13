import useSWR from 'swr'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { requiresApproval } from 'utils/requiresApproval'
import { fetchBountiesAsync } from '.'
import {
  currBribeSelector,
  currPoolSelector,
  filterSelector,
  makePoolWithUserDataLoadingSelector,
  poolsWithFilterSelector,
} from './selectors'
import { getIsLocked, getLatestClaim, getTag } from './helpers'
import { FAST_INTERVAL } from 'config/constants'

export const useGetTags = () => {
  const { data } = useSWR('trustbounties-tags', async () => getTag())
  return data?.name ?? ''
}

export const useBountiesConfigInitialize = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const fromRamps = router.pathname.includes('ramps')
  const fromAuditors = router.pathname.includes('auditors')
  const fromSponsors = router.pathname.includes('sponsors')
  const fromAccelerator = router.pathname.includes('accelerator')
  const fromBusinesses = router.pathname.includes('businesses')
  const fromContributors = router.pathname.includes('contributors')
  const fromTransfers = router.pathname.includes('transfers')

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(
          fetchBountiesAsync({
            fromAccelerator,
            fromContributors,
            fromSponsors,
            fromAuditors,
            fromBusinesses,
            fromRamps,
            fromTransfers,
            chainId,
            init,
          }),
        )
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const fromRamps = router.pathname.includes('ramps')
  const fromAuditors = router.pathname.includes('auditors')
  const fromSponsors = router.pathname.includes('sponsors')
  const fromAccelerator = router.pathname.includes('accelerator')
  const fromBusinesses = router.pathname.includes('businesses')
  const fromContributors = router.pathname.includes('contributors')
  const fromTransfers = router.pathname.includes('transfers')

  useSWR(
    ['/trustbounties', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(
            fetchBountiesAsync({
              fromAccelerator,
              fromContributors,
              fromSponsors,
              fromAuditors,
              fromBusinesses,
              fromRamps,
              fromTransfers,
              chainId,
            }),
          )
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

export const usePool = (sousId: number): { pool: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  // const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  useBountiesConfigInitialize()
  useFetchPublicPoolsData()

  // useFastRefreshEffect(() => {
  //   batch(() => {
  //     if (account) {
  //       dispatch(fetchBountiesUserDataAsync(account))
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

export const useGetRequiresApproval = (c, a, s) => {
  const { data, status, mutate } = useSWR(
    ['tb-allowance', c.address?.toLowerCase(), a?.toLowerCase(), s?.toLowerCase()],
    async () => requiresApproval(c, a, s),
  )
  return {
    status,
    refetch: mutate,
    needsApproval: data ?? true,
  }
}

export const useGetIsLocked = (bountyId) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['useGetIsLocked', bountyId, chainId], async () => getIsLocked(bountyId, chainId))
  return data
}

export const useGetLatestClaim = (bountyId, attackerId) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['useGetLatestClaim1', bountyId, attackerId, chainId], async () =>
    getLatestClaim(bountyId, attackerId, chainId),
  )
  return data
}

export const useFilters = () => {
  return useSelector(filterSelector)
}
