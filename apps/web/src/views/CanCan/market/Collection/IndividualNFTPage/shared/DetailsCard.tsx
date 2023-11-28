import styled from 'styled-components'
import { Box, Flex, Text, SearchIcon, Link } from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import uriToHttp from '@pancakeswap/utils/uriToHttp'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import ExpandableCard from './ExpandableCard'

interface DetailsCardProps {
  contractAddress: string
  ipfsJson: string
  count?: number
  rarity?: number
}

const LongTextContainer = styled(Text)`
  max-width: 120px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`

const DetailsCard: React.FC<any> = ({ contractAddress }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const content = (
    <Box p="24px">
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
          {t('Channel ID')}
        </Text>
        <Link external href={getBlockExploreLink(contractAddress, 'address', chainId)}>
          <LongTextContainer bold>{contractAddress}</LongTextContainer>
        </Link>
      </Flex>
    </Box>
  )
  return <ExpandableCard title={t('Details')} icon={<SearchIcon width="24px" height="24px" />} content={content} />
}

export default DetailsCard
