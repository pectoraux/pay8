import { useMemo } from 'react'
import { useAtom } from 'jotai'
import { FetchStatus } from 'config/constants/types'
import { getPancakeProfileAddress } from 'utils/addressHelpers'
import useSWR from 'swr'
import useSWRImmutable from 'swr/immutable'
import isEmpty from 'lodash/isEmpty'
import shuffle from 'lodash/shuffle'

import fromPairs from 'lodash/fromPairs'
import { getProfile } from 'state/profile/helpers'
import { ApiCollections, NftToken, NftAttribute, MarketEvent } from './types'
import {
  getCollection,
  getCollections,
  getTransactionsSg,
  getCollectionContracts,
  getPaymentCredits,
  getSubscriptionStatus,
  getPaywallARP,
  getDiscounted,
  getTokenForCredit,
  getNFTMarketTokenForCredit,
  getVeToken,
  getItemSg,
  getCollectionId,
  getTag,
  getPricePerMinute,
  getPaywallPricePerMinute,
  getEstimateVotes,
  getAskOrder,
  getMedia,
  getCollectibles,
  getNftAskOrder,
} from './helpers'
import { nftMarketActivityFiltersAtom, tryVideoNftMediaAtom, nftMarketFiltersAtom } from './atoms'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { decryptAllArticle, decryptArticle, decryptArticle2 } from 'utils/cancan'

const DEFAULT_NFT_ORDERING = { field: 'currentAskPrice', direction: 'asc' as 'asc' | 'desc' }
const DEFAULT_NFT_ACTIVITY_FILTER = { typeFilters: [], collectionFilters: [] }
const EMPTY_OBJECT = {}

export const useGetCollections = (where = {}) => {
  const { data, status, mutate } = useSWR(['cancan', 'collections', where], async () => getCollections(where))
  const collections = data ?? ({} as ApiCollections)
  return { data: collections, status, refetch: mutate }
}

export const useGetCollectibles = (nfticketId, where = {}) => {
  const { data, status, mutate } = useSWR(['useGetCollectibles', nfticketId, where], async () => getCollectibles(where))
  return { data, status, refetch: mutate }
}

export const useGetTransactions = (userAddress) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWR(['cancan', 'transactions'], async () => getTransactionsSg(chainId, userAddress))
  const transactions = data ?? ({} as any)
  return { data: transactions, status }
}

export const useGetProfileId = (account: string) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWR(['profileId', account, chainId], async () => getProfile(account, chainId))
  return { data, status }
}

export const useDecryptAllArticle = (chk) => {
  const {
    data,
    mutate: refetch,
    status,
  } = useSWR(['decryptAllArticle', chk?.length], async () => decryptAllArticle(chk))
  return {
    data,
    refetch,
    status,
  }
}

export const useDecryptArticle = (chk) => {
  const { data, mutate: refetch, status } = useSWR(['decryptArticle', chk?.length], async () => decryptArticle(chk))
  return {
    data,
    refetch,
    status,
  }
}

export const useDecryptArticle2 = (chk, cursor) => {
  const {
    data,
    mutate: refetch,
    status,
  } = useSWR(['decryptArticle2', chk?.length, cursor], async () => decryptArticle2(chk, cursor))
  return {
    data,
    refetch,
    status,
  }
}

export const useGetOrder = (collectionId, tokenId) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWR(['getOrder', collectionId, tokenId, chainId], async () =>
    getAskOrder(collectionId, tokenId, chainId),
  )
  return { data, status }
}

export const useGetNftOrder = (collectionId, tokenId) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWR(['useGetNftOrder', collectionId, tokenId, chainId], async () =>
    getNftAskOrder(collectionId, tokenId, chainId),
  )
  return { data, status }
}

export const useGetPricePerMinute = (merchantId: string) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['pricePerMinute', merchantId, chainId], async () => getPricePerMinute(merchantId, chainId))
  return data
}

export const useGetEstimateVotes = (collectionId: string) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['estimatevotes1', collectionId, chainId], async () =>
    getEstimateVotes(collectionId, chainId),
  )
  return data
}

export const useGetPaywallPricePerMinute = (paywallAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWR(['paywallPricePerMinute', paywallAddress, chainId], async () =>
    getPaywallPricePerMinute(paywallAddress, chainId),
  )
  return data
}

export const useGetCollection = (collectionAddress: string) => {
  const checksummedCollectionAddress = collectionAddress || ''
  const {
    data,
    mutate: refresh,
    status,
  } = useSWR(checksummedCollectionAddress ? ['cancan', 'collection', checksummedCollectionAddress] : null, async () =>
    getCollection(checksummedCollectionAddress),
  )
  return {
    collection: data ?? ({} as any),
    refresh,
    isFetching: status !== FetchStatus.Fetched,
  }
}

export const useGetVeToken = (veAddress) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(['veToken', chainId], async () => getVeToken(veAddress, chainId))
  return data
}

export const useGetShuffledCollections = (searchQuery) => {
  const { data } = useSWR(['cancan', 'collections', searchQuery], async () => getCollections(searchQuery))
  const collections = data ?? ({} as ApiCollections)
  const { data: shuffledCollections, status } = useSWR(
    !isEmpty(collections) ? ['cancan', 'shuffledCollections', searchQuery] : null,
    () => {
      return shuffle(collections)
    },
  )
  return { data: shuffledCollections, status }
}

