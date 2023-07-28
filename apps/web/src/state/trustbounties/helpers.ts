import axios from 'axios'
import NodeRSA from 'encrypt-rsa'
import BigNumber from 'bignumber.js'
import { Token } from '@pancakeswap/sdk'
import { getBep20Contract, getRampAdsContract, getRampContract, getTrustBountiesContract } from 'utils/contractHelpers'
import { firestore } from 'utils/firebase'
import request, { gql } from 'graphql-request'
import { GRAPH_API_TRUSTBOUNTIES } from 'config/constants/endpoints'
import { publicClient } from 'utils/wagmi'
import { bountyField, approvalField } from './queries'
import { rampABI } from 'config/abi/ramp'
import { erc20ABI } from 'wagmi'
import { rampAdsABI } from 'config/abi/rampAds'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { DEFAULT_INPUT_CURRENCY } from 'config/constants/exchange'
import { trustbountiesABI } from 'config/abi/trustbounties'

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
  const tokenContract = getBep20Contract(tokenAddress)
  const [name, symbol, decimals] = await Promise.all([
    tokenContract.read.name(),
    tokenContract.read.symbol(),
    tokenContract.read.decimals(),
  ])
  console.log('tokenAddress================>', tokenAddress, name, symbol)
  return { name, symbol, decimals }
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
  const trustbountiesContract = getTrustBountiesContract()
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
              address: trustbountiesContract.address,
              abi: trustbountiesABI,
              functionName: 'bountyInfo',
              args: [BigInt(bountyId)],
            },
            {
              address: trustbountiesContract.address,
              abi: trustbountiesABI,
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

        const collection = {} // await getCollection(bounty.collectionId)
        const claims = await Promise.all(
          bounty.claims.map(async (claim) => {
            const [fromBc] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: trustbountiesContract.address,
                  abi: trustbountiesABI,
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
          token: new Token(56, token, 18, 'TUSD', 'Binance-Peg TrueUSD Token', 'https://www.trueusd.com/'),
          owner,
          claims,
          friendlyClaims,
          claimableBy: claimableBy === ADDRESS_ZERO ? '' : claimableBy,
          parentBountyId: parentBountyId?.toString(),
          startTime: startTime?.toString(),
          endTime: endTime?.toString(),
          minToClaim: minToClaim?.toString(),
          isNFT,
          totalLiquidity: totalLiquidity?.toString(),
        }
      })
      .flat(),
  )
  return bounties
}
