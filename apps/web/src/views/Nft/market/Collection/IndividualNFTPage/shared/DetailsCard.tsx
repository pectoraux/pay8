import styled from 'styled-components'
import { Box, Flex, Text, SearchIcon, Link, LinkExternal } from '@pancakeswap/uikit'
import { getBlockExploreLink } from 'utils'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import uriToHttp from '@pancakeswap/utils/uriToHttp'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import ExpandableCard from './ExpandableCard'
import truncateHash from '@pancakeswap/utils/truncateHash'

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

const DetailsCard: React.FC<any> = ({ nft, contractAddress, ipfsJson, count, rarity }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const ipfsLink = ipfsJson ? uriToHttp(ipfsJson)[0] : null
  const content = (
    <Box p="24px">
      <Flex justifyContent="space-between" alignItems="center" mb="16px">
        <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
          {t('Channel ID')}
        </Text>
        <LongTextContainer bold>{contractAddress}</LongTextContainer>
      </Flex>
      {nft?.minter?.length ? (
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Contract Address')}</Text>
          <LinkExternal href={getBlockExploreLink(nft?.minter, 'address', chainId)} ml="8px">
            {truncateHash(nft?.minter, 10, 10)}
          </LinkExternal>
        </Flex>
      ) : null}
      {nft?.nftokenId?.toString() ? (
        <Flex justifyContent="space-between" alignItems="center" mb="16px">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('Token ID')}
          </Text>
          <LongTextContainer bold>{nft?.nftokenId?.toString()}</LongTextContainer>
        </Flex>
      ) : null}
      {nft?.nftype ? (
        <Flex justifyContent="space-between" alignItems="center" mb="16px">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('Token Type')}
          </Text>
          <LongTextContainer bold>{nft?.nftype === 1 ? 'ERC721' : 'ERC1155'}</LongTextContainer>
        </Flex>
      ) : null}
      {ipfsLink && (
        <Flex justifyContent="space-between" alignItems="center" mb="16px">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            IPFS JSON
          </Text>
          <Link external href={ipfsLink}>
            <LongTextContainer bold>{ipfsLink}</LongTextContainer>
          </Link>
        </Flex>
      )}
      {count && (
        <Flex justifyContent="space-between" alignItems="center" mb="16px" mr="4px">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('Supply Count')}
          </Text>
          <LongTextContainer bold>{formatNumber(count, 0, 0)}</LongTextContainer>
        </Flex>
      )}
      {rarity && (
        <Flex justifyContent="space-between" alignItems="center" mr="4px">
          <Text fontSize="12px" color="textSubtle" bold textTransform="uppercase">
            {t('Rarity')}
          </Text>
          <LongTextContainer bold>{`${formatNumber(rarity, 0, 2)}%`}</LongTextContainer>
        </Flex>
      )}
    </Box>
  )
  return <ExpandableCard title={t('Details')} icon={<SearchIcon width="24px" height="24px" />} content={content} />
}

export default DetailsCard