export const useApprovalNfts = (nftsInWallet: NftToken[]) => {
  const nftApprovalCalls = useMemo(
    () =>
      nftsInWallet.map((nft: NftToken) => {
        const { tokenId, collectionAddress } = nft

        return {
          address: collectionAddress,
          name: 'getApproved',
          params: [tokenId],
        }
      }),
    [nftsInWallet],
  )

  // const { data } = useSWRMulticall(erc721ABI, nftApprovalCalls)
  const data = {}
  const profileAddress = getPancakeProfileAddress()

  const approvedTokenIds = Array.isArray(data)
    ? fromPairs(data.flat().map((address, index) => [nftsInWallet[index].tokenId, profileAddress === address]))
    : null

  return { data: approvedTokenIds }
}

export const useGetTags = () => {
  const { data } = useSWR('cancan-tags', async () => getTag())
  return data?.name ?? ''
}

export const useGetNftFilters = (collectionAddress: string): Readonly<Record<string, NftAttribute>> => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  return nftMarketFilters[collectionAddress]?.activeFilters ?? EMPTY_OBJECT
}

export const useGetNftOrdering = (collectionAddress: string) => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  return nftMarketFilters[collectionAddress]?.ordering ?? DEFAULT_NFT_ORDERING
}

export const useGetNftShowOnlyOnSale = (collectionAddress: string) => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  return nftMarketFilters[collectionAddress]?.showOnlyOnSale ?? false
}

export const useGetNftShowOnlyUsers = (collectionAddress: string) => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  return nftMarketFilters[collectionAddress]?.showOnlyUsers ?? false
}

export const useGetNftShowSearch = (collectionAddress: string) => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  return nftMarketFilters[collectionAddress]?.showSearch ?? ''
}

export const useGetNftFilters2 = (collectionAddress: string) => {
  const [nftMarketFilters] = useAtom(nftMarketFiltersAtom)
  return nftMarketFilters[collectionAddress]?.showNftFilters ?? false
}

export const useTryVideoNftMedia = () => {
  const [tryVideoNftMedia] = useAtom(tryVideoNftMediaAtom)
  return tryVideoNftMedia ?? true
}

export const useGetNftActivityFilters = (
  collectionAddress: string,
): { typeFilters: MarketEvent[]; collectionFilters: string[] } => {
  const [nftMarketActivityFilters] = useAtom(nftMarketActivityFiltersAtom)
  return nftMarketActivityFilters[collectionAddress] ?? DEFAULT_NFT_ACTIVITY_FILTER
}

export const useGetCollectionContracts = (collectionAddress: string) => {
  const { data } = useSWRImmutable(['cancan', 'collectionContracts'], async () =>
    getCollectionContracts(collectionAddress),
  )
  return data
}

export const useGetPaymentCredits = (collectionAddress: string, tokenId: string, address: string) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(['cancan', 'paymentCredits', chainId], async () =>
    getPaymentCredits(collectionAddress, tokenId, address, chainId),
  )
  return data?.length === 0 ? 0 : data
}

export const useGetItem = (collectionAddress: string, tokenId: string) => {
  const { data } = useSWR(
    ['cancan-getItem', collectionAddress, tokenId],
    async () => getItemSg(`${collectionAddress}-${tokenId}`),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
    },
  )
  return data
}

export const useGetCollectionId = (collectionAddress) => {
  try {
    const { chainId } = useActiveChainId()
    const { data } = useSWR(
      ['cancan-getCollectionId', collectionAddress, chainId],
      async () => getCollectionId(collectionAddress, chainId),
      {
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: false,
      },
    )
    return data
  } catch (err) {
    console.log('useGetCollectionId err=============+>', err)
  }
}

export const useGetDiscounted = (
  collectionAddress: string,
  account: string,
  tokenId: string,
  price,
  options,
  identityTokenId = 0,
  isPaywall = false,
) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWR(
    ['cancan', 'getDiscounted2', account?.toLowerCase() ?? '', chainId],
    async () =>
      getDiscounted(
        collectionAddress,
        account?.toLowerCase(),
        tokenId,
        price,
        options,
        identityTokenId,
        isPaywall,
        chainId,
      ),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  )
  console.log('1useGetDiscounted==============>', data, status)
  return {
    discounted: data?.discounted,
    discount: data?.discount,
    status,
  }
}

export const useGetPaywallARP = (collectionAddress: string) => {
  const { data } = useSWRImmutable(['cancan', 'getPaywallARP', collectionAddress], async () =>
    getPaywallARP(collectionAddress),
  )
  return data as any
}

export const useGetTokenForCredit = (collectionAddress: string, isPaywall: boolean) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(['cancan', 'burnTokenForCredit', chainId], async () =>
    getTokenForCredit(collectionAddress, isPaywall, chainId),
  )
  return data as any
}

export const useGetNFTMarketTokenForCredit = (collectionAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(['nft', 'burnTokenForCredit', chainId], async () =>
    getNFTMarketTokenForCredit(collectionAddress, chainId),
  )
  return data as any
}

export const useGetMedia = (minterAddress: string) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(['useGetMedia', minterAddress, chainId], async () =>
    getMedia(minterAddress, chainId),
  )
  return data as any
}

export const useGetSubscriptionStatus = (
  paywallAddress: string,
  account: string,
  nfticketId: string,
  tokenId: string,
): any => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWR(
    ['subscription', paywallAddress, nfticketId, tokenId, account?.toLowerCase(), chainId],
    async () => getSubscriptionStatus(paywallAddress, account?.toLowerCase(), nfticketId, tokenId, chainId),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  )
  return {
    ongoingSubscription: data,
    status,
    refetch: mutate,
  }
}
