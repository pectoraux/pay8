import { Native, Token } from '@pancakeswap/sdk'
import request, { gql } from 'graphql-request'
import { GRAPH_API_TRUSTBOUNTIES } from 'config/constants/endpoints'
import { publicClient } from 'utils/wagmi'
import { bountyField, approvalField } from './queries'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { DEFAULT_INPUT_CURRENCY, DEFAULT_NATIVE_CURRENCY } from 'config/constants/exchange'
import { trustBountiesABI } from 'config/abi/trustBounties'
import { getCollection } from 'state/cancan/helpers'
import {
  getStakeMarketBribeAddress,
  getTrustBountiesAddress,
  getTrustBountiesHelperAddress,
  getTrustBountiesVoterAddress,
} from 'utils/addressHelpers'
import { Address, erc20ABI } from 'wagmi'
import { trustBountiesHelperABI } from 'config/abi/trustBountiesHelper'
import { stakeMarketBribeABI } from 'config/abi/stakeMarketBribe'
import { trustBountiesVoterABI } from 'config/abi/trustBountiesVoter'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_TRUSTBOUNTIES,
      gql`
        {
          tags(id: tags) {
            id
            name
          }
        }
      `,
      {},
    )
    console.log('getTag===========>', res)

    return res.tags?.length && res.tags[0]
  } catch (error) {
    console.error('Failed to fetch tags=============>', error)
    return null
  }
}

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

export const getIsLocked = async (bountyId, chainId) => {
  const bscClient = publicClient({ chainId: chainId })
  const [isLocked] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getTrustBountiesAddress(),
        abi: trustBountiesABI,
        functionName: 'lockedBounties',
        args: [BigInt(bountyId)],
      },
    ],
  })
  return isLocked.result
}

export const getBounty = async (bountyId, chainId) => {
  const bscClient = publicClient({ chainId: chainId })
  const [bounty] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getTrustBountiesAddress(),
        abi: trustBountiesABI,
        functionName: 'bountyInfo',
        args: [BigInt(bountyId)],
      },
    ],
  })
  return bounty.result
}

export const getLatestClaim = async (bountyId, attackerId, chainId) => {
  const bscClient = publicClient({ chainId: chainId })

  if (parseInt(attackerId ?? 0) > 0) {
    const [latestClaim] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getTrustBountiesAddress(),
          abi: trustBountiesABI,
          functionName: 'claims',
          args: [BigInt(bountyId), BigInt(parseInt(attackerId) - 1)],
        },
      ],
    })
    return latestClaim.result
  }
  return null
}

export const getLatestClaim2 = async (bountyId, chainId) => {
  const bscClient = publicClient({ chainId: chainId })
  const [latestClaimId] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getTrustBountiesAddress(),
        abi: trustBountiesABI,
        functionName: 'getLatestClaimId',
        args: [BigInt(bountyId)],
      },
    ],
  })
  let latestClaim
  if (parseInt(latestClaimId.result?.toString()) > 0) {
    const [_latestClaim] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getTrustBountiesAddress(),
          abi: trustBountiesABI,
          functionName: 'claims',
          args: [BigInt(bountyId), BigInt(parseInt(latestClaimId.result?.toString()) - 1)],
        },
      ],
    })
    latestClaim = _latestClaim.result
    console.log('1useGetLatestClaim2===============>', latestClaimId, _latestClaim)
  }
  console.log('2useGetLatestClaim2===============>', latestClaimId, bountyId)
  return latestClaim
}

export const getEarned = async (veAddress, tokenId, chainId) => {
  const bscClient = publicClient({ chainId: chainId })
  const [_tokenAddress] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getTrustBountiesVoterAddress(),
        abi: trustBountiesVoterABI,
        functionName: 'veToken',
        args: [veAddress],
      },
    ],
  })
  const tokenAddress = _tokenAddress.result
  const [earned] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getStakeMarketBribeAddress(),
        abi: stakeMarketBribeABI,
        functionName: 'earned',
        args: [tokenAddress as Address, BigInt(tokenId)],
      },
    ],
  })
  console.log('getEarned===================>', earned, tokenAddress, tokenId)
  return {
    tokenAddress,
    earned: earned.result,
  }
}

export const getTokenData = async (tokenAddress, chainId) => {
  const bscClient = publicClient({ chainId: chainId })
  if (tokenAddress?.isNative) {
    return {
      name: tokenAddress.name,
      symbol: tokenAddress.symbol,
      decimals: tokenAddress.decimals,
    }
  }
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
  return { name: name.result, symbol: symbol.result, decimals: decimals.result }
}

export const getBalanceSource = async (bountyId, chainId) => {
  const bscClient = publicClient({ chainId: chainId })
  const trustBountyAddress = getTrustBountiesAddress()
  const [balance] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: trustBountyAddress,
        abi: trustBountiesABI,
        functionName: 'balances',
        args: [BigInt(bountyId), trustBountyAddress],
      },
    ],
  })
  return balance.result
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
  chainId,
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
  const bscClient = publicClient({ chainId: chainId })
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
        const token =
          bountyInfo.result[1]?.toLowerCase() === getTrustBountiesHelperAddress()?.toLowerCase()
            ? Native.onChain(chainId)
            : bountyInfo.result[1]
        const ve = bountyInfo.result[2]
        const claimableBy = bountyInfo.result[3]
        const minToClaim = bountyInfo.result[4]
        const startTime = bountyInfo.result[5]
        const endTime = bountyInfo.result[6]
        const parentBountyId = bountyInfo.result[7]
        const isNFT = bountyInfo.result[8]
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
              winner: fromBc.result[5],
              atPeace: Number(fromBc.result[6]) === 0, // status
              endTime: fromBc.result[2]?.toString(),
            }
          }),
        )
        const friendlyClaims = claims.filter((claim) => claim.friendly && !claim.atPeace)
        const { name, symbol, decimals } = await getTokenData(token, chainId)
        return {
          ...bounty,
          collection,
          sousId: bountyId,
          ve,
          tokenAddress: token,
          isNativeCoin: !!(token as any)?.isNative,
          token: (token as any)?.isNative
            ? token
            : new Token(
                chainId,
                token as any,
                decimals ?? 18,
                symbol,
                name,
                `https://tokens.payswap.org/images/${token}.png`,
              ),
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
