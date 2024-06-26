import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_ARPS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { publicClient } from 'utils/wagmi'
import { arpABI } from 'config/abi/arp'
import { erc20ABI, erc721ABI } from 'wagmi'
import { getARPHelperAddress, getARPNoteAddress } from 'utils/addressHelpers'
import { arpNoteABI } from 'config/abi/arpNote'
import { arpHelperABI } from 'config/abi/arpHelper'
import { getCollection } from 'state/cancan/helpers'

import { arpFields, protocolFields } from './queries'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
      gql`
        {
          tags(id: tags) {
            id
          }
        }
      `,
      {},
    )

    const mtags = res.tags.map((tag) => tag.id)
    console.log('getTag===========>', res, mtags?.toString())
    return mtags?.toString()
  } catch (error) {
    console.error('Failed to fetch tags=============>', error)
    return null
  }
}

export const getTagFromARP = async (address) => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
      gql`
        query getTagFromARP($address: String!) {
          tags(where: { active: true, arp_: { id: $address } }) {
            id
          }
        }
      `,
      { address },
    )
    const mtags = res.tags.map((tag) => tag.id)
    console.log('getTag===========>', res, mtags?.toString(), address)
    return mtags?.toString()
  } catch (error) {
    console.error('Failed to fetch tags from=============>', error)
    return null
  }
}

export const getProtocols = async (first = 5, skip = 0, where = {}) => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
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

export const getProtocol = async (arpAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
      gql`
        query getProtocolData($arpAddress: String!) 
        {
          protocols(where: { arp: $arpAddress }) {
            ${protocolFields}
          }
        }
      `,
      { arpAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, arpAddress)
    return null
  }
}

export const getArp = async (arpAddress) => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
      gql`
        query getArp($arpAddress: String) 
        {
          arp(id: $arpAddress) {
            ${arpFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { arpAddress },
    )
    console.log('getArp=================>', arpAddress, res)
    return res.arp
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, arpAddress)
    return null
  }
}

export const getArps = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_ARPS,
      gql`
        query getArps($where: ARP_filter) 
        {
          arps(first: $first, skip: $skip, where: $where) {
            ${arpFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getArpsFromSg33=============>', res)
    return res.arps
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const getPendingRevenue = async (tokenId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [pendingRevenueFromNote, note] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getARPNoteAddress(),
        abi: arpNoteABI,
        functionName: 'pendingRevenueFromNote',
        args: [BigInt(tokenId)],
      },
      {
        address: getARPNoteAddress(),
        abi: arpNoteABI,
        functionName: 'notes',
        args: [BigInt(tokenId)],
      },
    ],
  })
  return {
    note: note.result,
    pendingRevenueFromNote: pendingRevenueFromNote.result,
  }
}

export const getTotalLiquidity = async (tokenAddress, arpAddress, chainId) => {
  const bscClient = publicClient({ chainId })
  const [totalLiquidity] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [arpAddress],
      },
    ],
  })
  return totalLiquidity.result
}

