import { GRAPH_API_PAIRS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getFeeToAddress, getPoolGaugeAddress } from 'utils/addressHelpers'
import { erc20ABI } from 'wagmi'
import { poolGaugeABI } from 'config/abi/poolGauge'
import { publicClient } from 'utils/wagmi'

import { pairFields } from './queries'
import { vestingABI } from 'config/abi/vesting'

export const getPairs = async (first = 5, skip = 0, where = {}) => {
  try {
    const res = await request(
      GRAPH_API_PAIRS,
      gql`
      # query getProtocols($first: Int!, $skip: Int!, $where: NFT_filter, $orderDirection: OrderDirection) 
      {
        pairs(first: $first, skip: $skip, where: $where) {
          ${pairFields}
        }
      }
      `,
      {
        first,
        skip,
        where,
      },
    )
    return res.pairs
  } catch (error) {
    console.error('Failed to fetch pairs', error)
    return []
  }
}

export const fetchPair = async (pairAddress) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [name, symbol, decimals, periodFinish, totalLiquidity, toDistribute] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: pairAddress,
        abi: erc20ABI,
        functionName: 'name',
      },
      {
        address: pairAddress,
        abi: erc20ABI,
        functionName: 'symbol',
      },
      {
        address: pairAddress,
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: getPoolGaugeAddress(),
        abi: poolGaugeABI,
        functionName: 'periodFinish',
        args: [pairAddress],
      },
      {
        address: pairAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [getPoolGaugeAddress()],
      },
      {
        address: pairAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [getFeeToAddress()],
      },
    ],
  })

  let nextDue = parseInt(periodFinish.result.toString())
  if (nextDue === 0) {
    nextDue = Date.now() / 1000 + 86400 * 7
    nextDue = Number(nextDue)
  }
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    name: name.result,
    symbol: symbol.result,
    decimals: decimals.result,
    nextDue,
    totalLiquidity: totalLiquidity.result.toString(),
    toDistribute: toDistribute.result.toString(),
  }
}

export const fetchPairs = async () => {
  const pairsFromSg = await getPairs()
  const pairs = await Promise.all(
    pairsFromSg
      .map(async (pair, index) => {
        const data = await fetchPair(pair.id)
        return {
          sousId: index,
          ...pair,
          ...data,
        }
      })
      .flat(),
  )
  return pairs
}

export const fetchUserBalances = async (accountAddress) => {
  const bscClient = publicClient({ chainId: 4002 })
  const pairsFromSg = await getPairs()
  const pairs = await Promise.all(
    pairsFromSg
      .map(async (pair, index) => {
        const allAccounts = await Promise.all(
          pair.accounts.map(async (account) => {
            const [owner] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: account.ve,
                  abi: vestingABI,
                  functionName: 'ownerOf',
                  args: [account.tokenId],
                },
              ],
            })
            return {
              owner: owner.result,
              ...account,
            }
          }),
        )
        const _accounts = allAccounts.filter(
          (account) => account.owner?.toLowerCase() === accountAddress?.toLowerCase(),
        )
        const accounts = await Promise.all(
          _accounts.map(async (account) => {
            const [earned, balanceOf] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: getPoolGaugeAddress(),
                  abi: poolGaugeABI,
                  functionName: 'earned',
                  args: [pair.id, account.ve, account.tokenId],
                },
                {
                  address: getPoolGaugeAddress(),
                  abi: poolGaugeABI,
                  functionName: 'balanceOf',
                  args: [pair.id, `${account.ve} ${account.tokenId}`],
                },
              ],
            })
            return {
              ...account,
              earned: earned.result.toString(),
              balanceOf: balanceOf.result.toString(),
            }
          }),
        )

        return {
          sousId: index,
          accounts,
        }
      })
      .flat(),
  )
  return pairs
}
