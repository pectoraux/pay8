import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
import { fetchGameData } from './helpers'
import { fetchGamesAsync, fetchGameSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'

export const useGetGame = (gameName: string, tokenId: string) => {
  const { data } = useSWRImmutable([gameName, tokenId], async () => fetchGameData(gameName, tokenId))
  console.log('useGetGame===================>', data)
  return data
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromGame = router.query.game

  useSWR('games', () => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchGameSgAsync({ fromGame }))
        dispatch(fetchGamesAsync({ fromGame }))
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
