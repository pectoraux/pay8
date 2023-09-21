import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
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
  getSubjects,
  getTag,
} from './helpers'
import { FAST_INTERVAL } from 'config/constants'

export const useGetTags = () => {
  const { data } = useSWR('bettings-tags', async () => getTag())
  return data?.name ?? ''
}

export const useGetAmountCollected = (bettingAddress, bettingId, period) => {
  const { data: amountCollected, mutate: refetch } = useSWRImmutable(
    ['amountCollected', bettingAddress, bettingId],
    async () => getAmountCollected(bettingAddress, bettingId, parseInt(period)),
  )
  return {
    amountCollected,
    refetch,
  }
}

export const useGetSubjects = (bettingAddress, bettingId, ticketSize) => {
  const { data: subjects } = useSWRImmutable(['subjects', bettingAddress, bettingId, ticketSize], async () => {
    try {
      return getSubjects(bettingAddress, bettingId)
    } catch (err) {
      console.log('rerr==========>', err)
    }
    return []
  })
  return subjects
}

export const useGetCalculateRewardsForTicketId = (bettingAddress, bettingId, ticketId, bracketNumber) => {
  const { data: rewards } = useSWRImmutable(['rewards-for-ticket', bettingAddress, bettingId, ticketId], async () => {
    try {
      return getCalculateRewardsForTicketId(bettingAddress, bettingId, ticketId, bracketNumber)
    } catch (err) {
      console.log('rerr==========>', err)
    }
    return []
  })
  return rewards
}

export const useGetWinnersPerBracket = (bettingAddress, bettingId, period, ticketSize) => {
  const { data: winners } = useSWRImmutable(['winners', bettingAddress, bettingId, period, ticketSize], async () => {
    try {
      const arr = Array.from({ length: Number(ticketSize) }, (v, i) => i)
      const res = await Promise.all(
        arr?.map(async (idx) => getCountWinnersPerBracket(bettingAddress, bettingId, period, idx)),
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
  const { data: winners } = useSWRImmutable(['winners1', bettingAddress, bettingId, periods, ticketSize], async () => {
    try {
      return Promise.all(
        periods?.map(async (period) => {
          const arr = Array.from({ length: Number(ticketSize) }, (v, i) => i)
          return Promise.all(arr?.map(async (idx) => getCountWinnersPerBracket(bettingAddress, bettingId, period, idx)))
        }),
      )
    } catch (err) {
      console.log('rerr==========>', err)
    }
    return []
  })
  return winners
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
          dispatch(fetchBettingsAsync({ fromBetting }))
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
