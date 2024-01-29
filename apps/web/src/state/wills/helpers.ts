import { Native, Token } from '@pancakeswap/sdk'
import { GRAPH_API_WILLS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getCollection } from 'state/cancan/helpers'
import { publicClient } from 'utils/wagmi'
import { erc20ABI } from 'wagmi'
import { willABI } from 'config/abi/will'
import { getWillNoteAddress } from 'utils/addressHelpers'
import { willNoteABI } from 'config/abi/willNote'
import BigNumber from 'bignumber.js'

import { willFields, protocolFields } from './queries'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_WILLS,
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

export const getProtocols = async (first = 5, skip = 0, where = {}) => {
  try {
    const res = await request(
      GRAPH_API_WILLS,
      gql`
      query getProtocols($first: Int!, $skip: Int!, $where: Protocol_filter, $orderDirection: OrderDirection) 
      {
        protocols(first: $first, skip: $skip, where: $where) {
          ${protocolFields}
        }
      }
      `,
      {
        first,
        skip,
        where,
      },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocols===========>', error)
    return []
  }
}

export const getProtocol = async (willAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_WILLS,
      gql`
        query getProtocolData($willAddress: String!) 
        {
          protocols(where: { will: $willAddress }) {
            ${protocolFields}
          }
        }
      `,
      { willAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, willAddress)
    return null
  }
}

export const getWill = async (willAddress) => {
  try {
    const res = await request(
      GRAPH_API_WILLS,
      gql`
        query getWill($willAddress: String) 
        {
          will(id: $willAddress) {
            ${willFields}
          }
        }
      `,
      { willAddress },
    )
    console.log('getWill=================>', willAddress, res)
    return res.will
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, willAddress)
    return null
  }
}

