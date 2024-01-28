import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_COLLATERALS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getFutureCollateralsAddress, getProfileAddress } from 'utils/addressHelpers'
import { futureCollateralsABI } from 'config/abi/futureCollaterals'
import { publicClient } from 'utils/wagmi'
import { erc20ABI, erc721ABI } from 'wagmi'
import { profileABI } from 'config/abi/profile'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
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

export const getPrice = async (ownerAddress, chainId) => {
  const bscClient = publicClient({ chainId })
  const [profileId] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getProfileAddress(),
        abi: profileABI,
        functionName: 'addressToProfileId',
        args: [ownerAddress],
      },
    ],
  })
  const [channel] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getFutureCollateralsAddress(),
        abi: futureCollateralsABI,
        functionName: 'channels',
        args: [BigInt(profileId.result)],
      },
    ],
  })
  const [price, tokenId] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getFutureCollateralsAddress(),
        abi: futureCollateralsABI,
        functionName: 'getChannelPriceAt',
        args: [channel.result, BigInt('0')],
      },
      {
        address: getFutureCollateralsAddress(),
        abi: futureCollateralsABI,
        functionName: 'profileIdToTokenId',
        args: [BigInt(profileId.result)],
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
            args: [BigInt(channel.result), BigInt(idx)],
          },
        ],
      })
      return value.result?.toString()
    }),
  )
  const [metadatUrl] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getFutureCollateralsAddress(),
        abi: erc721ABI,
        functionName: 'tokenURI',
        args: [BigInt(tokenId.result)],
      },
    ],
  })
  return {
    table,
    price: price.result?.toString(),
    tokenId: tokenId.result?.toString(),
    channel: channel.result?.toString(),
    metadataUrl: metadatUrl.result,
  }
}

export const fetchCollateral = async (ownerAddress, chainId) => {
  const collateral = await getCollateral(ownerAddress.toLowerCase())
  const bscClient = publicClient({ chainId })
  const [name, decimals, symbol] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: DEFAULT_TFIAT,
        abi: erc20ABI,
        functionName: 'name',
      },
      {
        address: DEFAULT_TFIAT,
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: DEFAULT_TFIAT,
        abi: erc20ABI,
        functionName: 'symbol',
      },
    ],
  })
  return {
    ...collateral,
    token: new Token(
      56,
      DEFAULT_TFIAT,
      decimals.result,
      symbol?.toString()?.toUpperCase() ?? 'symbol',
      name?.toString() ?? 'name',
      'https://www.payswap.org/',
    ),
  }
}

export const fetchFutureCollaterals = async ({ fromFutureCollateral, chainId }) => {
  const fromGraph = await getCollaterals(1000, 0, {})
  const bscClient = publicClient({ chainId })

  const [name, decimals, symbol] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: DEFAULT_TFIAT,
        abi: erc20ABI,
        functionName: 'name',
      },
      {
        address: DEFAULT_TFIAT,
        abi: erc20ABI,
        functionName: 'decimals',
      },
      {
        address: DEFAULT_TFIAT,
        abi: erc20ABI,
        functionName: 'symbol',
      },
    ],
  })
  try {
    const collaterals = await Promise.all(
      fromGraph
        .map(async (collateral, index) => {
          const [fund, minToBlacklist, minBountyPercent, bufferTime, treasuryFee, treasury, currentPrice, _collateral] =
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
                {
                  address: getFutureCollateralsAddress(),
                  abi: futureCollateralsABI,
                  functionName: 'collateral',
                  args: [collateral.id],
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
              return value.result?.toString()
            }),
          )
          const channel = _collateral.result[0]?.toString()
          const startTime = _collateral.result[1]?.toString()
          const toBorrow = _collateral.result[2]?.toString()
          const owner = _collateral.result[3]
          return {
            sousId: index,
            ...collateral,
            table,
            minToBlacklist: minToBlacklist.result?.toString(),
            minBountyPercent: minBountyPercent.result?.toString(),
            bufferTime: bufferTime.result?.toString(),
            treasuryFee: treasuryFee.result?.toString(),
            channel,
            startTime,
            toBorrow,
            owner,
            treasury: treasury.result?.toString(),
            fund: fund.result.toString(),
            currentPrice: currentPrice.result?.toString(),
            token: new Token(
              chainId,
              DEFAULT_TFIAT,
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
  } catch (error) {
    console.log('error=================>', error)
  }
  return []
}
