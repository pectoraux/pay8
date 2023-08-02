import { JsonRpcProvider } from '@ethersproject/providers'
import { bscTokens } from '@pancakeswap/tokens'
import BigNumber from 'bignumber.js'
import { SNAPSHOT_HUB_API } from 'config/constants/endpoints'
import fromPairs from 'lodash/fromPairs'
import groupBy from 'lodash/groupBy'
import { Proposal, EntryState, EntryType, Vote } from 'state/types'
import { getCakeVaultAddress } from 'utils/addressHelpers'
import { convertSharesToCake } from 'views/Pools/helpers'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { ADMINS, PANCAKE_SPACE, SNAPSHOT_VERSION } from './config'
import { getScores } from './getScores'
import * as strategies from './strategies'
import { combineDateAndTime } from './CreateProposal/helpers'

export const isCoreProposal = (proposal: Proposal) => {
  return true
}

export const filterProposalsByType = (entries: any, entryType: any) => {
  try {
    if (entries) {
      switch (entryType) {
        case EntryType.GENERAL:
          return entries.filter((entry) => entry.dataType === EntryType.GENERAL)
        case EntryType.EDUCATION:
          return entries.filter((entry) => entry.dataType === EntryType.EDUCATION)
        case EntryType.PROFESSIONAL:
          return entries.filter((entry) => entry.dataType === EntryType.PROFESSIONAL)
        case EntryType.HEALTHCARE:
          return entries.filter((entry) => entry.dataType === EntryType.HEALTHCARE)
        case EntryType.PROPERTIES:
          return entries.filter((entry) => entry.dataType === EntryType.PROPERTIES)
        case EntryType.OTHERS:
          return entries.filter((entry) => entry.dataType === EntryType.OTHERS)
        case EntryType.SHARED:
          return entries.filter((entry) => entry.dataType === EntryType.SHARED)
        case EntryType.SEARCHABLE:
          return entries.filter((entry) => entry.searchable === true)
        default:
          return entries
      }
    } else {
      return []
    }
  } catch (err) {
    return []
  }
}

// eslint-disable-next-line consistent-return
export const filterProposalsByState = (proposals: any, state: any) => {
  if (state === EntryState.ACTIVE) {
    return proposals.filter(
      (proposal) =>
        convertTimeToSeconds(proposal.startTime) <= Date.now() && Date.now() <= convertTimeToSeconds(proposal.endTime),
    )
  }
  if (state === EntryState.EXPIRED) {
    return proposals.filter((proposal) => convertTimeToSeconds(proposal.endTime) < Date.now())
  }
  if (state === EntryState.PENDING) {
    return proposals.filter((proposal) => convertTimeToSeconds(proposal.startTime) > Date.now())
  }
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

const nodeRealProvider = new JsonRpcProvider('https://bsc-mainnet.nodereal.io/v1/5a516406afa140ffa546ee10af7c9b24', 56)

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

export const getEntryState = (entry: any) => {
  if (convertTimeToSeconds(entry.endTime) < Date.now()) return EntryState.EXPIRED
  if (convertTimeToSeconds(entry.startTime) > Date.now()) return EntryState.PENDING
  return EntryState.ACTIVE
}
