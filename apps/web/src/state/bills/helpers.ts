import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_BILLS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { publicClient } from 'utils/wagmi'
import { billABI } from 'config/abi/bill'
import { erc20ABI, erc721ABI } from 'wagmi'
import { getBILLMinterAddress, getBILLNoteAddress } from 'utils/addressHelpers'
import { billNoteABI } from 'config/abi/billNote'
import { billMinterABI } from 'config/abi/billMinter'
import { getCollection } from 'state/cancan/helpers'
import { billFields, protocolFields } from './queries'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_BILLS,
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

export const getTagFromBill = async (address) => {
  try {
    const res = await request(
      GRAPH_API_BILLS,
      gql`
        query getTagFromBill($address: String!) {
          tags(where: { active: true, bill_: { id: $address } }) {
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
      GRAPH_API_BILLS,
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

export const getProtocol = async (billAddress: string) => {
  try {
    const res = await request(
      GRAPH_API_BILLS,
      gql`
        query getProtocolData($billAddress: String!) 
        {
          protocols(where: { bill: $billAddress }) {
            ${protocolFields}
          }
        }
      `,
      { billAddress },
    )
    return res.protocols
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, billAddress)
    return null
  }
}

export const getBill = async (billAddress) => {
  try {
    const res = await request(
      GRAPH_API_BILLS,
      gql`
        query getBill($billAddress: String) 
        {
          bill(id: $billAddress) {
            ${billFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { billAddress },
    )
    console.log('getBill=================>', billAddress, res)
    return res.bill
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, billAddress)
    return null
  }
}

export const getBills = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_BILLS,
      gql`
        query getBills($where: BILL_filter) 
        {
          bills(first: $first, skip: $skip, where: $where) {
            ${billFields}
            protocols {
              ${protocolFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getBillsFromSg33=============>', res)
    return res.bills
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
        address: getBILLNoteAddress(),
        abi: billNoteABI,
        functionName: 'pendingRevenueFromNote',
        args: [BigInt(tokenId)],
      },
      {
        address: getBILLNoteAddress(),
        abi: billNoteABI,
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

export const fetchBill = async (billAddress, chainId) => {
  const bill = await getBill(billAddress.toLowerCase())
  const bscClient = publicClient({ chainId })
  const [
    devaddr_,
    bountyRequired,
    profileRequired,
    collectionId,
    adminCreditShare,
    adminDebitShare,
    maxNotesPerProtocol,
    period,
    adminBountyRequired,
    isPayable,
    bufferTime,
    migrationPoint,
  ] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: billAddress,
        abi: billABI,
        functionName: 'devaddr_',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'bountyRequired',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'profileRequired',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'collectionId',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'adminCreditShare',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'adminDebitShare',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'maxNotesPerProtocol',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'period',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'adminBountyRequired',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'isPayable',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'bufferTime',
      },
      {
        address: billAddress,
        abi: billABI,
        functionName: 'migrationPoint',
      },
    ],
  })
  const collection = await getCollection(collectionId.result.toString())
  let payableNotes
  const accounts = await Promise.all(
    bill?.protocols
      ?.filter((protocol) => protocol.active)
      ?.map(async (protocol) => {
        const protocolId = protocol.id.split('_')[0]
        const [protocolInfo, optionId, isAutoChargeable, heir, metadataUrl] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: billAddress,
              abi: billABI,
              functionName: 'protocolInfo',
              args: [BigInt(protocolId)],
            },
            {
              address: billAddress,
              abi: billABI,
              functionName: 'optionId',
              args: [BigInt(protocolId)],
            },
            {
              address: billAddress,
              abi: billABI,
              functionName: 'isAutoChargeable',
              args: [BigInt(protocolId)],
            },
            {
              address: billAddress,
              abi: billABI,
              functionName: 'heir',
              args: [BigInt(protocolId)],
            },
            {
              address: getBILLMinterAddress(),
              abi: erc721ABI,
              functionName: 'tokenURI',
              args: [BigInt(protocolId)],
            },
          ],
        })
        const _token = protocolInfo.result[0]
        const version = protocolInfo.result[1]
        const bountyId = protocolInfo.result[2]
        const profileId = protocolInfo.result[3]
        const credit = protocolInfo.result[4]
        const debit = protocolInfo.result[5]
        const startPayable = protocolInfo.result[6]
        const startReceivable = protocolInfo.result[7]
        const periodPayable = protocolInfo.result[8]
        const periodReceivable = protocolInfo.result[9]
        const creditFactor = protocolInfo.result[10]
        const debitFactor = protocolInfo.result[11]

        const [
          adminBountyId,
          name,
          symbol,
          decimals,
          totalLiquidity,
          receivables,
          payables,
          media,
          description,
          userBountyRequired,
          taxContract,
        ] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: billAddress,
              abi: billABI,
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
              args: [billAddress],
            },
            {
              address: getBILLNoteAddress(),
              abi: billNoteABI,
              functionName: 'getDueReceivable',
              args: [billAddress, BigInt(protocolId)],
            },
            {
              address: getBILLNoteAddress(),
              abi: billNoteABI,
              functionName: 'getDuePayable',
              args: [billAddress, BigInt(protocolId)],
            },
            {
              address: billAddress,
              abi: billABI,
              functionName: 'adminBountyId',
              args: [_token],
            },
            {
              address: billAddress,
              abi: billABI,
              functionName: 'media',
              args: [BigInt(protocolId)],
            },
            {
              address: billAddress,
              abi: billABI,
              functionName: 'description',
              args: [BigInt(protocolId)],
            },
            {
              address: billAddress,
              abi: billABI,
              functionName: 'userBountyRequired',
              args: [BigInt(protocolId)],
            },
            {
              address: billAddress,
              abi: billABI,
              functionName: 'taxContract',
              args: [BigInt(protocolId)],
            },
          ],
        })
        payableNotes = await Promise.all(
          protocol?.notes?.map(async (note) => {
            const [owner, metadatUrl] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: getBILLNoteAddress(),
                  abi: billNoteABI,
                  functionName: 'ownerOf',
                  args: [BigInt(note?.id)],
                },
                {
                  address: getBILLNoteAddress(),
                  abi: billNoteABI,
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
          heir: heir.result?.toString(),
          isAutoChargeable: isAutoChargeable.result,
          adminBountyId: adminBountyId.result.toString(),
          bountyId: bountyId.toString(),
          profileId: profileId.toString(),
          version: version.toString(),
          optionId: optionId.result.toString(),
          credit: credit.toString(),
          debit: debit.toString(),
          creditFactor: creditFactor.toString(),
          debitFactor: debitFactor.toString(),
          periodReceivable: periodReceivable.toString(),
          periodPayable: periodPayable.toString(),
          startPayable: startPayable.toString(),
          startReceivable: startReceivable.toString(),
          totalLiquidity: totalLiquidity.result.toString(),
          dueReceivable: receivables.result[0].toString(),
          nextDueReceivable: receivables.result[1].toString(),
          duePayable: payables.result[0].toString(),
          nextDuePayable: payables.result[1].toString(),
          bountyRequired: bountyRequired.result?.toString(),
          media: media.result?.toString(),
          description: description.result?.toString(),
          userBountyRequired: userBountyRequired.result?.toString(),
          taxContract: taxContract.result?.toString(),
          metadataUrl: metadataUrl.result,
          token: new Token(
            chainId,
            _token,
            decimals.result,
            symbol.result?.toString()?.toUpperCase() ?? 'symbol',
            name.result?.toString() ?? 'name',
            'https://www.payswap.org/',
          ),
          // allTokens.find((tk) => tk.address === token),
        }
      }),
  )

  const receivableNotes = await Promise.all(
    bill?.notes?.map(async (note) => {
      const [owner, metadatUrl] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: getBILLNoteAddress(),
            abi: billNoteABI,
            functionName: 'ownerOf',
            args: [BigInt(note?.id)],
          },
          {
            address: getBILLNoteAddress(),
            abi: billNoteABI,
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
  const products = await getTagFromBill(billAddress?.toLowerCase())
  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    ...bill,
    billAddress,
    payableNotes,
    receivableNotes,
    accounts,
    collection,
    migrationPoint: migrationPoint.result,
    profileRequired: profileRequired.result,
    devaddr_: devaddr_.result,
    adminCreditShare: adminCreditShare.result?.toString(),
    adminDebitShare: adminDebitShare.result?.toString(),
    maxNotesPerProtocol: maxNotesPerProtocol.result?.toString(),
    period: period?.result?.toString(),
    adminBountyRequired: adminBountyRequired?.result?.toString(),
    isPayable: isPayable.result?.toString(),
    bufferTime: bufferTime.result?.toString(),
    collectionId: collectionId.result.toString(),
    bountyRequired: bountyRequired.result.toString(),
    products,
  }
}

export const fetchBills = async ({ fromBill, chainId }) => {
  const bscClient = publicClient({ chainId })
  const [billAddresses] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getBILLMinterAddress(),
        abi: billMinterABI,
        functionName: 'getAllBills',
        args: [BigInt(0)],
      },
    ],
  })
  const bills = await Promise.all(
    billAddresses.result
      .filter((billAddress) => (fromBill ? billAddress?.toLowerCase() === fromBill?.toLowerCase() : true))
      .map(async (billAddress, index) => {
        const data = await fetchBill(billAddress, chainId)
        return {
          sousId: index,
          ...data,
        }
      })
      .flat(),
  )
  return bills
}
