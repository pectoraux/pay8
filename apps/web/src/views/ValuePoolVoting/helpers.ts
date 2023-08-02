import { JsonRpcProvider } from '@ethersproject/providers'
import { bscTokens } from '@pancakeswap/tokens'
import BigNumber from 'bignumber.js'
import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import fromPairs from 'lodash/fromPairs'
import groupBy from 'lodash/groupBy'
import { Proposal, ProposalState, ProposalType, Vote } from 'state/types'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import { convertSharesToCake } from 'views/Pools/helpers'
import { ADMINS, PANCAKE_SPACE, SNAPSHOT_VERSION } from './config'
import { getScores } from './getScores'
import * as strategies from './strategies'

export const isCoreProposal = (proposal: any) => {
  return proposal?.active
}

export const filterProposalsByType = (proposals: Proposal[], proposalType: ProposalType) => {
  if (proposals) {
    switch (proposalType) {
      case ProposalType.COMMUNITY:
        return proposals.filter((proposal) => !isCoreProposal(proposal))
      case ProposalType.CORE:
        return proposals.filter((proposal) => isCoreProposal(proposal))
      case ProposalType.ALL:
      default:
        return proposals
    }
  } else {
    return []
  }
}

export const filterProposalsByState = (proposals: Proposal[], state: ProposalState) => {
  return proposals.filter((proposal) => proposal.state === state)
}

export interface Message {
  address: string
  msg: string
  sig: string
}

const STRATEGIES = [
  { name: 'cake', params: { symbol: 'CAKE', address: bscTokens.cake.address, decimals: 18, max: 300 } },
]
const NETWORK = '56'

/**
 * Generates metadata required by snapshot to validate payload
 */
export const generateMetaData = () => {
  return {
    plugins: {},
    network: 56,
    strategies: STRATEGIES,
  }
}

/**
 * Returns data that is required on all snapshot payloads
 */
export const generatePayloadData = () => {
  return {
    version: SNAPSHOT_VERSION,
    timestamp: (Date.now() / 1e3).toFixed(),
    space: PANCAKE_SPACE,
  }
}

/**
 * General function to send commands to the snapshot api
 */
export const sendSnapshotData = async (message: Message) => {
  const response = await fetch(SNAPSHOT_HUB_API, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error?.error_description)
  }

  const data = await response.json()
  return data
}

export const VOTING_POWER_BLOCK = {
  v0: 16300686,
  v1: 17137653,
}

/**
 *  Get voting power by single user for each category
 */
interface GetVotingPowerType {
  total: number
  voter: string
  poolsBalance?: number
  cakeBalance?: number
  cakePoolBalance?: number
  cakeBnbLpBalance?: number
  cakeVaultBalance?: number
  ifoPoolBalance?: number
  lockedCakeBalance?: number
  lockedEndTime?: number
}

export const calculateVoteResults = (votes: Vote[]): { [key: string]: Vote[] } => {
  if (votes) {
    const result = groupBy(votes, (vote) => vote.proposal.choices[vote.choice - 1])
    return result
  }
  return {}
}

export const getTotalFromVotes = (votes: Vote[]) => {
  if (votes) {
    return votes.reduce((accum, vote) => {
      let power = parseFloat(vote.metadata?.votingPower)

      if (!power) {
        power = 0
      }

      return accum + power
    }, 0)
  }
  return 0
}

/**
 * Get voting power by a list of voters, only total
 */
export async function getVotingPowerByCakeStrategy(voters: string[], blockNumber: number) {
  const strategyResponse = await getScores(PANCAKE_SPACE, STRATEGIES, NETWORK, voters, blockNumber)

  const result = fromPairs(
    voters.map((voter) => {
      const defaultTotal = strategyResponse.reduce(
        (total, scoreList) => total + (scoreList[voter] ? scoreList[voter] : 0),
        0,
      )

      return [voter, defaultTotal]
    }),
  )

  return result
}
