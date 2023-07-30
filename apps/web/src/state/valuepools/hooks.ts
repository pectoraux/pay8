import { useRouter } from 'next/router'
import { useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { requiresApproval } from 'utils/requiresApproval'
import { fetchValuepoolsAsync, fetchValuepoolSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const fromVesting = router.pathname.includes('vesting')
  const fromValuepool = router.query.valuepool

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchValuepoolSgAsync({ fromVesting, fromValuepool }))
        dispatch(fetchValuepoolsAsync({ fromVesting, fromValuepool }))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId, fromValuepool, fromVesting])
}

export const usePool = (id): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(id), [id])
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

export const useGetRequiresApproval = (c, a, s) => {
  const { data, mutate: refetch } = useSWRImmutable(['valuepool1', 'allowance', s?.toLowerCase()], async () =>
    requiresApproval(c, a, s),
  )
  return {
    isRequired: data ?? true,
    refetch,
  }
}
