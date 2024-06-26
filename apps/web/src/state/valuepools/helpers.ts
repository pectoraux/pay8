import BigNumber from 'bignumber.js'
import request, { gql } from 'graphql-request'
import { LEVIATHANS } from 'config/constants/exchange'
import { GRAPH_API_VALUEPOOLS } from 'config/constants/endpoints'
import { valuePoolABI } from 'config/abi/valuePool'
import { publicClient } from 'utils/wagmi'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { erc20ABI, erc721ABI } from 'wagmi'
import { vaABI } from 'config/abi/va'
import { getValuepoolHelperAddress, getValuepoolVoterAddress } from 'utils/addressHelpers'
import { valuePoolHelperABI } from 'config/abi/valuePoolHelper'
import { isAddress } from 'utils'
import { fetchSponsor, getSponsors } from 'state/sponsors/helpers'
import { valuePoolVoterABI } from 'config/abi/valuePoolVoter'
import { getCollection } from 'state/cancan/helpers'
import { veABI } from 'config/abi/ve'

import { getValuepoolContract } from '../../utils/contractHelpers'

const valuepoolField = `
id
active
riskpool
initialized
bnpl
onePersonOneVote
name
description
ve
devaddr_
tokenAddress
veName
veSymbol
veDecimals
maxSupply
minTicketPrice
minToSwitch
timestamp
queueDuration
maxDueReceivable
minReceivable
treasuryShare
maxWithdrawable
lenderFactor
minimumSponsorPercentile
veBalance
`
const transactionFields = `
id
block
timestamp
tokenId
veAddress
user
netPrice
depositType
rank
locktime
txType
valuepool {
  id
}
`
const sponsorFields = `
id
card
geoTag
active
timestamp
updatedAt
amount
percentile

`
const loanFields = `
id
createAt
updatedAt
tokenId
amount
active
borrower
token
loanType
`
const tokenFields = `
id
vePercentile
vavaPercentile
tokenId
owner
lockAmount
lockValue
lockTime
createAt
updatedAt
countries
cities
products
metadataUrl
`
const purchaseFields = `
id
timestamp
updatedAt
active
collection
from
referrer
productId
options
userTokenId
identityTokenId
tokenId
rank
epoch
price
`

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_VALUEPOOLS,
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

