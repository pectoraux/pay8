import { useMemo, useEffect, useState } from 'react'
import { firestore } from 'utils/firebase'
import useSWR from 'swr'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { requiresApproval } from 'utils/requiresApproval'

import { useWeb3React } from '@pancakeswap/wagmi'
import { fetchPairsAsync, fetchPoolsUserDataAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'

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

  useSWR(
    ['/pools'],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchPairsAsync())
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

export const usePool = (sousId: number) => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  useFetchPublicPoolsData()

  // useFastRefreshEffect(() => {
  //   batch(() => {
  //     if (account) {
  //       dispatch(fetchPoolsUserDataAsync(account))
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
  const { data, mutate: refetch } = useSWR(['pools', 'allowance', s.toLowerCase()], async () =>
    requiresApproval(c, a, s),
  )
  return { needsApproval: data, refetch }
}

export const useCakeVaultUserData = () => {
  // const { address: account } = useAccount()
  // const dispatch = useAppDispatch()
  // const { chainId } = useActiveChainId()
  // useFastRefreshEffect(() => {
  //   if (account && chainId) {
  //     // dispatch(fetchCakeVaultUserData({ account, chainId }))
  //   }
  // }, [account, dispatch, chainId])
}

export const useCakeVaultPublicData = () => {}

export const useFetchIfo = () => {}

export const useCakeVault = () => {
  return {
    totalLockedAmount: BIG_ZERO,
    totalShares: BIG_ZERO,
    totalCakeInVault: BIG_ZERO,
    pricePerFullShare: BIG_ZERO,
  } // useVaultPoolByKey(VaultKey.CakeVault)
}

export const useVaultPoolByKey = (key: any) => {
  // const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key])

  return {
    totalCakeInVault: BIG_ZERO,
    totalLockedAmount: BIG_ZERO,
    isLoading: BIG_ZERO,
    locked: BIG_ZERO,
    lockedEnd: BIG_ZERO,
    lockedAmount: BIG_ZERO,
    lockBalance: BIG_ZERO,
    lockedStart: BIG_ZERO,
    userData: {
      balance: { cakeAsBigNumber: BIG_ZERO },
      lockedAmount: BIG_ZERO,
      lastUserActionTime: 0,
    },
  } // useSelector(vaultPoolByKey)
}

export const useIfoCredit = () => {
  return BIG_ZERO // useSelector(ifoCreditSelector)
}

export const useIfoCeiling = () => {
  return BIG_ZERO // useSelector(ifoCeilingSelector)
}
