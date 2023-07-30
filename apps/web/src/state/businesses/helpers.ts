import BigNumber from 'bignumber.js'
import request, { gql } from 'graphql-request'
import { GRAPH_API_BUSINESS } from 'config/constants/endpoints'
import { publicClient } from 'utils/wagmi'
import { erc20ABI } from 'wagmi'
import { vestingABI } from 'config/abi/vesting'
import { gaugeABI } from 'config/abi/gauge'
import { bribeABI } from 'config/abi/bribe'
import { collectionFields } from 'state/businessvoting/queries'
import { getBusinessVoterAddress } from 'utils/addressHelpers'
import { businessVoterABI } from 'config/abi/businessVoter'

export const getBusinessesData = async () => {
  try {
    const res = await request(
      GRAPH_API_BUSINESS,
      gql`
        {
          collections {
            ${collectionFields}
          }
        }
      `,
    )
    return res.collections
  } catch (error) {
    console.error('Failed sg=======>', error)
    return []
  }
}

export const fetchBusinesses = async () => {
  const gauges = await getBusinessesData()
  const businesses = await Promise.all(
    gauges
      .map(async (gauge) => {
        const collection = {} // await getCollectionApi(gauge.id)
        const bscClient = publicClient({ chainId: 4002 })
        const [totalWeight, gaugeWeight, vestingTokenAddress] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getBusinessVoterAddress(),
              abi: businessVoterABI,
              functionName: 'totalWeight',
              args: [gauge.ve],
            },
            {
              address: getBusinessVoterAddress(),
              abi: businessVoterABI,
              functionName: 'weights',
              args: [BigInt(gauge.id), gauge.ve],
            },
            {
              address: gauge.ve,
              abi: vestingABI,
              functionName: 'token',
            },
          ],
        })
        const [gaugeEarned, vestingTokenName, vestingTokenDecimals, vestingTokenSymbol, tokensLength] =
          await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: gauge.gauge,
                abi: gaugeABI,
                functionName: 'totalSupply',
                args: [vestingTokenAddress.result],
              },
              {
                address: vestingTokenAddress.result,
                abi: erc20ABI,
                functionName: 'name',
              },
              {
                address: vestingTokenAddress.result,
                abi: erc20ABI,
                functionName: 'decimals',
              },
              {
                address: vestingTokenAddress.result,
                abi: erc20ABI,
                functionName: 'symbol',
              },
              {
                address: gauge.bribe,
                abi: bribeABI,
                functionName: 'rewardsListLength',
              },
            ],
          })
        const arry = Array.from({ length: Number(tokensLength.result) }, (v, i) => i)
        const bribes = await Promise.all(
          arry.map(async (bIdx) => {
            const [tokenAddress] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: gauge.bribe,
                  abi: bribeABI,
                  functionName: 'rewards',
                  args: [BigInt(bIdx)],
                },
              ],
            })
            const [rewardRate, decimals, symbol] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: gauge.bribe,
                  abi: bribeABI,
                  functionName: 'rewardRate',
                  args: [tokenAddress.result],
                },
                {
                  address: tokenAddress.result,
                  abi: erc20ABI,
                  functionName: 'decimals',
                },
                {
                  address: tokenAddress.result,
                  abi: erc20ABI,
                  functionName: 'symbol',
                },
              ],
            })

            return {
              businessBribe: gauge.bribe,
              tokenAddress,
              decimals,
              symbol,
              rewardRate: rewardRate.toString(),
              rewardAmount: new BigNumber(rewardRate.toString()).times(604800).toJSON(),
            }
          }),
        )

        // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
        return {
          sousId: gauge.id,
          bribes,
          collection,
          vestingTokenAddress,
          vestingTokenSymbol,
          vestingTokenName,
          vestingTokenDecimals,
          gaugeWeight: gaugeWeight.toString(),
          weightPercent: new BigNumber(gaugeWeight.toString())
            .times(100)
            .div(new BigNumber(totalWeight.toString()))
            .toFixed(2),
          gaugeEarned: gaugeEarned.toString(),
          ...gauge,
        }
      })
      .flat(),
  )
  return businesses
}
