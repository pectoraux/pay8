import { useEffect, useMemo } from 'react'
import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useWeb3React } from '@pancakeswap/wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchBusinessGaugesAsync, fetchBusinessesUserDataAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getTag } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('businesses-tags', async () => getTag())
  return data?.name ?? ''
}

export const useBusinessesConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchBusinessGaugesAsync({ chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchBusinessGaugesAsync({ chainId }))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId])
}

export const usePool = (sousId: number): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  useBusinessesConfigInitialize()
  useFetchPublicPoolsData()
  // useFastRefreshEffect(() => {
  //   batch(() => {
  //     if (account) {
  //       dispatch(fetchBusinessesUserDataAsync({ account }))
  //     }
  //   })
  // }, [account, dispatch])
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
