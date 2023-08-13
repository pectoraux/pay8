import { useState, useEffect } from 'react'
import { Heading, Flex, Button, Grid, ChevronRightIcon, NextLinkFromReactRouter } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { getLatestListedNfts } from 'state/cancan/helpers'
import { nftsBaseUrl } from 'views/CanCan/market/constants'
import { isAddress } from 'utils'

import { CollectibleLinkCard } from '../components/CollectibleCard'
import GridPlaceholder from '../components/GridPlaceholder'

/**
 * Fetch latest NFTs data from SG+API and combine them
 * @returns Array of NftToken
 */
const useNewestNfts = () => {
  const [newestNfts, setNewestNfts] = useState<any>(null)

  useEffect(() => {
    const fetchNewestNfts = async () => {
      const nftsFromSg = await getLatestListedNfts(16)
      console.log('nftsFromSg================>', Object.values(nftsFromSg))
      const nfts = nftsFromSg?.length ? Object.values(nftsFromSg) : []
      setNewestNfts(nfts)
    }
    fetchNewestNfts()
  }, [])

  return newestNfts
}

const Newest: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const nfts = useNewestNfts()

  return (
    <>
      {nfts?.length ? (
        <Flex justifyContent="space-between" alignItems="center" mb="26px">
          <Heading data-test="nfts-newest">{t('Newest Arrivals')}</Heading>
          <Button
            as={NextLinkFromReactRouter}
            to={`${nftsBaseUrl}/activity/`}
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
          gridRowGap="24px"
          gridColumnGap="16px"
          gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(2, 1fr)', 'repeat(4, 1fr)']}
        >
          {nfts.map((nft) => {
            const currentAskPrice = nft.marketData?.isTradable ? parseFloat(nft.marketData?.currentAskPrice) : undefined
            return (
              <CollectibleLinkCard
                data-test="newest-nft-card"
                key={nft.collectionAddress + nft.tokenId}
                nft={nft}
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
