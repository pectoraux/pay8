import useSWR from 'swr'
import { useMemo, useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchAcceleratorGaugesAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
  filterSelector,
} from './selectors'
import { getEarlyAdopter, getTag, getWeight } from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('acc-tags', async () => getTag())
  return data?.name ?? ''
}

export const useAcceleratorConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchAcceleratorGaugesAsync({ chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsStats = () => {
  const [data, setData] = useState(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await firestore.collection('businesses_stats').get()
        setData(snapshot.docs.map((doc) => doc.data()))
      } catch (error) {
        console.error('Unable to fetch stripe account:', error)
      }
    }

    fetchData()
  }, [setData])
  return data
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchAcceleratorGaugesAsync({ chainId }))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId])
}

export const usePool = (sousId): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useAcceleratorConfigInitialize()
  useFetchPublicPoolsData()
  // useSlowRefreshEffect(() => {
  //   batch(() => {
  //     if (account) {
  //       dispatch(fetchAcceleratorUserDataAsync({ account }))
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

export const useGetWeight = (collectionId, vaAddress) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWR(['useGetWeight', collectionId, vaAddress, chainId], async () =>
    getWeight(collectionId, vaAddress, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}

export const useGetEarlyAdopter = (vaAddress, userAddress) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWR(['useGetEarlyAdopter', vaAddress, userAddress, chainId], async () =>
    getEarlyAdopter(vaAddress, userAddress, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}
