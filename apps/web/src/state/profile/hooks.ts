import { useEffect, useMemo } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { FetchStatus } from 'config/constants/types'
import useSWR, { KeyedMutator } from 'swr'
import { localStorageMiddleware } from 'hooks/useSWRContract'
import useSWRImmutable from 'swr/immutable'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useSlowRefreshEffect } from 'hooks/useRefreshEffect'
import { fetchProfilesAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector,
} from './selectors'
import {
  getIsNameUsed,
  getProfileData,
  getProfileDataFromUser,
  getSSIDatum,
  getSharedEmail,
  getIsUnique,
  getProfile,
  getProfileId,
  getProfileAuctionData,
  getBoughtProfileAuctionData,
  getIsCrush,
} from './helpers'

export const useProfilesConfigInitialize = () => {
  const { chainId } = useActiveChainId()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchProfilesAsync({ chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()

  useSlowRefreshEffect(() => {
    const fetchPoolsDataWithFarms = async () => {
      batch(() => {
        dispatch(fetchProfilesAsync({ chainId }))
      })
    }

    fetchPoolsDataWithFarms()
  }, [dispatch, chainId])
}

export const usePool = (id) => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector(id), [id])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useProfilesConfigInitialize()
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

export const useProfileForAddress = (
  address: string,
  fetchConfiguration = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  },
): {
  profile?: any
  isFetching: boolean
  isValidating: boolean
  refresh: KeyedMutator<any>
} => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate, isValidating } = useSWR(
    address ? [address, 'profile', chainId] : null,
    () => getProfileDataFromUser(address, chainId),
    fetchConfiguration,
  )
  return {
    profile: data?.profile,
    isFetching: status === FetchStatus.Fetching,
    isValidating,
    refresh: mutate,
  }
}

export const useSSIForAddress = (
  address: string,
  fetchConfiguration = {
    revalidateIfStale: true,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  },
): {
  nfts?: any
  isFetching: boolean
  isValidating: boolean
  refresh: KeyedMutator<any>
} => {
  const { data, status, mutate, isValidating } = useSWR(
    address ? [address, 'identityTokens'] : null,
    () => getSSIDatum(address),
    fetchConfiguration,
  )
  return {
    nfts: data,
    isFetching: status === FetchStatus.Fetching,
    isValidating,
    refresh: mutate,
  }
}

export const useProfile = (): {
  profile?: any
  hasProfile: boolean
  status: any
  hasActiveProfile: boolean
  isInitialized: boolean
  isLoading: boolean
  refresh: KeyedMutator<any>
} => {
  const { account } = useWeb3React()
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWRImmutable(
    account ? [account, 'profile'] : null,
    () => getProfile(account, chainId),
    {
      use: [localStorageMiddleware],
    },
  )

  const { profile, profileId } = data ?? { profile: null, profileId: 0 }
  const isLoading = status === FetchStatus.Fetching
  const isInitialized = status === FetchStatus.Fetched || status === FetchStatus.Failed
  const hasProfile = isInitialized && Number(profileId) > 0
  const hasActiveProfile = true
  return { profile, hasProfile, status, hasActiveProfile, isInitialized, isLoading, refresh: mutate }
}

export const useGetSharedEmail = (account) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWR(['sharedEmail', account?.toLowerCase(), chainId], async () =>
    getSharedEmail(account?.toLowerCase(), chainId),
  )
  return {
    status,
    sharedEmail: data ?? false,
  }
}

export const useGetProfileAuctionData = () => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['useGetProfileAuctionData', chainId], async () => getProfileAuctionData(chainId))
  return {
    status,
    data,
    refetch,
  }
}

export const useGetBoughtProfileAuctionData = (profileId) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['useGetBoughtProfileAuctionData', profileId, chainId], async () =>
    getBoughtProfileAuctionData(profileId, chainId),
  )
  return {
    status,
    data,
    refetch,
  }
}

export const useGetIsUnique = (profileId) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWR(['useGetIsUnique', profileId, chainId], async () => getIsUnique(profileId, chainId))
  return {
    status,
    isUnique: data ?? false,
  }
}

export const useGetProfileData = (profileId) => {
  const { data, status, mutate } = useSWR(['profileData', profileId], async () => getProfileData(profileId))
  return {
    status,
    refetch: mutate,
    profile: data,
  }
}

export const useGetIsNameUsed = (name) => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWR(['isNameUsed', name, chainId], async () =>
    getIsNameUsed(name?.toUpperCase(), chainId),
  )
  return {
    status,
    refetch: mutate,
    isNameUsed: data ?? false,
  }
}

export const useGetIsCrush = (profileId) => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWR(['useGetIsCrush', profileId, chainId], async () =>
    getIsCrush(profileId, chainId),
  )
  return {
    status,
    refetch: mutate,
    isCrush: data ?? false,
  }
}

export const useGetProfileId = (address) => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWR(['getProfileId', address, chainId], async () =>
    getProfileId(address, chainId),
  )
  return {
    status,
    refetch: mutate,
    profileId: data ?? '0',
  }
}
