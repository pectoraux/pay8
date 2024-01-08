import useSWR from 'swr'
import { useRouter } from 'next/router'
import { useEffect, useMemo } from 'react'
import useSWRImmutable from 'swr/immutable'
import { batch, useSelector } from 'react-redux'
import { useAppDispatch } from 'state'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { FAST_INTERVAL } from 'config/constants'
import { requiresApproval } from 'utils/requiresApproval'
import { fetchValuepoolsAsync, fetchValuepoolSgAsync } from '.'
import {
  currPoolSelector,
  currBribeSelector,
  poolsWithFilterSelector,
  makePoolWithUserDataLoadingSelector2,
  makePoolWithUserDataLoadingSelector3,
  filterSelector,
  filterSelector2,
} from './selectors'
import {
  getBribe,
  getERC20BalanceOf,
  getERC721BalanceOf,
  getGauge,
  getTag,
  getTokenURIs,
  getVoteOption,
  getWithdrawable,
} from './helpers'

export const useGetTags = () => {
  const { data } = useSWR('valuepools-tags6', async () => getTag())
  console.log('usetag============>', data)
  return data ?? ''
}

export const useValuepoolsConfigInitialize = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const fromVesting = router.pathname.includes('vesting')
  const fromValuepool = router.query.valuepool
  useEffect(() => {
    if (chainId) {
      batch(() => {
        const init = true
        dispatch(fetchValuepoolSgAsync({ fromVesting, fromValuepool }))
        dispatch(fetchValuepoolsAsync({ fromVesting, fromValuepool, chainId, init }))
      })
    }
  }, [dispatch, chainId])
}

export const useFetchPublicPoolsData = () => {
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const fromVesting = router.pathname.includes('vesting')
  const fromValuepool = router.query.valuepool

  useSWR(
    ['/valuepools', chainId],
    async () => {
      const fetchPoolsDataWithFarms = async () => {
        batch(() => {
          dispatch(fetchValuepoolSgAsync({ fromVesting, fromValuepool }))
          dispatch(fetchValuepoolsAsync({ fromVesting, fromValuepool, chainId }))
        })
      }
      fetchPoolsDataWithFarms()
    },
    {
      revalidateOnFocus: false,
      revalidateIfStale: true,
      revalidateOnReconnect: true,
      revalidateOnMount: true,
      refreshInterval: FAST_INTERVAL,
      keepPreviousData: true,
    },
  )
}

export const usePool = (id): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector2(id), [id])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePool2 = (address): { pool?: any; userDataLoaded: boolean } => {
  const poolWithUserDataLoadingSelector = useMemo(() => makePoolWithUserDataLoadingSelector3(address), [address])
  return useSelector(poolWithUserDataLoadingSelector)
}

export const usePoolsPageFetch = () => {
  useValuepoolsConfigInitialize()
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
  const { chainId } = useActiveChainId()
  const {
    data,
    mutate: refetch,
    status,
  } = useSWRImmutable(
    ['valuepool1-allowance', c?.address?.toLowerCase(), a?.toLowerCase(), s?.toLowerCase(), chainId],
    async () => requiresApproval(c, a, s),
  )
  return {
    isRequired: data ?? true,
    status,
    refetch,
  }
}

export const useFilters = () => {
  return useSelector(filterSelector)
}

export const useFilters2 = () => {
  return useSelector(filterSelector2)
}

export const useGetTokenURIs = (vaAddress, nfts) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['useGetTokenURIs1', vaAddress, nfts?.length], async () => getTokenURIs(vaAddress, nfts, chainId))
  return { data, refetch, status }
}

export const useGetBalanceOf = (tokenAddress, recipientAddress, isNFT) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['useGetBalanceOf1', tokenAddress, recipientAddress, isNFT], async () => {
    if (isNFT > 0) {
      return getERC721BalanceOf(tokenAddress, recipientAddress, chainId)
    }
    return getERC20BalanceOf(tokenAddress, recipientAddress, chainId)
  })
  return { data, refetch, status }
}

export const useGetVoteOption = (veAddress) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['useGetVoteOption', veAddress], async () => getVoteOption(veAddress, chainId))
  return { data, refetch, status }
}

export const useGetGauge = (proposalId) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['useGetGauge', proposalId], async () => getGauge(proposalId, chainId))
  return { data, refetch, status }
}

export const useGetBribe = (proposalId) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['useGetBribe', proposalId], async () => getBribe(proposalId, chainId))
  return { data, refetch, status }
}

export const useGetWithdrawable = (veAddress, tokenId) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['useGetWithdrawable', veAddress, tokenId], async () => getWithdrawable(veAddress, tokenId, chainId))
  return { data, refetch, status }
}
