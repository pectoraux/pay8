import BigNumber from 'bignumber.js'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_WILLS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
// import { getCollection } from 'state/cancan/helpers'
import { getWillContract, getWillNoteContract, getBep20Contract } from '../../utils/contractHelpers'
import { willFields, protocolFields } from './queries'
import { publicClient } from 'utils/wagmi'
import { erc20ABI } from 'wagmi'
import { willABI } from 'config/abi/will'
import { getWillNoteAddress } from 'utils/addressHelpers'
import { willNoteABI } from 'config/abi/willNote'

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

export const fetchWill = async (willAddress) => {
  const will = await getWill(willAddress.toLowerCase())
  const bscClient = publicClient({ chainId: 4002 })
  const tokens = await Promise.all(
    will?.tokens?.map(async (token) => {
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
        name,
        decimals,
        symbol: symbol?.toString()?.toUpperCase(),
        totalLiquidity: totalLiquidity.toString(),
      }
    }),
  )
  const [
    devaddr_,
    bountyRequired,
    _profileId,
    contractMedia,
    willWithdrawalPeriod,
    minWithdrawableNow,
    minNFTWithdrawableNow,
    updatePeriod,
    unlocked,
    collectionId,
  ] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: willAddress,
        abi: willABI,
        functionName: 'devaddr_',
      },
      {
        address: willAddress,
        abi: willABI,
        functionName: 'adminBountyRequired',
      },
      {
        address: willAddress,
        abi: willABI,
        functionName: 'profileId',
      },
      {
        address: willAddress,
        abi: willABI,
        functionName: 'media',
      },
      {
        address: willAddress,
        abi: willABI,
        functionName: 'willWithdrawalPeriod',
      },
      {
        address: willAddress,
        abi: willABI,
        functionName: 'minWithdrawableNow',
      },
      {
        address: willAddress,
        abi: willABI,
        functionName: 'minNFTWithdrawableNow',
      },
      {
        address: willAddress,
        abi: willABI,
        functionName: 'updatePeriod',
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
  const collection = {} // await getCollection(new BigNumber(collectionId._hex).toJSON())
  const accounts = await Promise.all(
    will?.protocols?.map(async (protocol) => {
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

      console.log('tokens===============>', 1)
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
      console.log('tokens===============>', _tokens)
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
            _adminBountyId,
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
                functionName: 'adminBountyId',
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
            willActivePeriod: willActivePeriod.toString(),
            balanceOf: balanceOf.toString(),
            totalRemoved: totalRemoved.toString(),
            adminBountyId: _adminBountyId.toString(),
            totalProcessed: totalProcessed.toString(),
            totalLiquidity: totalLiquidity.toString(),
            tokenType,
            token: new Token(
              56,
              token,
              decimals.result,
              symbol?.toString(),
              tokenName?.toString(),
              'https://www.trueusd.com/',
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
        locked,
        collectionId: collectionId.toString(),
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
    unlocked,
    collection,
    contractMedia,
    willWithdrawalPeriod: willWithdrawalPeriod.toString(),
    minWithdrawableNow: minWithdrawableNow.toString(),
    minNFTWithdrawableNow: minNFTWithdrawableNow.toString(),
    updatePeriod: updatePeriod.toString(),
    devaddr_,
    profileId: _profileId.toString(),
    bountyRequired: bountyRequired.toString(),
  }
}

export const fetchWills = async ({ fromWill }) => {
  const bscClient = publicClient({ chainId: 4002 })
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
  console.log('1fetchWills==================>', willAddresses.result)
  const wills = await Promise.all(
    willAddresses.result
      .filter((willAddress) => (fromWill ? willAddress?.toLowerCase() === fromWill?.toLowerCase() : true))
      .map(async (willAddress, index) => {
        console.log('2fetchWills==================>2')
        const data = await fetchWill(willAddress)
        console.log('3fetchWills==================>', data)
        return {
          sousId: index,
          ...data,
        }
      })
      .flat(),
  )
  return wills
}
