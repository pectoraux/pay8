/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { firestore } from 'utils/firebase'
import { SNAPSHOT_API, GRAPH_API_TB_VOTER } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { Proposal, Vote, VoteWhere } from 'state/types'
import _chunk from 'lodash/chunk'
import { publicClient } from 'utils/wagmi'
import { getStakeMarketBribeAddress, getValuepoolVoterAddress } from 'utils/addressHelpers'
import { valuePoolVoterABI } from 'config/abi/valuePoolVoter'
import { litigationFields } from './queries'
import { stakeMarketBribeABI } from 'config/abi/stakeMarketBribe'

export const getProposals = async () => {
  return firestore.collection('proposals').get()
}

export const getProposal = async (id: string) => {
  return (await firestore.collection('proposals').doc(id).get()).data()
}

export const getVavaVotes = async (vaAddress, limit = 10) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [poolsLength] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getValuepoolVoterAddress(),
        abi: valuePoolVoterABI,
        functionName: 'length',
        args: [vaAddress],
      },
    ],
  })
  const arr = Array.from({ length: Number(poolsLength.result) }, (v, i) => i)
  const votePools = await Promise.all(
    arr
      .map(async (idx) => {
        const [votePool] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getValuepoolVoterAddress(),
              abi: valuePoolVoterABI,
              functionName: 'pools',
              args: [vaAddress, BigInt(idx)],
            },
          ],
        })
        // const [gauges] = await bscClient.multicall({
        //   allowFailure: true,
        //   contracts: [
        //     {
        //       address: getValuepoolVoterAddress(),
        //       abi: valuePoolVoterABI,
        //       functionName: 'gauges',
        //       args: [vaAddress, votePool.result],
        //     },
        //   ],
        // })
        // const amount = gauges.result[0]
        // const start = gauges.result[1]
        return {
          votePool,
          upVotes: '0',
          downVotes: '0',
          weights: '0',
          // amount: amount.toString(),
          // start: start.toString(),
        }
      })
      .flat(),
  )
  return votePools
}

export const getVotes = async (first: number, skip: number, where: VoteWhere): Promise<Vote[]> => {
  const response: { votes: Vote[] } = await request(
    SNAPSHOT_API,
    gql`
      query getVotes($first: Int, $skip: Int, $where: VoteWhere) {
        votes(first: $first, skip: $skip, where: $where) {
          id
          voter
          created
          choice
          proposal {
            choices
          }
          vp
        }
      }
    `,
    { first, skip, where },
  )
  return response.votes
}

// TODO: lazy get all votes when user click load more
export const getAllVotes = async (proposal: Proposal, votesPerChunk = 30000): Promise<Vote[]> => {
  const voters = await new Promise<Vote[]>((resolve, reject) => {
    let votes: Vote[] = []

    const fetchVoteChunk = async (newSkip: number) => {
      try {
        const voteChunk = await getVotes(votesPerChunk, newSkip, { proposal: proposal.id })

        if (voteChunk.length === 0) {
          resolve(votes)
        } else {
          votes = [...votes, ...voteChunk]
          fetchVoteChunk(newSkip + votesPerChunk)
        }
      } catch (error) {
        reject(error)
      }
    }

    fetchVoteChunk(0)
  })

  return voters.map((v) => ({
    ...v,
    metadata: {
      votingPower: String(v.vp) || '0',
    },
  }))
}

export const getLitigationsSg = async (
  where = {},
  first = 1000,
  orderBy = 'id',
  orderDirection: 'asc' | 'desc' = 'desc',
  skip = 0,
) => {
  try {
    const res = await request(
      GRAPH_API_TB_VOTER,
      gql`
        # query getLitigationsData($first: Int, $skip: Int!, $where: NFT_filter, $orderBy: NFT_orderBy, $orderDirection: OrderDirection) 
        {
          litigations(where: $where, first: $first, orderBy: $orderBy, orderDirection: $orderDirection, skip: $skip) {
            ${litigationFields}
          }
        }
      `,
      { where, first, skip, orderBy, orderDirection },
    )
    console.log('res===============>', res)
    return res.litigations
  } catch (error) {
    console.error('Failed=============> to fetch litigations', error)
    return []
  }
}

export const getLitigationSg = async (litigationId: string) => {
  try {
    const res = await request(
      GRAPH_API_TB_VOTER,
      gql`
        query 
        getCollectionData($litigationId: String!) 
        {
          litigation(id: $litigationId) {
            ${litigationFields}
          }
        }
      `,
      { litigationId },
    )
    console.log('res=============>', res)
    return res.litigation
  } catch (error) {
    console.error('Failed ===========> to fetch litigation', error)
    return null
  }
}
