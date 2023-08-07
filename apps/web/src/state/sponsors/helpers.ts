import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_SPONSORS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { sponsorFields, protocolFields } from './queries'
import { publicClient } from 'utils/wagmi'
import { sponsorABI } from 'config/abi/sponsor'
import { erc20ABI } from 'wagmi'
import { sponsorNoteABI } from 'config/abi/sponsorNote'
import { getSponsorHelperAddress } from 'utils/addressHelpers'
import { getCollection } from 'state/cancan/helpers'

export const getProtocols = async (first = 5, skip = 0, where = {}) => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
      gql`
      query getProposals($first: Int!, $skip: Int!, $where: Protocol_filter) 
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

export const getProtocol = async (sponsorAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
      gql`
        query getProtocolData($sponsorAddress: String!) 
        {
          protocols(where: { sponsor: $sponsorAddress }) {
            ${protocolFields}
          }
        }
      `,
      { sponsorAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, sponsorAddress)
    return null
  }
}

export const getSponsor = async (sponsorAddress) => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
      gql`
        query getSponsor($sponsorAddress: String) 
        {
          sponsor(id: $sponsorAddress) {
            ${sponsorFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { sponsorAddress },
    )
    console.log('getSponsor=================>', sponsorAddress, res)
    return res.sponsor
  } catch (error) {
    console.error('Failed to fetch sponsor=============>', error, sponsorAddress)
    return null
  }
}

export const getSponsors = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
      gql`
        query getSponsors($where: Sponsor_filter) 
        {
          sponsors(first: $first, skip: $skip, where: $where) {
            ${sponsorFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getSponsorsFromSg33=============>', res)
    return res.sponsors
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchSponsor = async (sponsorAddress) => {
  const sponsor = await getSponsor(sponsorAddress.toLowerCase())
  const bscClient = publicClient({ chainId: 4002 })
  const [cosignEnabled, devaddr_, minCosigners, requiredIndentity, valueName, _ve, bountyRequired, collectionId] =
    await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: sponsorAddress,
          abi: sponsorABI,
          functionName: 'cosignEnabled',
        },
        {
          address: sponsorAddress,
          abi: sponsorABI,
          functionName: 'devaddr_',
        },
        {
          address: sponsorAddress,
          abi: sponsorABI,
          functionName: 'minCosigners',
        },
        {
          address: sponsorAddress,
          abi: sponsorABI,
          functionName: 'requiredIndentity',
        },
        {
          address: sponsorAddress,
          abi: sponsorABI,
          functionName: 'valueName',
        },
        {
          address: sponsorAddress,
          abi: sponsorABI,
          functionName: '_ve',
        },
        {
          address: sponsorAddress,
          abi: sponsorABI,
          functionName: 'bountyRequired',
        },
        {
          address: sponsorAddress,
          abi: sponsorABI,
          functionName: 'collectionId',
        },
      ],
    })
  const collection = await getCollection(collectionId.result.toString())
  console.log('nextDuePayable0=================>', sponsor, sponsor.protocols)
  const accounts = await Promise.all(
    sponsor?.protocols?.map(async (protocol) => {
      const protocolId = protocol.id.split('_')[0]
      const [protocolInfo] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: sponsorAddress,
            abi: sponsorABI,
            functionName: 'protocolInfo',
            args: [BigInt(protocolId)],
          },
        ],
      })
      const owner = protocolInfo.result[0]
      const _token = protocolInfo.result[1]
      const bountyId = protocolInfo.result[2]
      const tokenId = protocolInfo.result[3]
      const amountPayable = protocolInfo.result[4]
      const paidPayable = protocolInfo.result[5]
      const periodPayable = protocolInfo.result[6]
      const startPayable = protocolInfo.result[7]

      if (_token === ADDRESS_ZERO) return null
      const [adminBountyId, name, symbol, decimals, totalLiquidity, nextDuePayable] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: sponsorAddress,
            abi: sponsorABI,
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
            args: [sponsorAddress],
          },
          {
            address: getSponsorHelperAddress(),
            abi: sponsorNoteABI,
            functionName: 'getDuePayable',
            args: [sponsorAddress, owner, BigInt(0)],
          },
        ],
      })
      console.log('nextDuePayable=================>', amountPayable, nextDuePayable.result)
      return {
        ...protocol,
        owner,
        protocolId,
        adminBountyId: adminBountyId.result.toString(),
        tokenId: tokenId.toString(),
        bountyId: bountyId.toString(),
        amountPayable: amountPayable.toString(),
        totalLiquidity: totalLiquidity.result.toString(),
        paidPayable: paidPayable.toString(),
        periodPayable: periodPayable.toString(),
        startPayable: startPayable.toString(),
        duePayable: nextDuePayable.result[0].toString(),
        nextDuePayable: nextDuePayable.result[1].toString(),
        token: new Token(
          56,
          _token,
          decimals.result,
          symbol.result?.toString()?.toUpperCase() ?? 'symbol',
          name.result?.toString() ?? 'name',
          'https://www.trueusd.com/',
        ),
        // allTokens.find((tk) => tk.address === token),
      }
    }),
  )

  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...sponsor,
    collection,
    sponsorAddress,
    accounts: accounts.filter((acct) => !!acct),
    bountyRequired: bountyRequired.result,
    devaddr_: devaddr_.result,
    cosignEnabled: cosignEnabled.result,
    collectionId: collectionId.result.toString(),
    minCosigners: minCosigners.result.toString(),
    requiredIndentity: requiredIndentity.result,
    valueName: valueName.result,
    _ve: _ve.result,
  }
}

export const fetchSponsors = async ({ fromSponsor }) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [sponsorAddresses] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getSponsorHelperAddress(),
        abi: sponsorNoteABI,
        functionName: 'getAllSponsors',
        args: [BigInt(0)],
      },
    ],
  })
  const sponsors = await Promise.all(
    sponsorAddresses.result
      .filter((sponsorAddress) => (fromSponsor ? sponsorAddress?.toLowerCase() === fromSponsor?.toLowerCase() : true))
      .map(async (sponsorAddress, index) => {
        const data = await fetchSponsor(sponsorAddress)
        return {
          sousId: index,
          ...data,
        }
      })
      .flat(),
  )
  return sponsors
}
