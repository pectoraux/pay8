import useSWR from 'swr'
import { useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { batch, useSelector } from 'react-redux'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { fetchLotteriesAsync, fetchLotteriesSgAsync } from '.'
import useSWRImmutable from 'swr/immutable'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'
import { getRewardsForTicketId } from './helpers'

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromLottery = router.query.lottery

  useSWR(
    ['/lotteries'],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchLotteriesSgAsync({ fromLottery }))
          dispatch(fetchLotteriesAsync({ fromLottery }))
        })
      }

      fetchPoolsDataWithFarms()
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      revalidateOnReconnect: false,
      revalidateOnMount: true,
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

export const useGetRewardsForTicketId = (tokenAddress, lotteryId, ticketId) => {
  const { data: winners } = useSWRImmutable(['rewards-for-user2', tokenAddress, lotteryId, ticketId], async () => {
    try {
      const arr = Array.from({ length: 6 }, (v, i) => i)
      const res = await Promise.all(
        arr?.map(async (idx) => getRewardsForTicketId(tokenAddress, lotteryId, ticketId, idx)),
      )
      return res
    } catch (err) {
      console.log('rerr==========>', err)
    }
    return []
  })
  console.log('winners============>', tokenAddress, lotteryId, ticketId)
  return winners
}
