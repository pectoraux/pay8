import { Box, Flex, Grid, Text, Button, OpenNewIcon, IconButton, Link, VerifiedIcon } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { getBscScanLinkForNft } from 'utils'
import { NftToken, Collection } from 'state/cancan/types'
// import { useGetCollectionBounties } from 'state/cancan/hooks'
import { useTranslation } from '@pancakeswap/localization'
import ExpandableCard from '../shared/ExpandableCard'
import { SmallRoundedImage, CollectibleRowContainer } from '../shared/styles'
import { useGetTokenURIs } from 'state/valuepools/hooks'
import { getAuditorHelperAddress } from 'utils/addressHelpers'
import Iframe from 'react-iframe'
import Divider from 'components/Divider'

interface CollectibleRowProps {
  badgeNft: NftToken
  variant: 'Product' | 'Channel' | 'Bounty'
}

interface CollectibleByLocationProps {
  badgeNft: NftToken
  variant: 'Product' | 'Channel' | 'Bounty'
  title: boolean
  onSuccess: () => void
}

interface ManageNFTsCardProps {
  nft?: NftToken
  collection: Collection
  onSuccess: () => void
}

const StyledBox = styled(Box)`
  mb: 0px;
  pb: 0px;
  overflow: auto;
  max-height: 50vh;
  ::-webkit-scrollbar {
    display: none;
  }
`

const AuditNFTsCard: React.FC<any> = ({ collection, nft, onSuccess }) => {
  const { t } = useTranslation()
  const { data: tokenURIs } = useGetTokenURIs(getAuditorHelperAddress(), [
    {
      tokenId: parseInt(collection.badgeId ?? '0'),
    },
    {
      tokenId: parseInt(nft.rsrcTokenId ?? '0'),
    },
  ])
  const content = (
    <StyledBox>
      <Flex flexDirection="column" height="1100px" justifyContent="center" overflowY="hidden" alignItems="center">
        {!parseInt(collection.badgeId ?? '0') ? (
          <Text px="16px" pb="16px" color="failure">
            {t('This channel has not been audited.')}
          </Text>
        ) : tokenURIs?.length ? (
          <>
            <Text color="primary">{t('Channel Badge')}</Text>
            <Iframe url={tokenURIs[0]?.metadataUrl} height="500px" id="myChannelBadge" />
            <Divider />
          </>
        ) : null}
        {!parseInt(nft.rsrcTokenId ?? '0') ? (
          <Text px="16px" pb="16px" color="failure">
            {t('This product has not been audited.')}
          </Text>
        ) : tokenURIs?.length ? (
          <>
            <Iframe url={tokenURIs[1]?.metadataUrl} height="500px" id="myNFTBadge" />
            <Text color="primary">{t('Product Badge')}</Text>
          </>
        ) : null}
      </Flex>
    </StyledBox>
  )
  return (
    <ExpandableCard
      title={t('Backings')}
      icon={<VerifiedIcon ml="10px" width="24px" height="24px" />}
      content={content}
    />
  )
}

export default AuditNFTsCard
