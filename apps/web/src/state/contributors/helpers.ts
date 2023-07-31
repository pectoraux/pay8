import BigNumber from 'bignumber.js'
import { getContributorsVoterContract } from 'utils/contractHelpers'
import request, { gql } from 'graphql-request'
import { GRAPH_API_CONTRIBUTORS_VOTER } from 'config/constants/endpoints'
import { publicClient } from 'utils/wagmi'
import { erc20ABI } from 'wagmi'
import { pitchFields } from 'state/contributorsvoting/queries'
import { vestingABI } from 'config/abi/vesting'
import { gaugeABI } from 'config/abi/gauge'
import { bribeABI } from 'config/abi/bribe'
import { contributorsVoterABI } from 'config/abi/contributorsVoter'
import { getProfileAddress } from 'utils/addressHelpers'
import { profileABI } from 'config/abi/profile'

export const getContributorsData = async () => {
  try {
    const res = await request(
      GRAPH_API_CONTRIBUTORS_VOTER,
      gql`
        {
          pitches {
            ${pitchFields}
          }
        }
      `,
    )
    return res.pitches
  } catch (error) {
    console.error('Failed to fetch pitches========>', error)
    return []
  }
}

export const fetchContributors = async () => {
  const contributorsVoterContract = getContributorsVoterContract()
  const gauges = await getContributorsData()
  const businesses = await Promise.all(
    gauges
      .map(async (gauge) => {
        const collection = {} // await getCollectionApi(gauge.id)
        const bscClient = publicClient({ chainId: 4002 })
        const [totalWeight, gaugeWeight, claimable, vestingTokenAddress] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: contributorsVoterContract.address,
              abi: contributorsVoterABI,
              functionName: 'totalWeight',
              args: [gauge.ve],
            },
            {
              address: contributorsVoterContract.address,
              abi: contributorsVoterABI,
              functionName: 'weights',
              args: [BigInt(gauge.id), gauge.owner],
            },
            {
              address: contributorsVoterContract.address,
              abi: contributorsVoterABI,
              functionName: 'claimable',
              args: [gauge.gauge],
            },
            {
              address: gauge.ve,
              abi: vestingABI,
              functionName: 'token',
            },
          ],
        })
        const [gaugeEarned, vestingTokenSymbol, tokensLength] = await bscClient.multicall({
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
          claimable: claimable.toString(),
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

export const fetchContributorsUserData = async (account, pools) => {
  const bscClient = publicClient({ chainId: 4002 })
  const augmentedPools = await Promise.all(
    pools
      ?.map(async (pool) => {
        const [balanceOf] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: pool.ve,
              abi: vestingABI,
              functionName: 'balanceOf',
              args: [account],
            },
          ],
        })
        const arr = Array.from({ length: Number(balanceOf.result) }, (v, i) => i)
        const tokenIds = await Promise.all(
          arr.map(async (idx) => {
            const [tokenId] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: pool.ve,
                  abi: vestingABI,
                  functionName: 'tokenOfOwnerByIndex',
                  args: [account, BigInt(idx)],
                },
              ],
            })
            return tokenId.toString()
          }),
        )
        const [profileId] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getProfileAddress(),
              abi: profileABI,
              functionName: 'addressToProfileId',
              args: [account],
            },
          ],
        })
        const augmentedBribes = await Promise.all(
          pool.bribes.map(async (bribe) => {
            const [earned, allowance] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: bribe.businessBribe,
                  abi: bribeABI,
                  functionName: 'earned',
                  args: [bribe.tokenAddress, BigInt(profileId.result)],
                },
                {
                  address: bribe.tokenAddress,
                  abi: erc20ABI,
                  functionName: 'allowance',
                  args: [account, bribe.businessBribe],
                },
              ],
            })
            return {
              ...bribe,
              earned: earned.toString(),
              allowance: allowance.toString(),
            }
          }),
        )
        return {
          ...pool,
          tokenIds,
          profileId,
          augmentedBribes,
        }
      })
      .flat(),
  )
  return augmentedPools
}