import BigNumber from 'bignumber.js'
import { getAcceleratorVoterContract } from 'utils/contractHelpers'
import request, { gql } from 'graphql-request'
import { GRAPH_API_ACC_VOTER } from 'config/constants/endpoints'
import { publicClient } from 'utils/wagmi'
import { erc20ABI } from 'wagmi'
import { pitchFields } from 'state/acceleratorvoting/queries'
import { acceleratorVoterABI } from 'config/abi/acceleratorvoter'
import { vestingABI } from 'config/abi/vesting'
import { gaugeABI } from 'config/abi/gauge'
import { bribeABI } from 'config/abi/bribe'
import { getProfileAddress } from 'utils/addressHelpers'
import { profileABI } from 'config/abi/profile'
import { getCollection } from 'state/cancan/helpers'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_ACC_VOTER,
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

export const getAcceleratorData = async () => {
  try {
    const res = await request(
      GRAPH_API_ACC_VOTER,
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

export const fetchAccelerator = async ({ chainId }) => {
  const acceleratorVoterContract = getAcceleratorVoterContract()
  const gauges = await getAcceleratorData()
  const businesses = await Promise.all(
    gauges
      .map(async (gauge) => {
        const collection = await getCollection(gauge.id)
        const bscClient = publicClient({ chainId: chainId })
        const [totalWeight, gaugeWeight, claimable, vestingTokenAddress] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: acceleratorVoterContract.address,
              abi: acceleratorVoterABI,
              functionName: 'totalWeight',
              args: [gauge.ve],
            },
            {
              address: acceleratorVoterContract.address,
              abi: acceleratorVoterABI,
              functionName: 'weights',
              args: [BigInt(gauge.id), gauge.owner],
            },
            {
              address: acceleratorVoterContract.address,
              abi: acceleratorVoterABI,
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
              tokenAddress: tokenAddress.result,
              decimals: decimals.result,
              symbol: symbol.result,
              rewardRate: rewardRate.result.toString(),
              rewardAmount: new BigNumber(rewardRate.result.toString()).times(604800).toJSON(),
            }
          }),
        )
        const weightPercent = new BigNumber(gaugeWeight.result.toString())
          .times(100)
          .div(new BigNumber(totalWeight.result.toString()))
          .toFixed(2)
        // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
        return {
          sousId: gauge.id,
          bribes,
          collection,
          vestingTokenAddress: vestingTokenAddress.result,
          vestingTokenSymbol: vestingTokenSymbol.result?.toUpperCase(),
          claimable: claimable.result.toString(),
          gaugeWeight: gaugeWeight.result.toString(),
          weightPercent: weightPercent === 'NaN' ? '0' : weightPercent,
          gaugeEarned: gaugeEarned.result.toString(),
          ...gauge,
        }
      })
      .flat(),
  )
  return businesses
}

export const fetchAcceleratorUserData = async (account, pools, chainId) => {
  const bscClient = publicClient({ chainId: chainId })
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
