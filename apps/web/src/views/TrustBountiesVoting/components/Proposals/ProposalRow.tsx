import {
  ArrowForwardIcon,
  Box,
  IconButton,
  Flex,
  Text,
  NextLinkFromReactRouter,
  Farm as FarmUI,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Proposal } from 'state/types'
import { isCoreProposal } from '../../helpers'
import TimeFrame from './TimeFrame'
import { ProposalStateTag, ProposalTypeTag, ColorTag } from './tags'

interface ProposalRowProps {
  proposal: Proposal
}

const StyledProposalRow = styled(NextLinkFromReactRouter)`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.cardBorder};
  display: flex;
  padding: 16px 24px;

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.dropdown};
  }
`

const ProposalRow: React.FC<any> = ({ proposal }) => {
  const votingLink = `/trustbounties/voting/${proposal.id}`
  const { VotesTag } = FarmUI.Tags
  return (
    <StyledProposalRow to={votingLink}>
      <Box as="span" style={{ flex: 1 }}>
        <Text bold mb="8px">
          {proposal.title}
        </Text>
        <Flex flexDirection="row" justifyContent="space-between">
          <ColorTag votingPower={proposal.percentile} />
          <VotesTag votingPower={parseInt(proposal?.upVotes ?? 0)?.toString()} color="green" />
          <VotesTag votingPower={parseInt(proposal?.downVotes ?? 0)?.toString()} color="red" />
        </Flex>
        <Flex alignItems="center" mb="8px">
          <TimeFrame startDate={proposal.creationTime} endDate={proposal.endTime} proposalState={proposal.active} />
        </Flex>
        <Flex alignItems="center">
          <ProposalStateTag proposalState={proposal.active} />
          <ProposalTypeTag isCoreProposal={isCoreProposal(proposal)} ml="8px" />
        </Flex>
      </Box>
      <IconButton variant="text">
        <ArrowForwardIcon width="24px" />
      </IconButton>
    </StyledProposalRow>
  )
}

export default ProposalRow
