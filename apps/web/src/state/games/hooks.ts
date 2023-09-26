import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { FAST_INTERVAL } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { fetchGameData, getTag } from './helpers'
import { fetchGamesAsync, fetchGameSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'

export const useGetTags = () => {
  const { data } = useSWR('games-tags', async () => getTag())
  return data?.name ?? ''
}

export const useGetGame = (gameName: string, tokenId: string) => {
  const { data } = useSWRImmutable(['fb-score', gameName, tokenId], async () => fetchGameData(gameName, tokenId))
  return data
}

export const useGamesConfigInitialize = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const fromGame = router.query.game
  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchGameSgAsync({ fromGame }))
        dispatch(fetchGamesAsync({ fromGame, chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromGame = router.query.game
  const { chainId } = useActiveChainId()

  useSWR(
    ['/games', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          const init = false
          dispatch(fetchGameSgAsync({ fromGame }))
          dispatch(fetchGamesAsync({ fromGame, init, chainId }))
        })
      }

      fetchPoolsDataWithFarms()
    },
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      refreshInterval: FAST_INTERVAL * 3,
      keepPreviousData: true,
    },
  )
}

export const usePool = (sousId): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useGamesConfigInitialize()
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
