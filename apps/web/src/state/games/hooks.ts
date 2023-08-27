import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import useSWRImmutable from 'swr/immutable'
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
  const { data } = useSWR('games-tags6', async () => getTag())
  console.log('usetag============>', data)
  return data?.name ?? ''
}

export const useGetGame = (gameName: string, tokenId: string) => {
  const { data } = useSWRImmutable(['fb-score2', gameName, tokenId], async () => fetchGameData(gameName, tokenId))
  console.log('1useGetGame===================>', data, gameName, tokenId)
  return data
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromGame = router.query.game

  useSWR(
    ['/games'],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchGameSgAsync({ fromGame }))
          dispatch(fetchGamesAsync({ fromGame }))
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

export const useFilters = () => {
  return useSelector(filterSelector)
}
