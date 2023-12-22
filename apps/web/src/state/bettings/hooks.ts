import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { FAST_INTERVAL } from 'config/constants'
import { fetchBettingsAsync, fetchBettingSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import {
  getAmountCollected,
  getCalculateRewardsForTicketId,
  getCountWinnersPerBracket,
  getPaymentCredits,
  getPendingRevenue,
  getSubjects,
  getTag,
  getTokenForCredit,
} from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('bettings-tags', async () => getTag())
  return data?.name ?? ''
}

export const useGetTokenForCredit = (bettingAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWRImmutable(['betting4', 'burnTokenForCredit', bettingAddress, chainId], async () =>
    getTokenForCredit(bettingAddress, chainId),
  )
  return {
    data,
    status,
  }
}

export const useGetPaymentCredits = (bettingAddress, userAddress, bettingId) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWRImmutable(
    ['betting', 'paymentcredits', bettingAddress, userAddress, bettingId, chainId],
    async () => getPaymentCredits(bettingAddress, userAddress, bettingId, chainId),
  )
  return {
    data,
    status,
  }
}

export const useGetAmountCollected = (bettingAddress, bettingId, period) => {
  const { chainId } = useActiveChainId()
  const { data: amountCollected, mutate: refetch } = useSWRImmutable(
    ['amountCollected', bettingAddress, bettingId, period],
    async () => getAmountCollected(bettingAddress, bettingId, parseInt(period), chainId),
  )
  return {
    amountCollected,
    refetch,
  }
}

export const useGetSubjects = (bettingAddress, bettingId, ticketSize) => {
  const { chainId } = useActiveChainId()
  const { data: subjects } = useSWRImmutable(['subjects', bettingAddress, bettingId, ticketSize], async () => {
    try {
      return getSubjects(bettingAddress, bettingId, chainId)
    } catch (err) {
      console.log('rerr==========>', err)
    }
    return []
  })
  return subjects
}

export const useGetCalculateRewardsForTicketId = (bettingAddress, bettingId, ticketId, bracketNumber) => {
  const { chainId } = useActiveChainId()
  const { data: rewards } = useSWRImmutable(['rewards-for-ticket', bettingAddress, bettingId, ticketId], async () => {
    try {
      return getCalculateRewardsForTicketId(bettingAddress, bettingId, ticketId, bracketNumber, chainId)
    } catch (err) {
      console.log('rerr==========>', err)
    }
    return []
  })
  return rewards
}

export const useGetPendingRevenue = (bettingAddress, tokenAddress) => {
  const { chainId } = useActiveChainId()
  const { data: pendingRevenue } = useSWRImmutable(['pendingRevenue', bettingAddress, tokenAddress], async () => {
    try {
      return getPendingRevenue(bettingAddress, tokenAddress, chainId)
    } catch (err) {
      console.log('rerr==========>', err)
    }
    return '0'
  })
  return pendingRevenue
}

export const useGetWinnersPerBracket = (bettingAddress, bettingId, period, ticketSize) => {
  const { chainId } = useActiveChainId()
  const { data: winners } = useSWRImmutable(['winners', bettingAddress, bettingId, period, ticketSize], async () => {
    try {
      const arr = Array.from({ length: Number(ticketSize) }, (v, i) => i)
      const res = await Promise.all(
        arr?.map(async (idx) => getCountWinnersPerBracket(bettingAddress, bettingId, period, idx, chainId)),
      )
      return res
    } catch (err) {
      console.log('rerr==========>', err)
    }
    return []
  })
  return winners
}

export const useGetWinnersPerBracketNPeriod = (bettingAddress, bettingId, periods, ticketSize) => {
  const { chainId } = useActiveChainId()
  const { data: winners } = useSWRImmutable(['winners', bettingAddress, bettingId, periods, ticketSize], async () => {
    try {
      return Promise.all(
        periods?.map(async (period) => {
          const arr = Array.from({ length: Number(ticketSize) }, (v, i) => i)
          return Promise.all(
            arr?.map(async (idx) => getCountWinnersPerBracket(bettingAddress, bettingId, period, idx, chainId)),
          )
        }),
      )
    } catch (err) {
      console.log('rerr==========>', err)
    }
    return []
  })
  return winners
}

export const useBettingsConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromBetting = router.query.betting

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchBettingSgAsync({ fromBetting }))
        dispatch(fetchBettingsAsync({ fromBetting, chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromBetting = router.query.betting

  useSWR(
    ['/bettings', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchBettingSgAsync({ fromBetting }))
          dispatch(fetchBettingsAsync({ fromBetting, chainId }))
        })
      }

      fetchPoolsDataWithFarms()
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      refreshInterval: FAST_INTERVAL * 10,
      keepPreviousData: true,
    },
  )
}

export const usePool = (sousId): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useBettingsConfigInitialize()
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
