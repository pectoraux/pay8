import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_COLLATERALS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getFutureCollateralsAddress } from 'utils/addressHelpers'
import { futureCollateralsABI } from 'config/abi/futureCollaterals'
import { publicClient } from 'utils/wagmi'
import { erc20ABI } from 'wagmi'
import { futureCollateralFields } from './queries'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_COLLATERALS,
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

export const getCollateral = async (ownerAddress) => {
  try {
    const res = await request(
      GRAPH_API_COLLATERALS,
      gql`
        query getCollateral($cardAddress: String) 
        {
          collateral(id: $cardAddress) {
            ${futureCollateralFields}
          }
        }
      `,
      { ownerAddress },
    )
    console.log('getCollateral=================>', ownerAddress, res)
    return res.collateral
  } catch (error) {
    console.error('Failed to fetch collateral=============>', error, ownerAddress)
    return null
  }
}

export const getCollaterals = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_COLLATERALS,
      gql`
        query getCollaterals($where: Collateral_filter) 
        {
          collaterals(first: $first, skip: $skip, where: $where) {
            ${futureCollateralFields}
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getCollateralsFromSg33=============>', res)
    return res.collaterals
  } catch (error) {
    console.error('Failed to fetch collaterals=============>', where, error)
    return null
  }
}

export const fetchCollateral = async (ownerAddress, chainId) => {
  const collateral = await getCollateral(ownerAddress.toLowerCase())
  const bscClient = publicClient({ chainId })
  const [tokenAddress] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getFutureCollateralsAddress(),
        abi: futureCollateralsABI,
        functionName: 'token',
      },
    ],
  })
  const [name, decimals, symbol] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: tokenAddress.result,
        abi: erc20ABI,
        functionName: 'name',
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
    ...collateral,
    token: new Token(
      56,
      tokenAddress.result,
      decimals.result,
      symbol?.toString()?.toUpperCase() ?? 'symbol',
      name?.toString() ?? 'name',
      'https://www.payswap.org/',
    ),
  }
}

export const fetchFutureCollaterals = async ({ fromFutureCollateral, chainId }) => {
  const fromGraph = await getCollaterals(0, 0, {})
  const bscClient = publicClient({ chainId })
  const [tokenAddress] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getFutureCollateralsAddress(),
        abi: futureCollateralsABI,
        functionName: 'token',
      },
    ],
  })
  const [name, decimals, symbol] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: tokenAddress.result,
        abi: erc20ABI,
        functionName: 'name',
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
  const collaterals = await Promise.all(
    fromGraph
      .map(async (collateral, index) => {
        const [fund, minToBlacklist, minBountyPercent, bufferTime, treasuryFee, treasury, currentPrice] =
          await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: getFutureCollateralsAddress(),
                abi: futureCollateralsABI,
                functionName: 'fund',
                args: [BigInt(collateral.channel)],
              },
              {
                address: getFutureCollateralsAddress(),
                abi: futureCollateralsABI,
                functionName: 'minToBlacklist',
              },
              {
                address: getFutureCollateralsAddress(),
                abi: futureCollateralsABI,
                functionName: 'minBountyPercent',
              },
              {
                address: getFutureCollateralsAddress(),
                abi: futureCollateralsABI,
                functionName: 'bufferTime',
              },
              {
                address: getFutureCollateralsAddress(),
                abi: futureCollateralsABI,
                functionName: 'treasuryFee',
              },
              {
                address: getFutureCollateralsAddress(),
                abi: futureCollateralsABI,
                functionName: 'treasury',
              },
              {
                address: getFutureCollateralsAddress(),
                abi: futureCollateralsABI,
                functionName: 'getPriceAt',
                args: [collateral.id, BigInt('0')],
              },
            ],
          })
        const arr2 = Array.from({ length: 52 }, (v, i) => i)
        const table = await Promise.all(
          arr2?.map(async (idx) => {
            const [value] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: getFutureCollateralsAddress(),
                  abi: futureCollateralsABI,
                  functionName: 'estimationTable',
                  args: [BigInt(collateral.channel), BigInt(idx)],
                },
              ],
            })
            return value.result
          }),
        )
        return {
          sousId: index,
          ...collateral,
          table,
          minToBlacklist: minToBlacklist.result,
          minBountyPercent: minBountyPercent.result,
          bufferTime: bufferTime.result,
          treasuryFee: treasuryFee.result,
          treasury: treasury.result,
          fund: fund.result.toString(),
          currentPrice: currentPrice.result?.toString(),
          token: new Token(
            chainId,
            tokenAddress.result,
            decimals.result,
            symbol.result?.toString()?.toUpperCase() ?? 'symbol',
            name.result?.toString() ?? 'name',
            'https://www.payswap.org/',
          ),
        }
      })
      .flat(),
  )
  return collaterals
}
