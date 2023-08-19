import useSWR from 'swr'
import { useMemo } from 'react'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { fetchWorldsAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()

  useSWR(
    ['/worlds'],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchWorldsAsync())
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

export const usePool = (sousId: number): { pool?: any; userDataLoaded: boolean } => {
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
