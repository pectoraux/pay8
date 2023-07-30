import { useRouter } from 'next/router'
import { useMemo, useEffect, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchFutureCollateralsAsync, fetchFutureCollateralSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromFutureCollateral = router.query.futureCollateral

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchFutureCollateralSgAsync({ fromFutureCollateral }))
        dispatch(fetchFutureCollateralsAsync({ fromFutureCollateral }))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId, fromFutureCollateral])
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
