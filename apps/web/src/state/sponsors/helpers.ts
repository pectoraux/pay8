import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_SPONSORS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { publicClient } from 'utils/wagmi'
import { sponsorABI } from 'config/abi/sponsor'
import { erc20ABI } from 'wagmi'
import { sponsorNoteABI } from 'config/abi/sponsorNote'
import { getSponsorHelperAddress } from 'utils/addressHelpers'
import { getCollection } from 'state/cancan/helpers'

import { sponsorFields, protocolFields } from './queries'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
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

export const getTagFromSponsor = async (address) => {
  try {
    const res = await request(
      GRAPH_API_SPONSORS,
      gql`
        query getTagFromSponsor($address: String!) {
          tags(where: { active: true, sponsor_: { id: $address } }) {
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

export const fetchSponsor = async (sponsorAddress, chainId) => {
  const sponsor = await getSponsor(sponsorAddress.toLowerCase())
  const bscClient = publicClient({ chainId })
  const [devaddr_, _ve, collectionId, maxNotesPerProtocol] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: sponsorAddress,
        abi: sponsorABI,
        functionName: 'devaddr_',
      },
      {
        address: sponsorAddress,
        abi: sponsorABI,
        functionName: '_ve',
      },
      {
        address: sponsorAddress,
        abi: sponsorABI,
        functionName: 'collectionId',
      },
      {
        address: sponsorAddress,
        abi: sponsorABI,
        functionName: 'maxNotesPerProtocol',
      },
    ],
  })
  const collection = await getCollection(collectionId.result.toString())
  const accounts = await Promise.all(
    sponsor?.protocols
      ?.filter((protocol) => protocol.active)
      ?.map(async (protocol) => {
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
            chainId,
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
  const products = await getTagFromSponsor(sponsorAddress)
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...sponsor,
    sponsorAddress,
    accounts: accounts.filter((acct) => !!acct),
    devaddr_: devaddr_.result,
    collectionId: collectionId.result.toString(),
    maxNotesPerProtocol: maxNotesPerProtocol.result,
    _ve: _ve.result,
    collection,
    products,
  }
}

export const getPendingRevenue = async (tokenId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [note] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getSponsorHelperAddress(),
        abi: sponsorNoteABI,
        functionName: 'notes',
        args: [BigInt(tokenId)],
      },
    ],
  })
  return note.result
}

export const fetchSponsors = async ({ fromSponsor, chainId }) => {
  const bscClient = publicClient({ chainId })
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
        const data = await fetchSponsor(sponsorAddress, chainId)
        return {
          sousId: index,
          ...data,
        }
      })
      .flat(),
  )
  return sponsors
}
