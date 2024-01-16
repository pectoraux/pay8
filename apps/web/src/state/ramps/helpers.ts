import axios from 'axios'
import NodeRSA from 'encrypt-rsa'
import { Token } from '@pancakeswap/sdk'
import { firestore } from 'utils/firebase'
import request, { gql } from 'graphql-request'
import { GRAPH_API_RAMPS } from 'config/constants/endpoints'
import { publicClient } from 'utils/wagmi'
import { rampABI } from 'config/abi/ramp'
import { erc20ABI } from 'wagmi'
import { rampAdsABI } from 'config/abi/rampAds'
import { getRampAdsAddress } from 'utils/addressHelpers'
import { getCollection } from 'state/cancan/helpers'
import { veABI } from 'config/abi/ve'

import { rampFields, accountFields, sessionFields } from './queries'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection('ramps').doc(rampAddress).get()).data()
}

export const getCardId = async (vcId) => {
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
        query getCardId($vcId: String) {
          virtualCard(id: $vcId) {
            id
            symbol
            owner
            cardId
          }
        }
      `,
      { vcId },
    )

    console.log('getCardId===========>', res, vcId)
    return res.virtualCard
  } catch (error) {
    console.error('Failed to fetch vcs=============>', error)
    return null
  }
}

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_RAMPS,
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

export const getTagFromRamp = async (rampAddress) => {
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
        query getTagFromRamp($rampAddress: String!) {
          tags(where: { active: true, ramp_: { id: $rampAddress } }) {
            id
          }
        }
      `,
      { rampAddress },
    )
    const mtags = res.tags.map((tag) => tag.id)
    console.log('getTag===========>', res, mtags?.toString(), rampAddress)
    return mtags?.toString()
  } catch (error) {
    console.error('Failed to fetch tags from ramp=============>', error)
    return null
  }
}

export const getRamps = async (first = 5, skip = 0, where = {}) => {
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
      query getRamps($first: Int!, $skip: Int!, $where: NFT_filter) 
      {
        ramps(first: $first, skip: $skip, where: $where) {
          ${rampFields}
        }
      }
      `,
      {
        first,
        skip,
        where,
      },
    )
    console.log('res.ramps===================>', res.ramps)
    return res.ramps
  } catch (error) {
    console.error('Failed to fetch ramps==============>', error)
    return []
  }
}

export const getNfts = async (first = 5, skip = 0, where = {}) => {
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
        # query getRamps($first: Int!, $skip: Int!, $where: NFT_filter)
        {
          nfts {
            id
            profileId
            tokenAddress
            metadataUrl
          }
        }
      `,
      {
        first,
        skip,
        where,
      },
    )
    console.log('res.nfts===================>', res.nfts)
    return res.nfts
  } catch (error) {
    console.error('Failed to fetch nfts==============>', error)
    return []
  }
}

export const getSession = async (sessionId: string, rampAddress: string) => {
  const sId = `${sessionId}-${rampAddress}`
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
        query getSessionData($sId: String!) 
        {
          session(id: $sId) {
            ${sessionFields}
          },
          ramps(id: $rampAddress) {
            clientIds,
            secretKeys,
            publishableKeys,
          }
        }
      `,
      { sId, rampAddress },
    )
    console.log('11getSession===========>', res)

    return res.session
  } catch (error) {
    console.error('Failed to fetch session=============>', error, sessionId)
    return null
  }
}

export const getRampSg = async (rampAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
        query getRampData($rampAddress: String!) 
        {
          ramp(id: $rampAddress) {
            ${rampFields}
          }
        }
      `,
      { rampAddress },
    )
    console.log('getRampSg=================>', res)
    return res.ramp
  } catch (error) {
    console.error('Failed to fetch session=============>', error)
    return null
  }
}

export const getAccountSg = async (address: string, channel: string) => {
  const ownerAddress = address?.toLowerCase()
  try {
    const res = await request(
      GRAPH_API_RAMPS,
      gql`
        query getAccountData($ownerAddress: String!, $channel: String!) 
        {
          accounts(where: { owner: $ownerAddress, channel: $channel }) {
            ${accountFields}
          }
        }
      `,
      { ownerAddress, channel },
    )
    console.log('getAccountSg=================>', res)
    return res.accounts?.length && res.accounts?.find((acct) => !!acct?.id)
  } catch (error) {
    console.error('Failed to fetch account=============>', error)
    return null
  }
}

export const getTokenData = async (tokenAddress, chainId) => {
  const bscClient = publicClient({ chainId })
  const [name, symbol, decimals] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'name',
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'symbol',
      },
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'decimals',
      },
    ],
  })
  return { name: name.result, symbol: symbol.result, decimals: decimals.result }
}

