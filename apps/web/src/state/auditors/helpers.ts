import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_AUDITORS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { auditorFields, protocolFields } from './queries'
import { publicClient } from 'utils/wagmi'
import { auditorABI } from 'config/abi/auditor'
import { erc20ABI } from 'wagmi'
import { getAuditorHelper2Address, getAuditorHelperAddress, getAuditorNoteAddress } from 'utils/addressHelpers'
import { auditorHelper2ABI } from 'config/abi/auditorHelper2'
import { auditorNoteABI } from 'config/abi/auditorNote'
import { getCollection } from 'state/cancan/helpers'
import { auditorHelperABI } from 'config/abi/auditorHelper'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
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

export const getProtocolsSg = async (userAddress: string): Promise<any> => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getProtocolsData($userAddress: String!) {
          protocols(where: { owner: $userAddress }) {
            tokens {
              metadataUrl
            }
          }
        }
      `,
      { userAddress },
    )
    console.log('res.protocols=======================>', res.protocols, userAddress)
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch userAddress==========>', error, userAddress)
    return {}
  }
}

export const getProtocols = async (first = 5, skip = 0, where = {}) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
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

export const getProtocol = async (auditorAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getProtocolData($auditorAddress: String!) 
        {
          protocols(where: { auditor: $auditorAddress }) {
            ${protocolFields}
          }
        }
      `,
      { auditorAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, auditorAddress)
    return null
  }
}

export const getAuditor = async (auditorAddress) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getAuditor($auditorAddress: String) 
        {
          auditor(id: $auditorAddress) {
            ${auditorFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { auditorAddress },
    )
    console.log('getAuditor=================>', auditorAddress, res)
    return res.auditor
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, auditorAddress)
    return null
  }
}

export const getAuditors = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_AUDITORS,
      gql`
        query getAuditors($where: Auditor_filter) 
        {
          auditors(first: $first, skip: $skip, where: $where) {
            ${auditorFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getAuditorsFromSg33=============>', res)
    return res.auditors
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchAuditor = async (auditorAddress, chainId) => {
  const auditor = await getAuditor(auditorAddress.toLowerCase())

  const bscClient = publicClient({ chainId: chainId })
  const [devaddr_, bountyRequired, collectionId, category] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: auditorAddress,
        abi: auditorABI,
        functionName: 'devaddr_',
      },
      {
        address: auditorAddress,
        abi: auditorABI,
        functionName: 'bountyRequired',
      },
      {
        address: auditorAddress,
        abi: auditorABI,
        functionName: 'collectionId',
      },
      {
        address: getAuditorHelperAddress(),
        abi: auditorHelperABI,
        functionName: 'categories',
        args: [auditorAddress],
      },
    ],
  })
  const collection = await getCollection(collectionId.result.toString())
  const accounts = await Promise.all(
    auditor?.protocols?.map(async (protocol) => {
      const protocolId = protocol.id.split('_')[0]
      const [protocolInfo, isAutoChargeable] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: auditorAddress,
            abi: auditorABI,
            functionName: 'protocolInfo',
            args: [BigInt(protocolId)],
          },
          {
            address: auditorAddress,
            abi: auditorABI,
            functionName: 'isAutoChargeable',
            args: [BigInt(protocolId)],
          },
        ],
      })
      const _token = protocolInfo.result[0]
      const bountyId = protocolInfo.result[1]
      const amountReceivable = protocolInfo.result[2]
      const paidReceivable = protocolInfo.result[3]
      const periodReceivable = protocolInfo.result[4]
      const startReceivable = protocolInfo.result[5]
      const esgRating = protocolInfo.result[6]
      const optionId = protocolInfo.result[7]

      const [adminBountyId, name, symbol, decimals, totalLiquidity, nextDueReceivable] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: auditorAddress,
            abi: auditorABI,
            functionName: 'adminBountyIds',
            args: [_token],
          },
          {
            address: _token,
            abi: erc20ABI,
            functionName: 'name',
          },
          {
            address: _token,
            abi: erc20ABI,
            functionName: 'symbol',
          },
          {
            address: _token,
            abi: erc20ABI,
            functionName: 'decimals',
          },
          {
            address: _token,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [auditorAddress],
          },
          {
            address: getAuditorHelper2Address(),
            abi: auditorHelper2ABI,
            functionName: 'getDueReceivable',
            args: [auditorAddress, BigInt(protocolId), BigInt(0)],
          },
        ],
      })
      return {
        ...protocol,
        protocolId,
        isAutoChargeable: isAutoChargeable.result,
        adminBountyId: adminBountyId.result.toString(),
        esgRating: esgRating.toString(),
        bountyId: bountyId.toString(),
        optionId: optionId.toString(),
        amountReceivable: amountReceivable.toString(),
        paidReceivable: paidReceivable.toString(),
        periodReceivable: periodReceivable.toString(),
        startReceivable: startReceivable.toString(),
        totalLiquidity: totalLiquidity.result.toString(),
        nextDueReceivable: nextDueReceivable.result?.length ? nextDueReceivable.result[1].toString() : BIG_ZERO,
        token: new Token(
          56,
          _token,
          decimals.result,
          symbol.result?.toString()?.toUpperCase() ?? 'symbol',
          name.result?.toString() ?? 'name',
          `https://tokens.payswap.org/images/${_token}.png`,
        ),
        // allTokens.find((tk) => tk.address === token),
      }
    }),
  )

  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...auditor,
    collection,
    auditorAddress,
    accounts,
    category: category.result?.toString(),
    bountyRequired: bountyRequired.result,
    devaddr_: devaddr_.result,
    collectionId: collectionId.toString(),
  }
}

export const fetchAuditors = async ({ fromAuditor, chainId }) => {
  const bscClient = publicClient({ chainId: chainId })
  const [auditorAddresses] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getAuditorNoteAddress(),
        abi: auditorNoteABI,
        functionName: 'getAllAuditors',
        args: [BigInt(0)],
      },
    ],
  })
  const auditors = await Promise.all(
    auditorAddresses.result
      .filter((auditorAddress) => (fromAuditor ? auditorAddress?.toLowerCase() === fromAuditor?.toLowerCase() : true))
      .map(async (auditorAddress, index) => {
        const data = await fetchAuditor(auditorAddress, chainId)
        return {
          sousId: index,
          ...data,
        }
      })
      .flat(),
  )
  return auditors
}
