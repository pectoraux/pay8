import useSWR from 'swr'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { requiresApproval } from 'utils/requiresApproval'
import { FAST_INTERVAL } from 'config/constants'
import { fetchBountiesAsync } from '.'
import {
  currBribeSelector,
  currPoolSelector,
  filterSelector,
  makePoolWithUserDataLoadingSelector,
  poolsWithFilterSelector,
} from './selectors'
import {
  getBalanceSource,
  getBounty,
  getEarned,
  getIsLocked,
  getLatestClaim,
  getLatestClaim2,
  getTag,
  getTokenData,
} from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('trustbounties-tags', async () => getTag())
  return data ?? ''
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

  const { mutate, status } = useSWR(
    ['/trustbounties', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          console.log('1exkuting============>')
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
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      refreshInterval: FAST_INTERVAL,
      keepPreviousData: true,
    },
  )
  return {
    refresh: mutate,
    status,
  }
}

export const usePool = (sousId: number): { pool: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  // const { account } = useWeb3React()
  // const dispatch = useAppDispatch()
  useBountiesConfigInitialize()
  return useFetchPublicPoolsData()

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
    ['tb-allowance', c?.address?.toLowerCase(), a?.toLowerCase(), s?.toLowerCase()],
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

export const useGetTokenData = (tokenAddress) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['useGetTokenData1', tokenAddress, chainId], async () => getTokenData(tokenAddress, chainId))
  return { data, refetch, status }
}

export const useGetBounty = (bountyId) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['useGetBounty', bountyId, chainId], async () => getBounty(bountyId, chainId))
  return data
}

export const useGetBalanceSource = (bountyId) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['getBalanceSource', bountyId, chainId], async () => getBalanceSource(bountyId, chainId))
  return data
}

export const useGetEarned = (veAddress, tokenId) => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWR(['useGetEarned4', veAddress, tokenId, chainId], async () =>
    getEarned(veAddress, tokenId, chainId),
  )
  return {
    status,
    refetch: mutate,
    earned: data?.earned,
    tokenAddress: data?.tokenAddress,
  }
}

export const useGetLatestClaim = (bountyId, attackerId) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['useGetLatestClaim1', bountyId, attackerId, chainId], async () =>
    getLatestClaim(bountyId, attackerId, chainId),
  )
  return data
}

export const useGetLatestClaim2 = (bountyId) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['useGetLatestClaim3', bountyId, chainId], async () => getLatestClaim2(bountyId, chainId))
  return data
}

export const useFilters = () => {
  return useSelector(filterSelector)
}
