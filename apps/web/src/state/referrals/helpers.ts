import BigNumber from 'bignumber.js'
import { getReferralVoterAddress } from 'utils/addressHelpers'
import { gql, request } from 'graphql-request'
import { GRAPH_API_REFERRAL } from 'config/constants/endpoints'
// import { getCollectionApi } from 'state/cancan/helpers'
import { collectionFields } from 'state/referralsvoting/queries'
import { publicClient } from 'utils/wagmi'
import { referralVoterABI } from 'config/abi/referralVoter'
import { vestingABI } from 'config/abi/vesting'
import { gaugeABI } from 'config/abi/gauge'
import { erc20ABI } from 'wagmi'
import { bribeABI } from 'config/abi/bribe'

export const getReferralsData = async () => {
  try {
    const res = await request(
      GRAPH_API_REFERRAL,
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

export const fetchReferrals = async () => {
  const gauges = await getReferralsData()
  console.log('gauges7===================>', gauges)
  const bscClient = publicClient({ chainId: 4002 })
  const referrals = await Promise.all(
    gauges
      .map(async (gauge) => {
        const collection = {} // await getCollectionApi(gauge.id)
        const [totalWeight, gaugeWeight, vestingTokenAddress] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getReferralVoterAddress(),
              abi: referralVoterABI,
              functionName: 'totalWeight',
              args: [gauge.ve],
            },
            {
              address: getReferralVoterAddress(),
              abi: referralVoterABI,
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
          vestingTokenName,
          vestingTokenDecimals,
          vestingTokenSymbol,
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
  return referrals
}
