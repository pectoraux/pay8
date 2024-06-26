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
  Balance,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { format } from 'date-fns'
import { Proposal } from 'state/types'
import { getBlockExploreLink } from 'utils'
import { useTranslation } from '@pancakeswap/localization'
import { useGetStake } from 'state/stakemarket/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import Divider from 'components/Divider'
import { useCurrency } from 'hooks/Tokens'
import BigNumber from 'bignumber.js'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { IPFS_GATEWAY } from '../config'
import CreateContentModal from './CreateContentModal'
import { ColorTag, ProposalStateTag } from '../components/Proposals/tags'

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
  const { chainId } = useActiveChainId()
  const { VotesTag } = FarmUI.Tags
  const startDate = new Date(proposal.creationTime * 1000)
  const endDate = new Date(proposal.endTime * 1000)
  const attackerStake = useGetStake(proposal.attackerId)
  const defenderStake = useGetStake(proposal.defenderId)
  const token = useCurrency(attackerStake?.token ?? '')

  const [presentUpdateTerms] = useModal(<CreateContentModal onSuccess={onSuccess} litigation={proposal} />)
  console.log('attackerStake================>', attackerStake)
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
        <Divider />
        <Flex alignItems="center" mb="8px">
          <Text color="textSubtle">{t('Attacker ID')}</Text>
          <LinkExternal href={getBlockExploreLink(proposal.attackerId, 'address', chainId)} ml="8px">
            {proposal.attackerId}
          </LinkExternal>
        </Flex>
        <Flex justifyContent="column">
          <Box height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={17}
              value={getBalanceNumber(new BigNumber(attackerStake?.bank?.amountPayable?.toString()), token?.decimals)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Payable')}
            </Text>
          </Box>
          <Box ml="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={token?.decimals ?? 18}
              value={getBalanceNumber(
                new BigNumber(attackerStake?.bank?.amountReceivable?.toString()),
                token?.decimals,
              )}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Receivable')}
            </Text>
          </Box>
        </Flex>
        <Divider />
        <Flex alignItems="center" mb="16px">
          <Text color="textSubtle">{t('Defender ID')}</Text>
          <LinkExternal href={getBlockExploreLink(proposal.defenderId, 'block', chainId)} ml="8px">
            {proposal.defenderId}
          </LinkExternal>
        </Flex>
        <Flex justifyContent="column">
          <Box height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={token?.decimals ?? 18}
              value={getBalanceNumber(new BigNumber(defenderStake?.bank?.amountPayable?.toString()), token?.decimals)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Payable')}
            </Text>
          </Box>
          <Box ml="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={token?.decimals ?? 18}
              value={getBalanceNumber(
                new BigNumber(defenderStake?.bank?.amountReceivable?.toString()),
                token?.decimals,
              )}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Receivable')}
            </Text>
          </Box>
        </Flex>
        <Divider />
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
          <Button variant="secondary" onClick={presentUpdateTerms} scale="sm">
            {t('Update Statement')}
          </Button>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default Details
