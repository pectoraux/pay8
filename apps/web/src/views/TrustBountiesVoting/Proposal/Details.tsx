import {
  Box,
  Card,
  useModal,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  LinkExternal,
  Text,
  Button,
  Farm as FarmUI,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Proposal } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { useGetBounty, useGetIsLocked, useGetLatestClaim, useGetTokenData } from 'state/trustbounties/hooks'

import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getTrustBountiesHelperAddress } from 'utils/addressHelpers'
import { Native } from '@pancakeswap/sdk'

import { IPFS_GATEWAY } from '../config'
import { ColorTag, ProposalStateTag } from '../components/Proposals/tags'
import CreateContentModal from './CreateContentModal'

interface DetailsProps {
  proposal: Proposal
}

const DetailBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
`

const Details: React.FC<any> = ({ proposal, onSuccess }) => {
  const { t } = useTranslation()
  const { VotesTag } = FarmUI.Tags
  const { chainId } = useActiveChainId()
  const startDate = new Date(proposal.creationTime * 1000)
  const endDate = new Date(proposal.endTime * 1000)
  const isLocked = useGetIsLocked(proposal?.defenderId ?? '0')
  const latestClaim = useGetLatestClaim(proposal?.defenderId ?? '0', proposal?.attackerId ?? '0')
  const bountyInfo = useGetBounty(proposal.defenderId)
  const tokenAddress = bountyInfo?.length && bountyInfo[1]
  const isNativeCoin = tokenAddress?.toLowerCase() === getTrustBountiesHelperAddress()?.toLowerCase()
  const token = isNativeCoin ? Native.onChain(chainId) : tokenAddress
  const { data: tokenData } = useGetTokenData(token ?? '')

  const amountClaimed =
    latestClaim?.length && bountyInfo[8]
      ? getBalanceNumber(new BigNumber(latestClaim[4]?.toString()), tokenData?.decimals)
      : 0
  const [presentUpdateTerms] = useModal(<CreateContentModal onSuccess={onSuccess} litigation={proposal} />)

  return (
    <Card mb="16px">
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Details')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Litigation ID')}</Text>
          <LinkExternal href={`${IPFS_GATEWAY}/${proposal.id}`} ml="8px">
            {proposal.id.slice(0, 8)}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Attacker ID')}</Text>
          <LinkExternal href={getBlockExploreLink(proposal.attackerId, 'address', chainId)} ml="8px">
            {proposal.attackerId}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" mb="16px">
          <Text color="textSubtle">{t('Defender ID')}</Text>
          <LinkExternal href={getBlockExploreLink(proposal.defenderId, 'block', chainId)} ml="8px">
            {proposal.defenderId}
          </LinkExternal>
        </Flex>
        <Flex alignItems="center" mb="16px">
          <Text color="textSubtle" bold mr="8px">
            {t('Claim will lock bounty')}
          </Text>
          {'->'}
          <Text color="primary" ml="8px">
            {isLocked ? 'Yes' : 'No'}
          </Text>
        </Flex>
        <Flex alignItems="center" mb="16px">
          <Text color="textSubtle" bold mr="8px">
            {t('%val% being claimed', { val: bountyInfo[8] ? 'Token' : 'Amount' })}
          </Text>
          {'->'}
          <Text color="primary" ml="8px">
            {bountyInfo[8] ? `${tokenData?.symbol?.toUpperCase()} #` : ''} {amountClaimed}{' '}
            {bountyInfo[8] ? '' : tokenData?.symbol?.toUpperCase()}
          </Text>
        </Flex>
        <DetailBox p="16px">
          <ProposalStateTag proposalState={proposal.active} mb="8px" style={{ marginRight: '10px' }} />
          <ColorTag votingPower={proposal.percentile} />
          <Flex justifyContent="flex" mb="8px">
            <VotesTag votingPower={parseInt(proposal?.upVotes ?? 0)?.toString()} color="green" />
          </Flex>
          <Flex justifyContent="flex" mb="8px">
            <VotesTag votingPower={parseInt(proposal?.downVotes ?? 0)?.toString()} color="red" />
          </Flex>
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('Start Date')}
            </Text>
            <Text ml="8px">{format(startDate, 'yyyy-MM-dd HH:mm')}</Text>
          </Flex>
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('End Date')}
            </Text>
            <Text ml="8px">{format(endDate, 'yyyy-MM-dd HH:mm')}</Text>
          </Flex>
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('Countries')}
            </Text>
            <Text ml="8px">{proposal?.countries}</Text>
          </Flex>
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('Cities')}
            </Text>
            <Text ml="8px">{proposal?.cities}</Text>
          </Flex>
          <Flex alignItems="center">
            <Text color="textSubtle" fontSize="14px">
              {t('Products')}
            </Text>
            <Text ml="8px">{proposal?.products}</Text>
          </Flex>
        </DetailBox>
        <Flex mt="8px" mb="8px" justifyContent="center" alignItems="center">
          <Button variant="secondary" disabled={!proposal?.active} onClick={presentUpdateTerms} scale="sm">
            {t('Update Statement')}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default Details
