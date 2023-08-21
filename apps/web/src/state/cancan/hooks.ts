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
} from './helpers'
import { nftMarketActivityFiltersAtom, tryVideoNftMediaAtom, nftMarketFiltersAtom } from './atoms'

const DEFAULT_NFT_ORDERING = { field: 'currentAskPrice', direction: 'asc' as 'asc' | 'desc' }
const DEFAULT_NFT_ACTIVITY_FILTER = { typeFilters: [], collectionFilters: [] }
const EMPTY_OBJECT = {}

export const useGetCollections = () => {
  const { data, status } = useSWR(['cancan', 'collections'], async () => getCollections())
  const collections = data ?? ({} as ApiCollections)
  return { data: collections, status }
}

export const useGetTransactions = (userAddress) => {
  const { data, status } = useSWR(['cancan', 'transactions2'], async () => getTransactionsSg(userAddress))
  const transactions = data ?? ({} as any)
  return { data: transactions, status }
}

export const useGetProfileId = (account: string) => {
  const { data, status } = useSWR(['profileId', account], async () => getProfile(account))
  return { data, status }
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
  const { data } = useSWRImmutable('veToken', async () => getVeToken(veAddress))
  return data
}

export const useGetShuffledCollections = () => {
  const { data } = useSWRImmutable(['cancan', 'collections'], async () => getCollections())
  const collections = data ?? ({} as ApiCollections)
  const { data: shuffledCollections, status } = useSWRImmutable(
    !isEmpty(collections) ? ['cancan', 'shuffledCollections'] : null,
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
  const { data } = useSWRImmutable(['cancan', 'paymentCredits'], async () =>
    getPaymentCredits(collectionAddress, tokenId, address),
  )
  return data?.length === 0 ? 0 : data
}

export const useGetItem = (collectionAddress: string, tokenId: string) => {
  const { data } = useSWR(
    ['cancan-getItem1', collectionAddress, tokenId],
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
    const { data } = useSWR(
      ['cancan-getCollectionId4', collectionAddress],
      async () => getCollectionId(collectionAddress),
      {
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnReconnect: false,
      },
    )
    console.log('useGetCollectionId==========>', data)
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
  const { data, status } = useSWR(
    ['cancan', 'getDiscounted2', account?.toLowerCase() ?? ''],
    async () =>
      getDiscounted(collectionAddress, account?.toLowerCase(), tokenId, price, options, identityTokenId, isPaywall),
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
  const { data } = useSWRImmutable(['cancan', 'getPaywallARP3'], async () => getPaywallARP(collectionAddress))
  return data as any
}

export const useGetTokenForCredit = (collectionAddress: string, isPaywall: boolean) => {
  const { data } = useSWRImmutable(['cancan', 'burnTokenForCredit'], async () =>
    getTokenForCredit(collectionAddress, isPaywall),
  )
  return data as any
}

export const useGetNFTMarketTokenForCredit = (collectionAddress: string) => {
  const { data } = useSWRImmutable(['nft', 'burnTokenForCredit'], async () =>
    getNFTMarketTokenForCredit(collectionAddress),
  )
  return data as any
}

export const useGetSubscriptionStatus = (
  paywallAddress: string,
  account: string,
  nfticketId: string,
  tokenId: string,
): any => {
  const { data, status } = useSWR(
    ['subscription3', paywallAddress, nfticketId, tokenId, account?.toLowerCase()],
    async () => getSubscriptionStatus(paywallAddress, account?.toLowerCase(), nfticketId, tokenId),
    {
      revalidateIfStale: true,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  )
  console.log('useGetSubscriptionStatus===================>', status, paywallAddress, account, data, nfticketId)
  return {
    ongoingSubscription: data,
    status,
  }
}
