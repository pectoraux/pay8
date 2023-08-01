import { Address, useAccount } from 'wagmi'
import { FetchStatus } from 'config/constants/types'
import { useCallback } from 'react'
import { useErc721CollectionContract } from 'hooks/useContract'
import { getItemSg, getPaywallSg, getNftsMarketData } from 'state/cancan/helpers'
import { NftLocation, NftToken, TokenMarketData } from 'state/nftMarket/types'
import { useProfile } from 'state/profile/hooks'
import useSWR from 'swr'
import { NOT_ON_SALE_SELLER } from 'config/constants'
import { isAddress } from 'utils'

const useNftOwn = (collectionAddress: string, tokenId: string, marketData?: TokenMarketData) => {
  const { address: account } = useAccount()
  const { isInitialized: isProfileInitialized, profile } = useProfile()

  return useSWR(
    account && isProfileInitialized ? ['nft', 'own', collectionAddress, tokenId, marketData?.currentSeller] : null,
    async () => {
      let isOwn = false
      let nftIsProfilePic = false
      let location: NftLocation

      nftIsProfilePic = tokenId === profile?.tokenId?.toString() && collectionAddress === profile?.collectionAddress
      if (nftIsProfilePic) {
        isOwn = true
        location = NftLocation.PROFILE
      } else {
        isOwn = isAddress(marketData?.currentSeller) === isAddress(account)
        location = NftLocation.FORSALE
      }

      return {
        isOwn,
        nftIsProfilePic,
        location,
      }
    },
  )
}

export const useCompleteNft = (collectionAddress: string, tokenId: string, isPaywall = false) => {
  const { data: nft, mutate } = useSWR(
    collectionAddress && tokenId ? ['cancan', collectionAddress, tokenId] : null,
    async () => {
      return isPaywall ? getPaywallSg(`${collectionAddress}-${tokenId}`) : getItemSg(`${collectionAddress}-${tokenId}`)
    },
  )

  const { data: marketData, mutate: refetchNftMarketData } = useSWR(
    collectionAddress && tokenId ? ['cancan', 'marketData', collectionAddress, tokenId] : null,
    async () => {
      const [marketDatas] = await Promise.all([getNftsMarketData({ collection: collectionAddress, tokenId }, 1)])
      const marketDat = marketDatas.find((data) => data.tokenId === tokenId)

      if (!marketDat) return null

      return marketDat
    },
  )

  const { data: nftOwn, mutate: refetchNftOwn, status } = useNftOwn(collectionAddress, tokenId, marketData)

  const refetch = useCallback(async () => {
    await mutate()
    await refetchNftMarketData()
    await refetchNftOwn()
  }, [mutate, refetchNftMarketData, refetchNftOwn])

  return {
    combinedNft: nft ? { ...nft, marketData, location: nftOwn?.location ?? NftLocation.WALLET } : undefined,
    isOwn: nftOwn,
    isProfilePic: nftOwn?.nftIsProfilePic || false,
    isLoading: status !== FetchStatus.Fetched,
    refetch,
  }
}