// eslint-disable-next-line consistent-return
export const fetchRamp = async (address, chainId) => {
  const rampAddress = address?.toLowerCase()
  const gauge = await getRampSg(rampAddress)
  try {
    // const serializedTokens = serializeTokens()
    const bscClient = publicClient({ chainId })
    const [devaddr_, tokens, params, pricePerAttachMinutes] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: rampAddress,
          abi: rampABI,
          functionName: 'devaddr_',
        },
        {
          address: rampAddress,
          abi: rampABI,
          functionName: 'getAllTokens',
          args: [BigInt(0)],
        },
        {
          address: rampAddress,
          abi: rampABI,
          functionName: 'getParams',
        },
        {
          address: getRampAdsAddress(),
          abi: rampAdsABI,
          functionName: 'pricePerAttachMinutes',
        },
      ],
    })

    const rampBadgeId = params.result[0]
    const rampTokenId = params.result[1]
    const mintFee = params.result[2]
    const burnFee = params.result[3]
    const rampSalePrice = params.result[4]
    const soldAccounts = params.result[5]
    const automatic = params.result[6]
    const _ve = params.result[7]

    const [saleTokenAddress] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: _ve,
          abi: veABI,
          functionName: 'token',
        },
      ],
    })

    const [saleTokenSymbol] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: saleTokenAddress.result,
          abi: erc20ABI,
          functionName: 'symbol',
        },
      ],
    })

    const sessions = gauge?.sessions
    const clientIds = gauge?.clientIds
    const secretKeys = gauge?.secretKeys
    const publishableKeys = gauge?.publishableKeys
    const nodeRSA = new NodeRSA(process.env.NEXT_PUBLIC_PUBLIC_KEY, process.env.NEXT_PUBLIC_PRIVATE_KEY)
    const allSessions = await Promise.all(
      sessions
        ?.filter((session) => session?.active)
        .map(async (session) => {
          let ppData
          const sk = gauge.secretKeys?.length && gauge.secretKeys[0]
          const sk0 = sk
            ? nodeRSA.decryptStringWithRsaPrivateKey({
                text: sk,
                privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
              })
            : ''
          const [name, symbol, decimals] = await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: session?.tokenAddress,
                abi: erc20ABI,
                functionName: 'name',
              },
              {
                address: session?.tokenAddress,
                abi: erc20ABI,
                functionName: 'symbol',
              },
              {
                address: session?.tokenAddress,
                abi: erc20ABI,
                functionName: 'decimals',
              },
            ],
          })
          if (session.mintSession) {
            ppData = await Promise.all([axios.post('/api/check', { sessionId: session.sessionId, sk: sk0 })])
          }

          return {
            ...session,
            ppDataFound: ppData?.length && !ppData[0]?.data?.error,
            ppData: ppData?.length && ppData[0]?.data,
            token: new Token(
              56,
              session?.tokenAddress,
              decimals.result,
              symbol.result?.toString()?.toUpperCase() ?? 'symbol',
              name.result?.toString() ?? 'name',
              `https://tokens.payswap.org/images/${session?.tokenAddress}.png`,
            ),
          }
        }),
    )
    let accounts = []
    const _tokens = tokens.result as any
    try {
      accounts = await Promise.all(
        !_tokens?.length
          ? []
          : _tokens.map(async (token, index) => {
              const [protocolInfo, mintAvailable, partnerBounties, totalRevenue] = await bscClient.multicall({
                allowFailure: true,
                contracts: [
                  {
                    address: rampAddress,
                    abi: rampABI,
                    functionName: 'protocolInfo',
                    args: [token],
                  },
                  {
                    address: getRampAdsAddress(),
                    abi: rampAdsABI,
                    functionName: 'mintAvailable',
                    args: [rampAddress, token],
                  },
                  {
                    address: rampAddress,
                    abi: rampABI,
                    functionName: 'getAllPartnerBounties',
                    args: [token, BigInt(0)],
                  },
                  {
                    address: rampAddress,
                    abi: rampABI,
                    functionName: 'totalRevenue',
                    args: [token],
                  },
                ],
              })
              const paidToPartners = await Promise.all(
                partnerBounties.result?.map(async (pbounty) => {
                  const [paidRevenue] = await bscClient.multicall({
                    allowFailure: true,
                    contracts: [
                      {
                        address: rampAddress,
                        abi: rampABI,
                        functionName: 'paidRevenue',
                        args: [token, pbounty],
                      },
                    ],
                  })
                  return {
                    paidRevenue: paidRevenue.result,
                    partnerBounty: pbounty,
                  }
                }),
              )
              console.log('partnerBounties===========>', partnerBounties, paidToPartners)
              const { name, symbol, decimals } = await getTokenData(token, chainId)
              return {
                sousId: index,
                status: protocolInfo.result[0] === 0 ? 'Sold' : protocolInfo.result[0] === 1 ? 'Open' : 'Close',
                isOverCollateralised: mintAvailable.result[2] === 0,
                backingBalance: mintAvailable.result[1]?.toString(),
                mintable: mintAvailable.result[0]?.toString(),
                tokenId: protocolInfo.result[1]?.toString(),
                bountyId: protocolInfo.result[2]?.toString(),
                profileId: protocolInfo.result[3]?.toString(),
                badgeId: protocolInfo.result[4]?.toString(),
                minted: protocolInfo.result[5]?.toString(),
                burnt: protocolInfo.result[6]?.toString(),
                salePrice: protocolInfo.result[7]?.toString(),
                maxPartners: protocolInfo.result[8]?.toString(),
                partnerBounties: partnerBounties.result?.toString(),
                totalRevenue: totalRevenue.result?.toString(),
                paidToPartners,
                cap: protocolInfo.result[9]?.toString(),
                token: new Token(chainId, token, decimals ?? 18, symbol, name, 'https://www.payswap.org/'),
                // allTokens.find((tk) => tk.address === token),
              }
            }),
      )
    } catch (err) {
      console.log('mintAvailable========>', err)
    }
    const cIds = clientIds || ['', '', '', '', '']
    const sks = secretKeys || ['', '', '', '', '']
    const pks = publishableKeys || ['', '', '', '', '']
    let pk0
    let pk1
    let pk2
    let pk3
    let pk4
    let sk0
    let sk1
    let sk2
    let sk3
    let sk4
    let cId0
    let cId1
    let cId2
    let cId3
    let cId4
    try {
      pk0 = pks[0]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: pks[0],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      pk1 = pks[1]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: pks[1],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      pk2 = pks[2]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: pks[2],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      pk3 = pks[3]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: pks[3],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      pk4 = pks[4]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: pks[4],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      sk0 = sks[0]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: sks[0],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      sk1 = sks[1]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: sks[1],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      sk2 = sks[2]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: sks[2],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      sk3 = sks[3]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: sks[3],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      sk4 = sks[4]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: sks[4],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''

      cId0 = cIds[0]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: cIds[0],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      cId1 = cIds[1]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: cIds[1],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      cId2 = cIds[2]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: cIds[2],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      cId3 = cIds[3]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: cIds[3],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
      cId4 = cIds[4]
        ? nodeRSA.decryptStringWithRsaPrivateKey({
            text: cIds[4],
            privateKey: process.env.NEXT_PUBLIC_PRIVATE_KEY,
          })
        : ''
    } catch (err) {
      console.log('err=============>', err)
    }
    const collection = await getCollection(gauge.collectionId)
    const _products = await getTagFromRamp(rampAddress?.toLowerCase())
    // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
    return {
      ...gauge,
      secretKeys: [sk0, sk1, sk2, sk3, sk4],
      clientIds: [cId0, cId1, cId2, cId3, cId4],
      publishableKeys: [pk0, pk1, pk2, pk3, pk4],
      allSessions,
      rampAddress,
      accounts,
      devaddr_: devaddr_.result,
      automatic,
      _ve,
      rampBadgeId: rampBadgeId.toString(),
      rampTokenId: rampTokenId.toString(),
      mintFee: mintFee.toString(),
      burnFee: burnFee.toString(),
      rampSalePrice: rampSalePrice.toString(),
      soldAccounts: soldAccounts.toString(),
      collection,
      products: _products,
      saleTokenAddress: saleTokenAddress.result,
      saleTokenSymbol: saleTokenSymbol.result,
      pricePerAttachMinutes: pricePerAttachMinutes.result.toString(),
    }
  } catch (err) {
    console.log('fetchRamp err================>', err)
    return gauge
  }
}

export const fetchRamps = async ({ chainId }) => {
  const gauges = await getRamps()
  const nfts = await getNfts()
  const ramps = await Promise.all(
    gauges
      .filter((gauge) => !!gauge)
      .map(async (gauge, index) => {
        const data = await fetchRamp(gauge.id, chainId)
        return {
          sousId: index,
          ...data,
          nfts,
        }
      })
      .flat(),
  )
  return ramps
}
