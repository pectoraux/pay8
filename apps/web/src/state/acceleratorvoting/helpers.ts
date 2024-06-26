/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { GRAPH_API_ACC_VOTER } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import _chunk from 'lodash/chunk'
import { publicClient } from 'utils/wagmi'
import { vestingABI } from 'config/abi/vesting'
import { pitchFields } from './queries'

export const getPitchSg = async (pitchId: string) => {
  try {
    const res = await request(
      GRAPH_API_ACC_VOTER,
      gql`
        query 
        getPitchData($pitchId: String!) 
        {
          pitch(id: $pitchId, where: { active: true }) {
            ${pitchFields}
          }
        }
      `,
      { pitchId },
    )
    const bscClient = publicClient({ chainId: 4002 })
    const votes = await Promise.all(
      res.pitch?.votes?.map(async (vote) => {
        const [voter] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: res?.pitch?.ve,
              abi: vestingABI,
              functionName: 'ownerOf',
              args: [BigInt(vote?.tokenId)],
            },
          ],
        })
        return {
          ...vote,
          voter: voter.result,
        }
      }),
    )
    return {
      ...res.pitch,
      votes,
    }
  } catch (error) {
    console.error('Failed ===========> to fetch pitch', error)
    return null
  }
}