export const getWills = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_WILLS,
      gql`
        query getWills($where: WILL_filter) 
        {
          wills(first: $first, skip: $skip, where: $where) {
            ${willFields}
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getWillsFromSg33=============>', res)
    return res.wills
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchWill = async (willAddress, chainId) => {
  const will = await getWill(willAddress.toLowerCase())
  const bscClient = publicClient({ chainId })
  const tokens = await Promise.all(
    will?.tokens?.map(async (token) => {
      if (token.tokenAddress?.toLowerCase() === getWillNoteAddress()?.toLowerCase()) {
        const _token = Native.onChain(chainId)
        console.log('_token===================>', _token, _token.wrapped.address)
        // const [totalLiquidity] = await bscClient.multicall({
        //   allowFailure: true,
        //   contracts: [
        //     {
        //       address: _token.wrapped.address,
        //       abi: erc20ABI,
        //       functionName: 'balanceOf',
        //       args: [willAddress],
        //     },
        //   ],
        // })
        return {
          ...token,
          ..._token,
          tokenAddress: _token.wrapped.address,
          totalLiquidity: token?.value, // totalLiquidity.result?.toString(),
        }
      }
      const [name, symbol, decimals, totalLiquidity] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: token.tokenAddress,
            abi: erc20ABI,
            functionName: 'name',
          },
          {
            address: token.tokenAddress,
            abi: erc20ABI,
            functionName: 'symbol',
          },
          {
            address: token.tokenAddress,
            abi: erc20ABI,
            functionName: 'decimals',
          },
          {
            address: token.tokenAddress,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [willAddress],
          },
        ],
      })
      return {
        ...token,
        name: name.result,
        decimals: decimals.result,
        symbol: symbol.result?.toString()?.toUpperCase(),
        totalLiquidity: totalLiquidity.result?.toString(),
      }
    }),
  )
  const [getParams, unlocked, collectionId] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: willAddress,
        abi: willABI,
        functionName: 'getParams',
      },
      {
        address: willAddress,
        abi: willABI,
        functionName: 'unlocked',
      },
      {
        address: willAddress,
        abi: willABI,
        functionName: 'collectionId',
      },
    ],
  })
  const updatePeriod = getParams.result[0]
  const activePeriod = getParams.result[1]
  const minWithdrawableNow = getParams.result[2]
  const willWithdrawalPeriod = getParams.result[3]
  const minNFTWithdrawableNow = getParams.result[4]
  const willWithdrawalActivePeriod = getParams.result[5]

  const collection = await getCollection(collectionId.result.toString())
  const accounts = await Promise.all(
    will?.protocols
      ?.filter((protocol) => protocol.active)
      ?.map(async (protocol) => {
        const protocolId = protocol.id.split('_')[0]
        const [protocolInfo, locked] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: willAddress,
              abi: willABI,
              functionName: 'protocolInfo',
              args: [BigInt(protocolId)],
            },
            {
              address: willAddress,
              abi: willABI,
              functionName: 'locked',
              args: [BigInt(protocolId)],
            },
          ],
        })
        const createdAt = protocolInfo.result[0]
        const updatedAt = protocolInfo.result[1]
        const media = protocolInfo.result[2]
        const description = protocolInfo.result[3]

        const _tokens = await Promise.all(
          protocol?.percentages?.map(async (perct, idx) => {
            const [tk] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: willAddress,
                  abi: willABI,
                  functionName: 'tokens',
                  args: [BigInt(protocolId), idx],
                },
              ],
            })
            return tk.result
          }),
        )
        const percentages = protocol?.percentages?.map((percentage) => parseInt(percentage) / 100)
        const tokenData = await Promise.all(
          _tokens?.map(async (token) => {
            const [
              totalLiquidity,
              tokenName,
              decimals,
              symbol,
              willActivePeriod,
              balanceOf,
              totalRemoved,
              tokenType,
              totalProcessed,
            ] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: token,
                  abi: erc20ABI,
                  functionName: 'balanceOf',
                  args: [willAddress],
                },
                {
                  address: token,
                  abi: erc20ABI,
                  functionName: 'name',
                },
                {
                  address: token,
                  abi: erc20ABI,
                  functionName: 'decimals',
                },
                {
                  address: token,
                  abi: erc20ABI,
                  functionName: 'symbol',
                },
                {
                  address: willAddress,
                  abi: willABI,
                  functionName: 'willActivePeriod',
                  args: [token],
                },
                {
                  address: willAddress,
                  abi: willABI,
                  functionName: 'balanceOf',
                  args: [token],
                },
                {
                  address: willAddress,
                  abi: willABI,
                  functionName: 'totalRemoved',
                  args: [token],
                },
                {
                  address: willAddress,
                  abi: willABI,
                  functionName: 'tokenType',
                  args: [token],
                },
                {
                  address: willAddress,
                  abi: willABI,
                  functionName: 'totalProcessed',
                  args: [token],
                },
              ],
            })
            return {
              willActivePeriod: willActivePeriod.result.toString(),
              balanceOf: balanceOf.result.toString(),
              totalRemoved: totalRemoved.result.toString(),
              totalProcessed: totalProcessed.result.toString(),
              totalLiquidity: totalLiquidity.result.toString(),
              tokenType: tokenType.result,
              token: new Token(
                chainId,
                token,
                decimals.result,
                symbol.result?.toString(),
                tokenName.result?.toString(),
                `https://tokens.payswap.org/images/${token}.png`,
              ),
            }
          }),
        )

        return {
          ...protocol,
          protocolId,
          tokenData,
          percentages,
          media,
          description,
          locked: locked.result,
          collectionId: collectionId.result.toString(),
          createdAt: createdAt.toString(),
          updatedAt: updatedAt.toString(),
          // allTokens.find((tk) => tk.address === token),
        }
      }),
  )
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...will,
    tokens,
    willAddress,
    accounts,
    unlocked: unlocked.result,
    collection,
    updatePeriod: updatePeriod.toString(),
    activePeriod: activePeriod.toString(),
    minWithdrawableNow: new BigNumber(minWithdrawableNow.toString()).div(100).toJSON(),
    willWithdrawalPeriod: willWithdrawalPeriod.toString(),
    minNFTWithdrawableNow: minNFTWithdrawableNow.toString(),
    willWithdrawalActivePeriod: willWithdrawalActivePeriod.toString(),
  }
}

export const fetchWills = async ({ fromWill, chainId }) => {
  const bscClient = publicClient({ chainId })
  const [willAddresses] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getWillNoteAddress(),
        abi: willNoteABI,
        functionName: 'getAllWills',
        args: [BigInt(0)],
      },
    ],
  })
  const wills = await Promise.all(
    willAddresses.result
      .filter((willAddress) => (fromWill ? willAddress?.toLowerCase() === fromWill?.toLowerCase() : true))
      .map(async (willAddress, index) => {
        const data = await fetchWill(willAddress, chainId)
        return {
          sousId: index,
          ...data,
        }
      })
      .flat(),
  )
  return wills
}
