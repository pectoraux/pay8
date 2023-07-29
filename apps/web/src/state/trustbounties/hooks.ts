import useSWR from 'swr'
import { useMemo } from 'react'
import { useRouter } from 'next/router'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { requiresApproval } from 'utils/requiresApproval'
import { fetchBountiesAsync } from '.'
import {
  currBribeSelector,
  currPoolSelector,
  makePoolWithUserDataLoadingSelector,
  poolsWithFilterSelector,
} from './selectors'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { chainId } = useActiveChainId()
  const fromRamps = router.pathname.includes('ramps')
  const fromAuditors = router.pathname.includes('auditors')
  const fromSponsors = router.pathname.includes('sponsors')
  const fromAccelerator = router.pathname.includes('accelerator')
  const fromBusinesses = router.pathname.includes('businesses')
  const fromContributors = router.pathname.includes('contributors')
  const fromTransfers = router.pathname.includes('transfers')

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(
          fetchBountiesAsync({
            fromAccelerator,
            fromContributors,
            fromSponsors,
            fromAuditors,
            fromBusinesses,
            fromRamps,
            fromTransfers,
          }),
        )
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId])
}

export const usePool = (sousId: number): { pool: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  // const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  useFetchPublicPoolsData()

  // useFastRefreshEffect(() => {
  //   batch(() => {
  //     if (account) {
  //       dispatch(fetchBountiesUserDataAsync(account))
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

export const useGetRequiresApproval = (c, a, s) => {
  const { data, status } = useSWR(['tb', 'allowance', s.toLowerCase()], async () => requiresApproval(c, a, s))
  return {
    status,
    needsApproval: data ?? true,
  }
}
