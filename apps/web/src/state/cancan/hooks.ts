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
import { useActiveChainId } from 'hooks/useActiveChainId'
import { decryptAllArticle, decryptArticle, decryptArticle2, decryptContent, getThumbnailNContent } from 'utils/cancan'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

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
  getExtraNote,
  getMedia,
  getCollectibles,
  getNftAskOrder,
  getNftDiscounted,
  getProtocolInfo,
  getPaywallAskOrder,
  getPendingRevenue,
  getSponsorRevenue,
  getSuperchatRevenue,
  getPendingRevenueFromNote,
  getTokenURIs,
  getTimeEstimate,
  getCashback,
  getNftCashback,
  getCashbackRevenue,
  getNftCashbackRevenue,
  getNftTokenForCredit,
  getTagFromProductId,
  getTagFromCollectionId,
} from './helpers'
import { nftMarketActivityFiltersAtom, tryVideoNftMediaAtom, nftMarketFiltersAtom } from './atoms'

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
  const {
    data,
    mutate: refetch,
    status,
  } = useSWRImmutable(['decryptArticle', chk?.length], async () => decryptArticle(chk))
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
  } = useSWRImmutable(['decryptArticle2', chk?.length, cursor], async () => decryptArticle2(chk, cursor))
  return {
    data,
    refetch,
    status,
  }
}

export const useGetExtraNote = (collectionId, buyer, tokenId, isItem) => {
  const where = isItem
    ? {
        collection_: { id: collectionId },
        user_: { id: buyer || ADDRESS_ZERO },
        item: tokenId,
      }
    : {
        collection_: { id: collectionId },
        user_: { id: buyer || ADDRESS_ZERO },
        paywall: tokenId,
      }
  const {
    data,
    mutate: refetch,
    status,
  } = useSWRImmutable(['useGetExtraNote3', collectionId, buyer, tokenId, isItem], async () => getExtraNote(where))
  return {
    data,
    refetch,
    status,
  }
}

export const useGetOrder = (collectionId, tokenId, isPaywall = false) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWR(['getOrder', collectionId, tokenId, isPaywall, chainId], async () => {
    if (isPaywall) {
      return getPaywallAskOrder(collectionId, tokenId, chainId)
    }
    return getAskOrder(collectionId, tokenId, chainId)
  })
  return { data, status }
}

export const useGetNftOrder = (collectionId, tokenId, isPaywall = false) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWR(['useGetNftOrder', collectionId, tokenId, chainId], async () => {
    if (isPaywall) {
      return getPaywallAskOrder(collectionId, tokenId, chainId)
    }
    return getNftAskOrder(collectionId, tokenId, chainId)
  })
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