export const getTagFromValuepool = async (address) => {
  try {
    const res = await request(
      GRAPH_API_VALUEPOOLS,
      gql`
        query getTagFromValuepool($address: String!) {
          tags(where: { active: true, token_: { id: $address } }) {
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

export const getERC721BalanceOf = async (tokenAddress, recipientAddress, chainId) => {
  const bscClient = publicClient({ chainId })
  const [gauge] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: tokenAddress,
        abi: erc721ABI,
        functionName: 'balanceOf',
        args: [recipientAddress],
      },
    ],
  })
  return gauge.result
}

export const getERC20BalanceOf = async (tokenAddress, recipientAddress, chainId) => {
  const bscClient = publicClient({ chainId })
  const [gauge] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: tokenAddress,
        abi: erc20ABI,
        functionName: 'balanceOf',
        args: [recipientAddress],
      },
    ],
  })
  return gauge.result
}

export const getVoteOption = async (veAddress, chainId) => {
  const bscClient = publicClient({ chainId })
  const [gauge] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getValuepoolVoterAddress(),
        abi: valuePoolVoterABI,
        functionName: 'voteOption',
        args: [veAddress],
      },
    ],
  })
  return gauge.result
}

export const getGauge = async (proposalId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [gauge] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getValuepoolVoterAddress(),
        abi: valuePoolVoterABI,
        functionName: 'gauges',
        args: [proposalId],
      },
    ],
  })
  return gauge.result
}

export const getBribe = async (proposalId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [bribe] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getValuepoolVoterAddress(),
        abi: valuePoolVoterABI,
        functionName: 'bribe',
        args: [proposalId],
      },
    ],
  })
  return bribe.result
}

export const getWithdrawable = async (veAddress, tokenId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [withdrawable, amountWithdrawable] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: veAddress,
        abi: veABI,
        functionName: 'withdrawable',
      },
      {
        address: veAddress,
        abi: veABI,
        functionName: 'getWithdrawable',
        args: [tokenId],
      },
    ],
  })
  return {
    withdrawable: withdrawable.result,
    amountWithdrawable: amountWithdrawable.result,
  }
}

export const fetchValuepool = async (valuepoolContract, chainId) => {
  try {
    const valuepoolAddress = valuepoolContract.address
    console.log('valuepoolsFromSg26=============>', valuepoolAddress)
    const bscClient = publicClient({ chainId })
    const [
      tokenAddress,
      getParams,
      _va,
      devaddr_,
      maxWithdrawable,
      merchantMinIDBadgeColor,
      merchantValueName,
      totalpaidBySponsors,
      treasuryShare,
      _sponsorAddresses,
      // epoch,
    ] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'token',
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'getParams',
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: '_ve',
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'devaddr_',
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'maxWithdrawable',
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'merchantMinIDBadgeColor',
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'merchantValueName',
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'totalpaidBySponsors',
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'treasuryShare',
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'getAllSponsors',
          args: [BigInt(0), BigInt(0), false],
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'epoch',
        },
      ],
    })
    const [collectionId, period, voteOption, minPeriod, minBountyRequired, minDifference, minimumLockValue] =
      await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: getValuepoolVoterAddress(),
            abi: valuePoolVoterABI,
            functionName: 'collectionId',
            args: [_va.result],
          },
          {
            address: getValuepoolVoterAddress(),
            abi: valuePoolVoterABI,
            functionName: 'period',
            args: [_va.result],
          },
          {
            address: getValuepoolVoterAddress(),
            abi: valuePoolVoterABI,
            functionName: 'voteOption',
            args: [_va.result],
          },
          {
            address: getValuepoolVoterAddress(),
            abi: valuePoolVoterABI,
            functionName: 'minPeriod',
            args: [_va.result],
          },
          {
            address: getValuepoolVoterAddress(),
            abi: valuePoolVoterABI,
            functionName: 'minBountyRequired',
            args: [_va.result],
          },
          {
            address: getValuepoolVoterAddress(),
            abi: valuePoolVoterABI,
            functionName: 'minDifference',
            args: [_va.result],
          },
          {
            address: getValuepoolVoterAddress(),
            abi: valuePoolVoterABI,
            functionName: 'minimumLockValue',
            args: [_va.result],
          },
        ],
      })
    // const maxUse = getParams.result[0]
    const queueDuration = getParams.result[1]
    // const minReceivable = getParams.result[2]
    const maxDueReceivable = getParams.result[3]
    // const maxTreasuryShare = getParams.result[4]
    // const lenderFactor = getParams.result[5]
    // const minimumSponsorPercentile = getParams.result[6]
    // const minIDBadgeColor = getParams.result[7]
    // const dataKeeperOnly = getParams.result[8]
    // const uniqueAccounts = getParams.result[9]
    const requiredIndentity = getParams.result[10]
    const valueName = getParams.result[11]

    const initialized = _va.result !== ADDRESS_ZERO
    const sponsorAddresses = _sponsorAddresses.result.map((sponsorAddress) => sponsorAddress?.toLowerCase())
    const _sponsors = await getSponsors(0, 0, { id_in: sponsorAddresses })
    const sponsors = await Promise.all(_sponsors.map(async (sp) => fetchSponsor(sp?.id, chainId)))
    console.log('1valuepoolsFromSg3_=============>', sponsors, sponsorAddresses)
    const [name, symbol, decimals, totalLiquidity, vaParams, vaName, vaSymbol, vaDecimals, riskpool] =
      await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: tokenAddress.result,
            abi: erc20ABI,
            functionName: 'name',
          },
          {
            address: tokenAddress.result,
            abi: erc20ABI,
            functionName: 'symbol',
          },
          {
            address: tokenAddress.result,
            abi: erc20ABI,
            functionName: 'decimals',
          },
          {
            address: tokenAddress.result,
            abi: erc20ABI,
            functionName: 'balanceOf',
            args: [valuepoolAddress],
          },
          {
            address: _va.result,
            abi: vaABI,
            functionName: 'getParams',
          },
          {
            address: _va.result,
            abi: vaABI,
            functionName: 'name',
          },
          {
            address: _va.result,
            abi: vaABI,
            functionName: 'symbol',
          },
          {
            address: _va.result,
            abi: vaABI,
            functionName: 'decimals',
          },
          {
            address: _va.result,
            abi: vaABI,
            functionName: 'riskpool',
          },
        ],
      })
    console.log('totalLiquidity==================>', totalLiquidity)
    console.log('valuepoolsFromSg34=============>', _va)
    const supply = initialized ? vaParams.result[0] : '0'
    console.log('valuepoolsFromSg4=============>', totalLiquidity, supply, vaName, vaDecimals)
    const colors = {
      '3': 'Gold',
      '2': 'Silver',
      '1': 'Brown',
      '0': 'Black',
    }
    const collection = await getCollection(collectionId.result.toString())
    const _totalLiquidity = new BigNumber(totalLiquidity.result.toString())
      .div(10 ** Number(decimals.result))
      .toFixed(Number(decimals.result))
    const _treasuryShare = new BigNumber(treasuryShare.result.toString()).div(100).toString()
    const _maxWithdrawable = new BigNumber(100)
      .minus(new BigNumber(maxWithdrawable.result.toString()).div(100))
      .toJSON()
    const products = await getTagFromValuepool(tokenAddress.result?.toLowerCase())
    // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
    return {
      _va: _va.result,
      // queue: augmentedQ,
      name: name.result,
      symbol: symbol.result,
      vaName: vaName.result,
      sponsors,
      vaSymbol: vaSymbol.result,
      vaDecimals: vaDecimals.result,
      valuepoolAddress,
      tokenAddress: tokenAddress.result,
      initialized,
      supply, // : supply.(10**vaDecimals),
      totalLiquidity: _totalLiquidity === 'NaN' ? '0' : _totalLiquidity,
      devaddr_: devaddr_.result,
      requiredIndentity,
      valueName,
      riskpool: riskpool.result,
      totalpaidBySponsors: totalpaidBySponsors.result.toString(),
      treasuryShare: _treasuryShare === 'NaN' ? '0' : _treasuryShare,
      maxWithdrawable: _maxWithdrawable === 'NaN' ? '0' : _maxWithdrawable,
      merchantMinIDBadgeColor: colors[merchantMinIDBadgeColor.result.toString()],
      merchantValueName: merchantValueName.result,
      maxDueReceivable: maxDueReceivable.toString(),
      queueDuration: queueDuration.toString(),
      collection,
      period: period.result?.toString(),
      voteOption: voteOption.result,
      minPeriod: minPeriod.result?.toString(),
      minBountyRequired: minBountyRequired.result?.toString(),
      minDifference: minDifference.result?.toString(),
      minimumLockValue: minimumLockValue.result?.toString(),
      products,
    }
  } catch (err) {
    console.log('rerr==============>', err)
  }
  return {}
}

export const getValuepoolsSg = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_VALUEPOOLS,
      gql`
        query getValuepools($where: Valuepool_filter) 
        {
          valuepools(first: $first, skip: $skip, where: $where) {
            ${valuepoolField}
            sponsorAddresses {
              ${sponsorFields}
            }
            loans {
              ${loanFields}
            }
            tokens {
              ${tokenFields}
            }
            purchaseHistory {
              ${purchaseFields}
            }
            transactionHistory{
              ${transactionFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log('res.valuepools================>', res.valuepools)
    return res.valuepools
  } catch (err) {
    console.log('err sg================>', err)
  }
  return []
}

export const getTokenURIs = async (_vaAddress, nfts, chainId) => {
  const bscClient = publicClient({ chainId })
  const nftsFromBc = await Promise.all(
    nfts.map(async (nft) => {
      const [metadataUrl] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: _vaAddress,
            abi: vaABI,
            functionName: 'tokenURI',
            args: [BigInt(nft?.tokenId)],
          },
        ],
      })
      return {
        ...nft,
        metadataUrl: metadataUrl.result,
      }
    }),
  )
  return nftsFromBc
}

export const fetchValuepools = async ({ fromVesting, fromValuepool, chainId }) => {
  console.log('fromValuepool==========>', fromValuepool, isAddress(fromValuepool))
  const whereClause =
    isAddress(fromValuepool) && fromValuepool !== ADDRESS_ZERO
      ? {
          active: true,
          id_in: [fromValuepool?.toLowerCase()],
        }
      : fromVesting
      ? {
          active: true,
          id_in: LEVIATHANS,
        }
      : {
          active: true,
        }
  const valuepoolsFromSg = await getValuepoolsSg(0, 0, whereClause)
  console.log('valuepoolsFromSg===================>', valuepoolsFromSg)
  try {
    const bscClient = publicClient({ chainId })
    const valuepools = await Promise.all(
      valuepoolsFromSg
        .map(async ({ id, ...rest }, index) => {
          console.log('valuepoolsFromSg1===================>')
          const valuepoolContract = getValuepoolContract(id)
          const data = await fetchValuepool(valuepoolContract, chainId)
          console.log('valuepoolsFromSg2===================>', data)
          const [onePersonOneVote, description] = await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: getValuepoolHelperAddress(),
                abi: valuePoolHelperABI,
                functionName: 'onePersonOneVote',
                args: [id],
              },
              {
                address: getValuepoolHelperAddress(),
                abi: valuePoolHelperABI,
                functionName: 'getDescription',
                args: [id],
              },
            ],
          })
          const res = {
            sousId: index.toString(),
            id,
            onePersonOneVote,
            ...data,
            ...rest,
            description: description.result?.length ? description.result[0] : '',
          }
          console.log('valuepoolsFromSg3===================>', onePersonOneVote, res)

          return res
        })
        .flat(),
    )
    console.log('valuepoolsFromSg5===================>')
    return valuepools
  } catch (err) {
    console.log('rerr1=====================>', err)
  }
  return valuepoolsFromSg
}
