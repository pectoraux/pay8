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
} from './selectors'
import { getAmountCollected, getCountWinnersPerBracket, getSubjects } from './helpers'

export const useGetAmountCollected = (bettingAddress, bettingId, period) => {
  const { data: amountCollected, mutate: refetch } = useSWRImmutable(
    ['amountCollected', bettingAddress, bettingId],
    async () => getAmountCollected(bettingAddress, bettingId, period),
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
  console.log('subjects============>', bettingAddress, bettingId, subjects)
  return subjects
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
  console.log('winners============>', bettingAddress, bettingId, period, ticketSize)
  return winners
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromBetting = router.query.betting

  useSWRImmutable(['bettings', fromBetting, chainId], () => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchBettingSgAsync({ fromBetting }))
        dispatch(fetchBettingsAsync({ fromBetting }))
      })
    }

    fetchPoolsDataWithFarms()
  })
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
