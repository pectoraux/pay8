import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { batch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchGameAsync } from 'state/games'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { State } from '../types'
import { potterDataSelector } from './selectors'

export const usePotteryFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const game = useMemo(() => router.query.game, [router.query.game])

  useFastRefreshEffect(() => {
    // dispatch(fetchLastVaultAddressAsync())

    if (game) {
      batch(() => {
        dispatch(fetchGameAsync(game, chainId))
        // dispatch(fetchPublicPotteryDataAsync())
        // if (account) {
        // dispatch(fetchPotteryUserDataAsync(account))
        // dispatch(fetchCakeVaultUserData({ account }))
        // }
      })
    }
  }, [game, account, dispatch])
}

export const usePotteryData = () => {
  return useSelector(potterDataSelector)
}

export const useLatestVaultAddress = () => {
  return useSelector((state: State) => state.pottery.lastVaultAddress)
}
