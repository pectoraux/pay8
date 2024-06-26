import { useState } from 'react'
import { Card, CardHeader, ChevronDownIcon, Flex, Heading, Button, ChevronUpIcon } from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import orderBy from 'lodash/orderBy'
import { useTranslation } from '@pancakeswap/localization'
import VoteRow from '../components/Proposal/VoteRow'

const VOTES_PER_VIEW = 20

// interface VotesProps {
//   votes: Vote[]
//   totalVotes?: number
//   votesLoadingStatus: FetchStatus
// }

const parseVotePower = (incomingVote: any) => {
  let votingPower = parseFloat(incomingVote?.votingPower)
  if (!votingPower) votingPower = 0
  return votingPower
}

const Votes: React.FC<any> = ({ votes, totalVotes }) => {
  const [showAll, setShowAll] = useState(false)
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const orderedVotes = orderBy(votes, [parseVotePower, 'created'], ['desc', 'desc'])
  const displayVotes = showAll ? orderedVotes : orderedVotes.slice(0, VOTES_PER_VIEW)

  const handleClick = () => {
    setShowAll(!showAll)
  }

  return (
    <Card>
      <CardHeader>
        <Flex alignItems="center" justifyContent="space-between">
          <Heading as="h3" scale="md">
            {t('Votes (%count%)', { count: totalVotes ? totalVotes.toLocaleString() : '-' })}
          </Heading>
        </Flex>
      </CardHeader>
      {displayVotes.length > 0 && (
        <>
          {displayVotes.map((vote) => {
            const isVoter = account && vote.voter.toLowerCase() === account.toLowerCase()
            return <VoteRow key={vote.id} vote={vote} isVoter={isVoter} />
          })}
          <Flex alignItems="center" justifyContent="center" py="8px" px="24px">
            <Button
              width="100%"
              onClick={handleClick}
              variant="text"
              endIcon={
                showAll ? (
                  <ChevronUpIcon color="primary" width="21px" />
                ) : (
                  <ChevronDownIcon color="primary" width="21px" />
                )
              }
            >
              {showAll ? t('Hide') : t('See All')}
            </Button>
          </Flex>
        </>
      )}

      {displayVotes.length === 0 && (
        <Flex alignItems="center" justifyContent="center" py="32px">
          <Heading as="h5">{t('No votes found')}</Heading>
        </Flex>
      )}
    </Card>
  )
}

export default Votes
