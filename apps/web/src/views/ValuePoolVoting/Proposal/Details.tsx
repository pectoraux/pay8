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
  Balance,
  Farm as FarmUI,
  Button,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Proposal } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useGetTokenData } from 'state/ramps/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { ProposalStateTag } from '../components/Proposals/tags'
import { useGetBribe, useGetGauge } from 'state/valuepools/hooks'
import BigNumber from 'bignumber.js'
import { Divider } from 'views/ARPs/components/styles'
import { useActiveChainId } from 'hooks/useActiveChainId'
import UpdateBribe from './UpdateBribe'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

interface DetailsProps {
  proposal: Proposal
}

const DetailBox = styled(Box)`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 16px;
`

const Details: React.FC<any> = ({ proposal }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { VotesTag } = FarmUI.Tags
  const startDate = new Date(proposal?.created * 1000)
  const endDate = new Date(proposal?.endTime * 1000)
  const isPercentile = parseInt(proposal?.upVotes) < 100 && parseInt(proposal?.downVotes) < 100
  const { data: tokenData } = useGetTokenData(proposal?.id) as any
  const upVotes = isPercentile
    ? parseInt(proposal?.upVotes)
    : getBalanceNumber(proposal?.upVotes ?? 0, tokenData?.decimals)
  const downVotes = isPercentile
    ? parseInt(proposal?.downVotes)
    : getBalanceNumber(proposal?.downVotes ?? 0, tokenData?.decimals)
  const veAddress = proposal?.valuepool?.id
  const { data: gauge } = useGetGauge(proposal?.id)
  const { data: bribe } = useGetBribe(proposal?.id)
  const { data: gaugeTokenData } = useGetTokenData(gauge?.length ? gauge[3] : '') as any
  const { data: bribeTokenData } = useGetTokenData(bribe?.length ? bribe[1] : '') as any
  const [presentUpdateBribe] = useModal(<UpdateBribe veAddress={veAddress} proposal={proposal} />)
  return (
    <Card mb="16px">
      <CardHeader>
        <Heading as="h3" scale="md">
          {t('Details')}
        </Heading>
      </CardHeader>
      <CardBody>
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Author')}</Text>
          <LinkExternal href={getBlockExploreLink(proposal?.owner, 'address', chainId)} ml="8px">
            {truncateHash(proposal?.owner, 10, 10)}
          </LinkExternal>
        </Flex>
        <Divider />
        {gauge?.length ? (
          <>
            <Flex alignItems="center" mb="8px">
              <Text color="textSubtle">{t('gauge Token')}</Text>
              <LinkExternal href={getBlockExploreLink(gauge[3], 'address', chainId)} ml="8px">
                {truncateHash(gauge[3], 7, 5)}
              </LinkExternal>
            </Flex>
            <Flex alignItems="center" mb="8px">
              <Text color="textSubtle" mr="4px">
                {t('Claiming')}
              </Text>
              <Balance
                lineHeight="1"
                color="primary"
                decimals={12}
                value={getBalanceNumber(new BigNumber(gauge[0]?.toString() ?? '0'), gaugeTokenData?.decimals ?? 18)}
                unit={` ${gaugeTokenData?.symbol ?? ''}`}
              />
            </Flex>
          </>
        ) : null}
        <Divider />
        {bribe?.length && bribe[1] !== ADDRESS_ZERO ? (
          <>
            <Flex alignItems="center" mb="8px">
              <Text color="textSubtle">{t('Bribe Token')}</Text>
              <LinkExternal href={getBlockExploreLink(bribe[1], 'address')} ml="8px">
                {truncateHash(bribe[1], 7, 5)}
              </LinkExternal>
            </Flex>
            <Flex alignItems="center" mb="8px">
              <Text color="textSubtle" mr="4px">
                {t('Bribe Amount')}
              </Text>
              <Balance
                lineHeight="1"
                color="primary"
                decimals={12}
                value={getBalanceNumber(new BigNumber(bribe[0]?.toString() ?? '0'), bribeTokenData?.decimals ?? 18)}
                unit={` ${bribeTokenData?.symbol ?? ''}`}
              />
            </Flex>
          </>
        ) : null}
        <DetailBox p="16px">
          <ProposalStateTag proposalState={proposal?.active} mb="8px" style={{ marginRight: '10px' }} />
          <Flex justifyContent="flex" mb="8px">
            <VotesTag votingPower={upVotes?.toString()} color="green" />
          </Flex>
          <Flex justifyContent="flex" mb="8px">
            <VotesTag votingPower={downVotes?.toString()} color="red" />
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
          <Button variant="secondary" onClick={presentUpdateBribe} scale="sm">
            {t('Update Bribe')}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default Details
