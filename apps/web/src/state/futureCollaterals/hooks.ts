import useSWR from 'swr'
import { useEffect, useMemo } from 'react'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { batch, useSelector } from 'react-redux'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useSWRImmutable from 'swr/immutable'
import { fetchFutureCollateralsAsync, fetchFutureCollateralSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getPrice, getTag } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('fc-tags', async () => getTag())
  return data?.name ?? ''
}

export const useFCConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromFutureCollateral = router.query.futureCollateral

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchFutureCollateralSgAsync({ fromFutureCollateral }))
        dispatch(fetchFutureCollateralsAsync({ fromFutureCollateral, chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromFutureCollateral = router.query.futureCollateral

  useSWR(
    ['/futureCollaterals', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchFutureCollateralSgAsync({ fromFutureCollateral }))
          dispatch(fetchFutureCollateralsAsync({ fromFutureCollateral, chainId }))
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

export const usePoolsPageFetch = () => {
  useFCConfigInitialize()
  useFetchPublicPoolsData()
}

export const usePool = (sousId): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
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

export const useGetPrice = (accountAddress) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(['useGetPrice', accountAddress, chainId], async () =>
    getPrice(accountAddress, chainId),
  )
  return data
}
