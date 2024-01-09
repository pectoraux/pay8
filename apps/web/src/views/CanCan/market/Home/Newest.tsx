import { useState, useEffect } from 'react'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useGetNftFilters } from 'state/cancan/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { getLatestListedItems } from 'state/cancan/helpers'
import { selectFilteredData } from 'state/cancan/selectors'
import { cancanBaseUrl } from 'views/CanCan/market/constants'
import { Heading, Flex, Button, Grid, ChevronRightIcon, NextLinkFromReactRouter } from '@pancakeswap/uikit'

import GridPlaceholder from '../components/GridPlaceholder'
import { CollectibleLinkCard } from '../components/CollectibleCard'

/**
 * Fetch latest NFTs data from SG+API and combine them
 * @returns Array of NftToken
 */
const useNewestNfts = () => {
  const [newestNfts, setNewestNfts] = useState<any>(null)

  useEffect(() => {
    const fetchNewestNfts = async () => {
      const nftsFromSg = await getLatestListedItems(16)
      const nfts = Object.values(nftsFromSg)
      setNewestNfts(nfts)
    }
    fetchNewestNfts()
  }, [])

  return newestNfts
}

const Newest: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const _nfts = useNewestNfts()
  const filters = useGetNftFilters(ADDRESS_ZERO) as any
  const nfts = selectFilteredData(_nfts, filters)

  return (
    <>
      {nfts?.length ? (
        <Flex justifyContent="space-between" alignItems="center" mb="26px">
          <Heading data-test="nfts-newest">{t('Newest Arrivals')}</Heading>
          <Button
            as={NextLinkFromReactRouter}
            to={`${cancanBaseUrl}/collections/`}
            variant="secondary"
            scale="sm"
            endIcon={<ChevronRightIcon color="primary" />}
          >
            {t('View All')}
          </Button>
        </Flex>
      ) : null}
      {nfts ? (
        <Grid
          gridGap="16px"
          gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
          alignItems="start"
        >
          {nfts.map((nft) => {
            const currentAskPrice = nft?.isTradable ? parseFloat(nft?.currentAskPrice) : undefined
            return (
              <CollectibleLinkCard
                data-test="newest-nft-card"
                key={nft.collectionAddress + nft.tokenId}
                nft={nft}
                collectionId={nft?.collection?.id}
                currentAskPrice={currentAskPrice}
              />
            )
          })}
        </Grid>
      ) : (
        <GridPlaceholder numItems={8} />
      )}
    </>
  )
}

export default Newest
