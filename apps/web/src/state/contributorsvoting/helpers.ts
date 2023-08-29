/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import { GRAPH_API_CONTRIBUTORS_VOTER } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import _chunk from 'lodash/chunk'
import { pitchFields } from './queries'
import { publicClient } from 'utils/wagmi'
import { vestingABI } from 'config/abi/vesting'

export const getPitchSg = async (pitchId: string) => {
  try {
    const res = await request(
      GRAPH_API_CONTRIBUTORS_VOTER,
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
        return { ...vote, voter }
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
