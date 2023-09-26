import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_WORLDS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getCollection } from 'state/cancan/helpers'
import { worldFields, protocolFields } from './queries'
import { getWorldHelper2Address, getWorldHelper3Address, getWorldNoteAddress } from 'utils/addressHelpers'
import { worldHelper2ABI } from 'config/abi/worldHelper2'
import { publicClient } from 'utils/wagmi'
import { worldABI } from 'config/abi/world'
import { worldNoteABI } from 'config/abi/worldNote'
import { worldHelper3ABI } from 'config/abi/worldHelper3'
import { erc20ABI } from 'wagmi'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_WORLDS,
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
      GRAPH_API_WORLDS,
      gql`
      # query getProposalss($first: Int!, $skip: Int!, $where: NFT_filter, $orderDirection: OrderDirection) 
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
    console.error('Failed to fetch protocols', error)
    return []
  }
}

export const getProtocol = async (worldAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_WORLDS,
      gql`
        query getProtocolData($worldAddress: String!) 
        {
          protocols(where: { world: $worldAddress }) {
            ${protocolFields}
          }
        }
      `,
      { worldAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, worldAddress)
    return null
  }
}

export const getWorld = async (worldAddress) => {
  try {
    const res = await request(
      GRAPH_API_WORLDS,
      gql`
        query getProtocolData2($worldAddress: String!) 
        {
          worlds(where: { id: $worldAddress }) {
            ${worldFields}
          }
        }
      `,
      { worldAddress },
    )
    return res.worlds?.length && res.worlds[0]
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, worldAddress)
    return null
  }
}

export const fetchWorld = async (worldAddress, chainId) => {
  const protocols = await getProtocol(worldAddress.toLowerCase())
  const world = (await getWorld(worldAddress.toLowerCase())) || []
  const bscClient = publicClient({ chainId: chainId })
  const worldNFTs = await Promise.all(
    world?.worldNFTs?.map(async (nft) => {
      const [owner] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: getWorldHelper2Address(),
            abi: worldHelper2ABI,
            functionName: 'ownerOf',
            args: [BigInt(nft.tokenId)],
          },
        ],
      })
      return {
        ...nft,
        owner,
      }
    }),
  )
  const [devaddr_, bountyRequired, collectionId, category, profileId, bountyId, tradingFee] = await bscClient.multicall(
    {
      allowFailure: true,
      contracts: [
        {
          address: worldAddress,
          abi: worldABI,
          functionName: 'devaddr_',
        },
        {
          address: worldAddress,
          abi: worldABI,
          functionName: 'bountyRequired',
        },
        {
          address: worldAddress,
          abi: worldABI,
          functionName: 'collectionId',
        },
        {
          address: getWorldHelper2Address(),
          abi: worldHelper2ABI,
          functionName: 'getWorldType',
          args: [worldAddress],
        },
        {
          address: getWorldNoteAddress(),
          abi: worldNoteABI,
          functionName: 'worldToProfileId',
          args: [worldAddress],
        },
        {
          address: getWorldHelper2Address(),
          abi: worldHelper2ABI,
          functionName: 'bounties',
          args: [worldAddress],
        },
        {
          address: getWorldHelper3Address(),
          abi: worldHelper3ABI,
          functionName: 'tradingFee',
        },
      ],
    },
  )
  const [gaugeNColor, pricePerAttachMinutes] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getWorldNoteAddress(),
        abi: worldNoteABI,
        functionName: 'getGaugeNColor',
        args: [BigInt(profileId.result?.toString()), Number(category.result?.toString())],
      },
      {
        address: getWorldHelper3Address(),
        abi: worldHelper3ABI,
        functionName: 'pricePerAttachMinutes',
        args: [BigInt(profileId.result?.toString())],
      },
    ],
  })
  const collection = await getCollection(collectionId.result?.toString())
  const accounts = await Promise.all(
    protocols.map(async (protocol) => {
      const protocolId = protocol.id.split('_')[0]
      const [protocolInfo, isAutoChargeable, nextDueReceivable] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: worldAddress,
            abi: worldABI,
            functionName: 'protocolInfo',
            args: [BigInt(protocolId)],
          },
          {
            address: worldAddress,
            abi: worldABI,
            functionName: 'isAutoChargeable',
            args: [BigInt(protocolId)],
          },
          {
            address: getWorldNoteAddress(),
            abi: worldNoteABI,
            functionName: 'getDueReceivable',
            args: [worldAddress, BigInt(protocolId), BigInt(0)],
          },
        ],
      })
      const owner = protocolInfo.result[0]
      const _token = protocolInfo.result[1]
      const _bountyId = protocolInfo.result[2]
      const amountReceivable = protocolInfo.result[3]
      const paidReceivable = protocolInfo.result[4]
      const periodReceivable = protocolInfo.result[5]
      const startReceivable = protocolInfo.result[6]
      const rating = protocolInfo.result[7]
      const optionId = protocolInfo.result[8]

      const fromSg = protocols.find((data) => data.owner.toLowerCase() === owner.toLowerCase())
      const [name, symbol, decimals] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
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
        ],
      })
      return {
        ...fromSg,
        owner,
        protocolId,
        isAutoChargeable: isAutoChargeable.result,
        optionId: optionId.toString(),
        bountyId: _bountyId.toString(),
        amountReceivable: amountReceivable.toString(),
        paidReceivable: paidReceivable.toString(),
        periodReceivable: periodReceivable.toString(),
        startReceivable: startReceivable.toString(),
        dueReceivable: nextDueReceivable.result[0].toString(),
        nextDueReceivable: nextDueReceivable.result[1].toString(),
        rating: rating.toString(),
        token: new Token(
          chainId,
          _token,
          decimals.result ?? 18,
          symbol.result?.toString()?.toUpperCase() ?? 'symbol',
          name.result?.toString(),
          `https://tokens.payswap.org/images${symbol.result?.toString()?.toLowerCase()}`,
        ),
        // allTokens.find((tk) => tk.address === token),
      }
    }),
  )
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    worldAddress,
    ...world,
    worldNFTs,
    accounts,
    bountyRequired: bountyRequired.result,
    devaddr_: devaddr_.result,
    collection,
    category: category.result,
    color:
      gaugeNColor.result[1] === 0
        ? 'Black'
        : gaugeNColor.result[1] === 1
        ? 'Brown'
        : gaugeNColor.result[1] === 2
        ? 'Silver'
        : 'Gold',
    bountyId: bountyId.result.toString(),
    pricePerAttachMinutes: pricePerAttachMinutes.result.toString(),
    tradingFee: tradingFee.result.toString(),
    profileId: profileId.result.toString(),
    collectionId: collectionId.result.toString(),
  }
}

export const fetchWorlds = async ({ chainId }) => {
  const bscClient = publicClient({ chainId: chainId })
  const [worldAddresses] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getWorldNoteAddress(),
        abi: worldNoteABI,
        functionName: 'getAllWorlds',
        args: [BigInt(0)],
      },
    ],
  })
  const worlds = await Promise.all(
    worldAddresses.result
      ?.map(async (worldAddress, index) => {
        const data = await fetchWorld(worldAddress, chainId)
        return {
          sousId: index,
          ...data,
        }
      })
      .flat(),
  )
  return worlds
}
