import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_COLLATERALS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { futureCollateralFields } from './queries'
import { getFutureCollateralsAddress } from 'utils/addressHelpers'
import { futureCollateralsABI } from 'config/abi/futureCollaterals'
import { publicClient } from 'utils/wagmi'
import { erc20ABI } from 'wagmi'

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
  const bscClient = publicClient({ chainId: chainId })
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
  const bscClient = publicClient({ chainId: chainId })
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
        const [fund] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getFutureCollateralsAddress(),
              abi: futureCollateralsABI,
              functionName: 'fund',
              args: [BigInt(collateral.channel)],
            },
          ],
        })
        return {
          sousId: index,
          ...collateral,
          fund: fund.result.toString(),
          token: new Token(
            56,
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
