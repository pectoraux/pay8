import { Token } from '@pancakeswap/sdk'
import request, { gql } from 'graphql-request'
import { GRAPH_API_TRUSTBOUNTIES } from 'config/constants/endpoints'
import { publicClient } from 'utils/wagmi'
import { bountyField, approvalField } from './queries'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { DEFAULT_INPUT_CURRENCY } from 'config/constants/exchange'
import { trustBountiesABI } from 'config/abi/trustBounties'
import { getCollection } from 'state/cancan/helpers'
import { getTrustBountiesAddress } from 'utils/addressHelpers'
import { erc20ABI } from 'wagmi'

export const getBounties = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_TRUSTBOUNTIES,
      gql`
        query getBounties($first: Int!, $skip: Int!, $where: Bounty_filter)
        {
          bounties(first: $first, skip: $skip, where: $where) {
            ${bountyField},
            sentApprovals{
              ${approvalField}
            },
            receivedApprovals{
              ${approvalField}
            },
          }
        }
      `,
      { where, first, skip },
    )
    console.log('whereClause=================>', res)
    return res.bounties
  } catch (err) {
    console.log('err sg================>', err)
  }
  return []
}

export const getTokenData = async (tokenAddress) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [name, symbol, decimals] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'name',
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'symbol',
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'decimals',
      },
    ],
  })
  console.log('tokenAddress================>', tokenAddress, name, symbol)
  return { name: name.result, symbol: symbol.result, decimals: decimals.result }
}

export const fetchBounties = async (
  collectionId = 0,
  fromAccelerator = false,
  fromContributors = false,
  fromSponsors = false,
  fromAuditors = false,
  fromBusinesses = false,
  fromRamps = false,
  fromTransfers = false,
) => {
  const whereClause = Number(collectionId)
    ? {
        collectionId,
        active: true,
      }
    : fromAccelerator
    ? {
        bountySource_contains_nocase: 'Accelerator',
        active: true,
      }
    : fromBusinesses
    ? {
        bountySource_contains_nocase: 'Businesses',
        active: true,
      }
    : fromContributors
    ? {
        bountySource_contains_nocase: 'Contributors',
        active: true,
      }
    : fromSponsors
    ? {
        bountySource_contains_nocase: 'Sponsors',
        active: true,
      }
    : fromAuditors
    ? {
        bountySource_contains_nocase: 'Auditors',
        active: true,
      }
    : fromRamps
    ? {
        bountySource_contains_nocase: 'Ramps',
        active: true,
      }
    : fromTransfers
    ? {
        bountySource_contains_nocase: 'Transfers',
        active: true,
      }
    : {
        active: true,
      }
  const bountiesFromSg = await getBounties(1000, 0, whereClause)
  console.log('bountiesFromSg==============>', bountiesFromSg)
  const bscClient = publicClient({ chainId: 4002 })
  const bounties = await Promise.all(
    bountiesFromSg
      .map(async (bounty) => {
        const { id: bountyId } = bounty
        const [bountyInfo, totalLiquidity] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getTrustBountiesAddress(),
              abi: trustBountiesABI,
              functionName: 'bountyInfo',
              args: [BigInt(bountyId)],
            },
            {
              address: getTrustBountiesAddress(),
              abi: trustBountiesABI,
              functionName: 'getBalance',
              args: [BigInt(bountyId)],
            },
          ],
        })
        const owner = bountyInfo.result[0]
        const token = bountyInfo.result[1]
        const ve = bountyInfo.result[2]
        const claimableBy = bountyInfo.result[3]
        const minToClaim = bountyInfo.result[4]
        const startTime = bountyInfo.result[5]
        const endTime = bountyInfo.result[6]
        const parentBountyId = bountyInfo.result[7]
        const isNFT = bountyInfo.result[7]

        const collection = await getCollection(bounty.collectionId)
        const claims = await Promise.all(
          bounty.claims.map(async (claim) => {
            const [fromBc] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: getTrustBountiesAddress(),
                  abi: trustBountiesABI,
                  functionName: 'claims',
                  args: [BigInt(bountyId), BigInt(parseInt(claim.id) - 1)],
                },
              ],
            })

            return {
              ...claim,
              atPeace: Number(fromBc.result[6]) === 0, // status
              endTime: fromBc.result[2]?.toString(),
            }
          }),
        )
        const friendlyClaims = claims.filter((claim) => claim.friendly && !claim.atPeace)

        return {
          ...bounty,
          collection,
          sousId: bountyId,
          ve,
          tokenAddress: token,
          isNativeCoin: token.toLowerCase() === DEFAULT_INPUT_CURRENCY,
          token: new Token(56, token, 18, 'USD', 'Binance-Peg TrueUSD Token', 'https://www.trueusd.com/'),
          owner,
          claims,
          friendlyClaims,
          claimableBy: claimableBy === ADDRESS_ZERO ? '' : claimableBy,
          parentBountyId: parentBountyId?.toString(),
          startTime: startTime?.toString(),
          endTime: endTime?.toString(),
          minToClaim: minToClaim?.toString(),
          isNFT,
          totalLiquidity: totalLiquidity.result?.toString(),
        }
      })
      .flat(),
  )
  return bounties
}