export const fetchArp = async (arpAddress, chainId) => {
  const arp = await getArp(arpAddress.toLowerCase())

  const bscClient = publicClient({ chainId })
  const [
    devaddr_,
    bountyRequired,
    profileRequired,
    collectionId,
    percentages,
    immutableContract,
    automatic,
    bufferTime,
    adminCreditShare,
    adminDebitShare,
    _ve,
    valuepool,
    adminBountyRequired,
    period,
    maxNotesPerProtocol,
  ] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'devaddr_',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'bountyRequired',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'profileRequired',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'collectionId',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'percentages',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'immutableContract',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'automatic',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'bufferTime',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'adminCreditShare',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'adminDebitShare',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: '_ve',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'valuepool',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'adminBountyRequired',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'period',
      },
      {
        address: arpAddress,
        abi: arpABI,
        functionName: 'maxNotesPerProtocol',
      },
    ],
  })
  let payableNotes
  const accounts = await Promise.all(
    arp?.protocols
      ?.filter((protocol) => protocol.active)
      ?.map(async (protocol) => {
        const protocolId = protocol.id.split('_')[0]
        const [protocolInfo, optionId, isAutoChargeable] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: arpAddress,
              abi: arpABI,
              functionName: 'protocolInfo',
              args: [BigInt(protocolId)],
            },
            {
              address: arpAddress,
              abi: arpABI,
              functionName: 'optionId',
              args: [BigInt(protocolId)],
            },
            {
              address: arpAddress,
              abi: arpABI,
              functionName: 'isAutoChargeable',
              args: [BigInt(protocolId)],
            },
          ],
        })
        const _token = protocolInfo.result[0]
        const bountyId = protocolInfo.result[1]
        const profileId = protocolInfo.result[2]
        const tokenId = protocolInfo.result[3]
        const amountPayable = protocolInfo.result[4]
        const amountReceivable = protocolInfo.result[5]
        const paidPayable = protocolInfo.result[6]
        const paidReceivable = protocolInfo.result[7]
        const periodPayable = protocolInfo.result[8]
        const periodReceivable = protocolInfo.result[9]
        const startPayable = protocolInfo.result[10]
        const startReceivable = protocolInfo.result[11]

        const [
          adminBountyId,
          name,
          symbol,
          decimals,
          totalLiquidity,
          nextDueReceivable,
          nextDuePayable,
          metadataUrl,
          userPercentile,
        ] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: arpAddress,
              abi: arpABI,
              functionName: 'adminBountyId',
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
              args: [arpAddress],
            },
            {
              address: getARPNoteAddress(),
              abi: arpNoteABI,
              functionName: 'getDueReceivable',
              args: [arpAddress, BigInt(protocolId), BigInt(0)],
            },
            {
              address: getARPNoteAddress(),
              abi: arpNoteABI,
              functionName: 'getDuePayable',
              args: [arpAddress, BigInt(protocolId), BigInt(0)],
            },
            {
              address: getARPHelperAddress(),
              abi: erc721ABI,
              functionName: 'tokenURI',
              args: [BigInt(protocolId)],
            },
            {
              address: arpAddress,
              abi: arpABI,
              functionName: 'getUserPercentile',
              args: [_token, BigInt(tokenId)],
            },
          ],
        })
        payableNotes = await Promise.all(
          protocol?.notes?.map(async (note) => {
            const [owner, metadatUrl] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: getARPNoteAddress(),
                  abi: erc721ABI,
                  functionName: 'ownerOf',
                  args: [BigInt(note?.id)],
                },
                {
                  address: getARPNoteAddress(),
                  abi: erc721ABI,
                  functionName: 'tokenURI',
                  args: [BigInt(note?.id)],
                },
              ],
            })
            return {
              ...note,
              metadataUrl: metadatUrl.result,
              owner: owner.result,
            }
          }),
        )

        return {
          ...protocol,
          notes: payableNotes,
          protocolId,
          isAutoChargeable: isAutoChargeable?.result,
          adminBountyId: adminBountyId.result?.toString(),
          bountyId: bountyId?.toString(),
          profileId: profileId?.toString(),
          tokenId: tokenId?.toString(),
          optionId: optionId.result?.toString(),
          amountReceivable: amountReceivable?.toString(),
          amountPayable: amountPayable?.toString(),
          paidReceivable: paidReceivable?.toString(),
          paidPayable: paidPayable?.toString(),
          periodReceivable: periodReceivable?.toString(),
          periodPayable: periodPayable?.toString(),
          startPayable: startPayable?.toString(),
          startReceivable: startReceivable?.toString(),
          totalLiquidity: totalLiquidity.result?.toString(),
          amountDueReceivable: automatic.result
            ? userPercentile.result
            : nextDueReceivable.result?.length
            ? nextDueReceivable.result[0].toString()
            : BIG_ZERO,
          amountDuePayable: automatic.result
            ? userPercentile.result
            : nextDuePayable.result?.length
            ? nextDuePayable.result[0].toString()
            : BIG_ZERO,
          nextDueReceivable: nextDueReceivable.result?.length ? nextDueReceivable.result[1].toString() : BIG_ZERO,
          nextDuePayable: nextDuePayable.result?.length ? nextDuePayable.result[1].toString() : BIG_ZERO,
          metadataUrl: metadataUrl.result,
          token: new Token(
            chainId,
            _token,
            decimals.result,
            symbol.result?.toString()?.toUpperCase() ?? 'symbol',
            name.result?.toString(),
            `https://tokens.payswap.org/images/${_token}.png`,
          ),
          // allTokens.find((tk) => tk.address === token),
        }
      }),
  )
  const collection = await getCollection(collectionId.result.toString())
  const receivableNotes = await Promise.all(
    arp?.notes?.map(async (note) => {
      const [owner, metadatUrl] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: getARPNoteAddress(),
            abi: erc721ABI,
            functionName: 'ownerOf',
            args: [BigInt(note?.id)],
          },
          {
            address: getARPNoteAddress(),
            abi: erc721ABI,
            functionName: 'tokenURI',
            args: [BigInt(note?.id)],
          },
        ],
      })
      return {
        ...note,
        metadataUrl: metadatUrl.result,
        owner: owner.result,
      }
    }),
  )
  const products = await getTagFromARP(arpAddress?.toLowerCase())
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...arp,
    payableNotes,
    receivableNotes,
    arpAddress,
    accounts,
    collection,
    percentages: percentages.result,
    immutableContract: immutableContract.result,
    automatic: automatic.result,
    bufferTime: bufferTime.result?.toString(),
    profileRequired: profileRequired.result,
    adminCreditShare: adminCreditShare.result?.toString(),
    adminDebitShare: adminDebitShare.result?.toString(),
    valuepool: valuepool.result,
    _ve: _ve.result,
    adminBountyRequired: adminBountyRequired.result?.toString(),
    period: period.result?.toString(),
    maxNotesPerProtocol: maxNotesPerProtocol.result?.toString(),
    devaddr_: devaddr_.result,
    collectionId: collectionId.result.toString(),
    bountyRequired: bountyRequired.result.toString(),
    products,
  }
}

export const fetchArps = async ({ fromArp, chainId }) => {
  const bscClient = publicClient({ chainId })
  const [arpAddresses] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getARPHelperAddress(),
        abi: arpHelperABI,
        functionName: 'getAllARPs',
        args: [BigInt(0)],
      },
    ],
  })
  const arps = await Promise.all(
    arpAddresses.result
      .filter((arpAddress) => (fromArp ? arpAddress?.toLowerCase() === fromArp?.toLowerCase() : true))
      .map(async (arpAddress, index) => {
        const data = await fetchArp(arpAddress, chainId)
        return {
          sousId: index,
          ...data,
        }
      })
      .flat(),
  )
  return arps
}
