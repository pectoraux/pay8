import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import useSWR from 'swr'
import { fetchAuditorsAsync, fetchAuditorSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'
import { getProtocolsSg } from './helpers'

export const useGetProtocols = (userAddress) => {
  const { data, status } = useSWR(['auditors', 'protocols2'], async () => getProtocolsSg(userAddress))
  const protocols = data ?? ({} as any)
  return { data: protocols, status }
}

export const useFetchPublicPoolsData = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const fromAuditor = router.query.auditor

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchAuditorSgAsync({ fromAuditor }))
        dispatch(fetchAuditorsAsync({ fromAuditor }))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId, fromAuditor])
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