export const useGetPendingRevenue = (tokenAddress, collectionAddress) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWRImmutable(['useGetPendingRevenue', chainId], async () =>
    getPendingRevenue(tokenAddress, collectionAddress, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}

export const useGetPendingFromNote = (tokenAddress, tokenId) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWR(['cancan-useGetPendingFromNote', tokenAddress, tokenId, chainId], async () =>
    getPendingRevenueFromNote(tokenAddress, tokenId, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}

export const useGetTokenURIs = (collectionOwner) => {
  const { chainId } = useActiveChainId()
  const {
    data,
    status,
    mutate: refetch,
  } = useSWR(['cancan-useGetTokenURIs1', collectionOwner], async () => getTokenURIs(collectionOwner, chainId))
  return { data, refetch, status }
}

export const useGetSponsorRevenue = (collectionAddress) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWRImmutable(['useGetSponsorRevenue', chainId], async () =>
    getSponsorRevenue(collectionAddress, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}

export const useGetSuperchatRevenue = (collectionAddress) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWRImmutable(['useGetSuperchatRevenue', chainId], async () =>
    getSuperchatRevenue(collectionAddress, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
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
  return data ?? ''
}

export const useGetTagsFromProductId = (productId) => {
  const { data } = useSWR(['cancan-tags', productId], async () => getTagFromProductId(productId))
  return data ?? ''
}

export const useGetTagFromCollectionId = (collectionIds) => {
  const { data } = useSWR(['useGetTagFromCollectionId', collectionIds?.length], async () =>
    getTagFromCollectionId(collectionIds),
  )
  return data ?? ''
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
  const { data, mutate } = useSWRImmutable(['cancan', 'paymentCredits', chainId], async () =>
    getPaymentCredits(collectionAddress, tokenId, address, chainId),
  )
  return {
    refetch: mutate,
    data: data?.length === 0 ? 0 : data,
  }
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
  const { data, status, mutate } = useSWR(
    ['cancan', 'useGetDiscounted', account?.toLowerCase() ?? '', chainId],
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
  return {
    discounted: data?.discounted,
    discount: data?.discount,
    refetch: mutate,
    status,
  }
}

export const useGetNftDiscounted = (
  collectionAddress: string,
  account: string,
  tokenId: string,
  price,
  options,
  identityTokenId = 0,
  isPaywall = false,
) => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWR(
    ['useGetNftDiscounted', account?.toLowerCase() ?? '', chainId],
    async () =>
      getNftDiscounted(
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
  return {
    discounted: data?.discounted,
    discount: data?.discount,
    refetch: mutate,
    status,
  }
}

export const useGetPaywallARP = (collectionAddress: string, tokenId) => {
  const { data } = useSWRImmutable(['cancan', 'getPaywallARP', collectionAddress, tokenId], async () =>
    getPaywallARP(collectionAddress, tokenId),
  )
  return data as any
}

export const useGetTokenForCredit = (collectionAddress: string, isPaywall: boolean) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWRImmutable(['cancan', 'burnTokenForCredit7', isPaywall, chainId], async () =>
    getTokenForCredit(collectionAddress, isPaywall, chainId),
  )
  return {
    data,
    status,
  }
}

export const useGetNftTokenForCredit = (collectionAddress: string, isPaywall: boolean) => {
  const { chainId } = useActiveChainId()
  const { data, status } = useSWRImmutable(['nft', 'burnTokenForCredit', isPaywall, chainId], async () =>
    getNftTokenForCredit(collectionAddress, isPaywall, chainId),
  )
  return {
    data,
    status,
  }
}

export const useComputeCashBack = (collectionAddress: string, tokenId: string, isPaywall: boolean) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWRImmutable(['cancan', 'useComputeCashBack', tokenId, isPaywall, chainId], async () =>
    getCashback(collectionAddress, tokenId, isPaywall, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}

export const useComputeNftCashBack = (collectionAddress: string, tokenId: string, isPaywall: boolean) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWRImmutable(['nft', 'useComputeCashBack', tokenId, isPaywall, chainId], async () =>
    getNftCashback(collectionAddress, tokenId, isPaywall, chainId),
  )
  return {
    data,
    refetch: mutate,
  }
}

export const useGetCashbackRevenue = (collectionAddress: string, tokenId: string, isPaywall: boolean) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWRImmutable(['cancan', 'useGetCashbackRevenue', tokenId, isPaywall, chainId], async () =>
    getCashbackRevenue(collectionAddress, tokenId, isPaywall, chainId),
  )
  return data as any
}

export const useGetNftCashbackRevenue = (collectionAddress: string, tokenId: string, isPaywall: boolean) => {
  const { chainId } = useActiveChainId()
  const { data, mutate } = useSWRImmutable(['nft', 'useGetCashbackRevenue', tokenId, isPaywall, chainId], async () =>
    getNftCashbackRevenue(collectionAddress, tokenId, isPaywall, chainId),
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

export const useGetTimeEstimates = (collectionId, item, marketPlaceHelper, options) => {
  const { chainId } = useActiveChainId()
  const { data } = useSWRImmutable(
    [
      'useGetTimeEstimates',
      collectionId,
      item,
      marketPlaceHelper,
      options?.length,
      options?.length && options[0],
      chainId,
    ],
    async () => getTimeEstimate(collectionId, item, marketPlaceHelper, options, chainId),
  )
  return data as any
}

export const useGetThumbnailNContent = (nft) => {
  const { data, mutate } = useSWRImmutable(['useGetThumbnailNContent', nft?.id], async () => getThumbnailNContent(nft))
  return {
    refetch: mutate,
    mp4: data?.mp4,
    thumbnail: data?.thumbnail,
    isArticle: data?.isArticle,
    contentType: data?.contentType,
  }
}

export const useGetDecryptedContent = (nft, thumbnail, mp4, ongoingSubscription, account) => {
  const { data, mutate } = useSWRImmutable(
    ['useGetDecryptedContent', nft?.id, thumbnail, mp4, ongoingSubscription, account],
    async () => decryptContent(nft, thumbnail, mp4, ongoingSubscription, account),
  )
  return {
    refetch: mutate,
    mp4: data?.mp4,
    thumbnail: data?.thumbnail,
  }
}

export const useGetSubscriptionStatus = (
  paywallAddress: string,
  account: string,
  nfticketId: string,
  tokenId: string,
): any => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWRImmutable(
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

export const useGetProtocolInfo = (paywallAddress: string, account: string, tokenId): any => {
  const { chainId } = useActiveChainId()
  const { data, status, mutate } = useSWR(
    ['useGetProtocolInfo4', paywallAddress, account?.toLowerCase(), tokenId, chainId],
    async () => getProtocolInfo(paywallAddress, account?.toLowerCase(), tokenId, chainId),
    {
      revalidateIfStale: true,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    },
  )
  return {
    protocolInfo: (data as any)?.protocolInfo,
    dueReceivables: (data as any)?.dueReceivables,
    bufferTime: (data as any)?.bufferTime,
    pricePerSecond: (data as any)?.pricePerSecond,
    paused: (data as any)?.paused,
    profileIdRequired: (data as any)?.profileIdRequired,
    protocolId: (data as any)?.protocolId,
    subscription: (data as any)?.subscription,
    status,
    refetch: mutate,
  }
}
