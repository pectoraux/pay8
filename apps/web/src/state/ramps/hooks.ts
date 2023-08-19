import useSWR from 'swr'
import { useEffect, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useFastRefreshEffect, useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { FAST_INTERVAL } from 'config/constants'
import useSWRImmutable from 'swr/immutable'
import { getFarmConfig } from '@pancakeswap/farms/constants'
import { Pool } from '@pancakeswap/uikit'
import { Token } from '@pancakeswap/sdk'
import { getLivePoolsConfig } from '@pancakeswap/pools'

import { useActiveChainId } from 'hooks/useActiveChainId'
import useAccountActiveChain from 'hooks/useAccountActiveChain'
import { fetchRampAsync, fetchRampsAsync } from '.'
import { VaultKey } from '../types'
import { fetchFarmsPublicDataAsync } from '../farms'
import {
  makePoolWithUserDataLoadingSelector,
  makePoolWithUserDataLoadingSelector2,
  makeVaultPoolByKey,
  poolsWithVaultSelector,
  ifoCreditSelector,
  ifoCeilingSelector,
  makeVaultPoolWithKeySelector,
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
} from './selectors'
import { requiresApproval } from 'utils/requiresApproval'
import { getAccountSg, getRampSg, getSession, getTokenData } from './helpers'
import axios from 'axios'
import NodeRSA from 'encrypt-rsa'

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSWR(
    ['/ramps', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchRampsAsync())
        })
      }

      fetchPoolsDataWithFarms()
    },
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
    },
  )
}

export const fetchPoolsDataWithFarms = async (ramp, dispatch) => {
  if (ramp) {
    batch(() => {
      dispatch(fetchRampAsync(ramp))
    })
  }
}

export const usePool = (sousId: number): { pool: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(sousId), [sousId])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePool2 = (address): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector2(address), [address])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsWithVault = () => {
  return useSelector(poolsWithVaultSelector)
}

export const useDeserializedPoolByVaultKey = (vaultKey) => {
  const vaultPoolWithKeySelector = useMemo(() => makeVaultPoolWithKeySelector(vaultKey), [vaultKey])

  return useSelector(vaultPoolWithKeySelector)
}

export const usePoolsConfigInitialize = () => {
  // const dispatch = useAppDispatch()
  // const { chainId } = useActiveChainId()
  // useEffect(() => {
  //   if (chainId) {
  //     dispatch(setInitialPoolConfig({ chainId }))
  //   }
  // }, [dispatch, chainId])
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

export const useGetSessionInfoSg = (sessionId, rampAddress) => {
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['ramp-session-info', sessionId ?? '0', rampAddress], async () => getSession(sessionId, rampAddress))
  return { data, refetch, status }
}

export const useGetTokenData = (tokenAddress) => {
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['token-data2', tokenAddress], async () => getTokenData(tokenAddress))
  return { data, refetch, status }
}

export const useGetAccountSg = (accountAddress, channel) => {
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['account-data', accountAddress, channel], async () => getAccountSg(accountAddress, channel))
  return { data, refetch, status }
}

export const useGetSessionInfo = (sessionId, sk) => {
  console.log('useGetSessionInfo==========>', sk)
  const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)
  try {
    const sk0 = sk
      ? nodeRSA.decryptStringWithRsaPrivateKey({
          text: sk,
          privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
        })
      : ''
    const {
      data,
      status,
      mutate: refetch,
    } = useSWRImmutable(['stripe-session-info', sessionId ?? '0', sk0], async () =>
      axios.post('/api/check', { sessionId, sk: sk0 }),
    )
    return { data: data?.data, refetch, status }
  } catch (err) {
    return {
      data: null,
      refetch: null,
    }
  }
}

export const useGetRamp = (rampAddress) => {
  const {
    data,
    status,
    mutate: refetch,
  } = useSWRImmutable(['ramp-info', rampAddress], async () => getRampSg(rampAddress))
  return { data, refetch, status }
}

export const useGetRequiresApproval = (c, a, s) => {
  const { data, status } = useSWR(['ramps', 'allowance', s.toLowerCase()], async () => requiresApproval(c, a, s))
  return {
    status,
    needsApproval: data ?? true,
  }
}

export const usePoolsPageFetch = () => {
  const dispatch = useAppDispatch()
  const { account, chainId } = useAccountActiveChain()

  useFetchPublicPoolsData()

  useFastRefreshEffect(() => {
    if (chainId) {
      batch(() => {
        if (account) {
          // dispatch(fetchPoolsUserDataAsync({ account, chainId }))
        }
      })
    }
  }, [account, chainId, dispatch])
}

export const useCakeVaultUserData = () => {
  const { address: account } = useAccount()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useFastRefreshEffect(() => {
    if (account && chainId) {
      // // dispatch(fetchCakeVaultUserData({ account, chainId }))
    }
  }, [account, dispatch, chainId])
}

export const useCakeVaultPublicData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  useFastRefreshEffect(() => {
    if (chainId) {
      // dispatch(fetchCakeVaultPublicData(chainId))
    }
  }, [dispatch, chainId])
}

export const useFetchIfo = () => {
  const { account, chainId } = useAccountActiveChain()
  const dispatch = useAppDispatch()

  usePoolsConfigInitialize()

  // useSWRImmutable(
  //   chainId && ['fetchIfoPublicData', chainId],
  //   async () => {
  //     const cakePriceFarms = await getCakePriceFarms(chainId)
  //     await dispatch(fetchFarmsPublicDataAsync({ pids: cakePriceFarms, chainId }))
  //     batch(() => {
  //       dispatch(fetchCakePoolPublicDataAsync())
  //       dispatch(fetchCakeVaultPublicData(chainId))
  //       dispatch(fetchIfoPublicDataAsync(chainId))
  //     })
  //   },
  //   {
  //     refreshInterval: FAST_INTERVAL,
  //   },
  // )

  // useSWRImmutable(
  //   account && chainId && ['fetchIfoUserData', account, chainId],
  //   async () => {
  //     batch(() => {
  //       dispatch(fetchCakePoolUserDataAsync({ account, chainId }))
  //       // dispatch(fetchCakeVaultUserData({ account, chainId }))
  //       dispatch(fetchUserIfoCreditDataAsync({ account, chainId }))
  //     })
  //   },
  //   {
  //     refreshInterval: FAST_INTERVAL,
  //   },
  // )

  // useSWRImmutable(chainId && ['fetchCakeVaultFees', chainId], async () => {
  //   dispatch(fetchCakeVaultFees(chainId))
  // })
}

export const useCakeVault = () => {
  return useVaultPoolByKey(VaultKey.CakeVault)
}

export const useVaultPoolByKey = (key: VaultKey) => {
  const vaultPoolByKey = useMemo(() => makeVaultPoolByKey(key), [key])

  return useSelector(vaultPoolByKey)
}

export const useIfoCredit = () => {
  return useSelector(ifoCreditSelector)
}

export const useIfoCeiling = () => {
  return useSelector(ifoCeilingSelector)
}
