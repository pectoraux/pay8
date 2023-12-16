import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useSelector, batch } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { State } from '../types'
import { fetchLotteryAsync } from '.'
import { makeLotteryGraphDataByIdSelector, lotterySelector } from './selectors'
import { getPaymentCredits, getPendingReward, getTokenForCredit } from './helpers'

// Lottery
export const useGetCurrentLotteryId = () => {
  return useSelector((state: State) => state.lottery.currentLotteryId)
}

export const useGetTokenForCredit = (collectionAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWRImmutable(['lottery', 'burnTokenForCredit', chainId], async () =>
    getTokenForCredit(collectionAddress, chainId),
  )
  return {
    data,
    status,
  }
}

export const useGetPaymentCredits = (lotteryId, user) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWRImmutable(['lottery2', 'paymentcredits', lotteryId, user, chainId], async () =>
    getPaymentCredits(lotteryId, user, chainId),
  )
  return {
    data,
    status,
  }
}

export const useGetUserLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.userLotteryData)
}

export const useGetLotteriesGraphData = () => {
  return useSelector((state: State) => state.lottery.lotteriesData)
}

export const useGetLotteryGraphDataById = (lotteryId: string) => {
  const lotteryGraphDataByIdSelector = useMemo(() => makeLotteryGraphDataByIdSelector(lotteryId), [lotteryId])
  return useSelector(lotteryGraphDataByIdSelector)
}

export const useFetchLottery = (fetchPublicDataOnly = false) => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const currentLotteryId = useMemo(() => router.query.lotteryId, [router.query.lotteryId])

  // useEffect(() => {
  //   // get current lottery ID & max ticket buy
  //   dispatch(fetchCurrentLotteryId(currentLotteryId))
  // }, [dispatch])
  console.log('currentLotteryId==============>', currentLotteryId)
  useFastRefreshEffect(() => {
    if (currentLotteryId) {
      batch(() => {
        // Get historical lottery data from nodes +  last 100 subgraph entries
        // dispatch(fetchPublicLotteries({ currentLotteryId }))
        // get public data for current lottery
        dispatch(fetchLotteryAsync(currentLotteryId, chainId))
      })
    }
  }, [dispatch, currentLotteryId, chainId])

  // useEffect(() => {
  // get user tickets for current lottery, and user lottery subgraph data
  // if (account && currentLotteryId && !fetchPublicDataOnly) {
  // dispatch(fetchUserTicketsAndLotteries({ account, currentLotteryId }))
  // }
  // }, [dispatch, currentLotteryId, account, fetchPublicDataOnly])
}

export const useLottery = () => {
  return useSelector(lotterySelector)
}

export const useGetPendingReward = (userAddress, lotteryId, tokenAddress, referrer) => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWRImmutable(
    ['reward', userAddress, lotteryId, tokenAddress, referrer],
    async () => getPendingReward(lotteryId, userAddress, tokenAddress, referrer, chainId),
  )
  return {
    data,
    status,
    refetch: mutate,
  }
}
