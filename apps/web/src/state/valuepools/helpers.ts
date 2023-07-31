import BigNumber from 'bignumber.js'
import request, { gql } from 'graphql-request'
import { LEVIATHANS } from 'config/constants/exchange'
import { GRAPH_API_VALUEPOOLS } from 'config/constants/endpoints'
import { BIG_ZERO } from '@pancakeswap/utils/bigNumber'
// import { getItemsSg } from 'state/cancan/helpers'
import { valuePoolABI } from 'config/abi/valuePool'
import { publicClient } from 'utils/wagmi'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { erc20ABI } from 'wagmi'
import { vaABI } from 'config/abi/va'
import { getValuepoolHelperAddress } from 'utils/addressHelpers'
import { valuePoolHelperABI } from 'config/abi/valuePoolHelper'
import { isAddress } from 'utils'
import { getSponsors } from 'state/sponsors/helpers'
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
countries
cities
products
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

export const fetchValuepool = async (valuepoolContract) => {
  try {
    const valuepoolAddress = valuepoolContract.address
    console.log('valuepoolsFromSg26=============>', valuepoolAddress)
    const bscClient = publicClient({ chainId: 4002 })
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
      epoch,
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
          args: [BigInt(0), BigInt(1), false],
        },
        {
          address: valuepoolAddress,
          abi: valuePoolABI,
          functionName: 'epoch',
        },
      ],
    })
    const maxUse = getParams.result[0]
    const queueDuration = getParams.result[1]
    const minReceivable = getParams.result[2]
    const maxDueReceivable = getParams.result[3]
    const maxTreasuryShare = getParams.result[4]
    const lenderFactor = getParams.result[5]
    const minimumSponsorPercentile = getParams.result[6]
    const minIDBadgeColor = getParams.result[7]
    const dataKeeperOnly = getParams.result[8]
    const uniqueAccounts = getParams.result[9]
    const requiredIndentity = getParams.result[10]
    const valueName = getParams.result[11]

    const initialized = _va.result !== ADDRESS_ZERO
    const sponsorAddresses = _sponsorAddresses.result.map((sponsorAddress) => sponsorAddress?.toLowerCase())
    const sponsors = await getSponsors(0, 0, { id_in: sponsorAddresses })
    console.log('valuepoolsFromSg3_=============>', sponsors, sponsorAddresses)
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
    const supply = initialized ? vaParams.result[0] : BIG_ZERO
    console.log('valuepoolsFromSg4=============>', totalLiquidity, supply, vaName, vaDecimals)
    const colors = {
      '3': 'Gold',
      '2': 'Silver',
      '1': 'Brown',
      '0': 'Black',
    }
    // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
    return {
      _va,
      // queue: augmentedQ,
      name,
      symbol,
      vaName,
      sponsors,
      vaSymbol,
      vaDecimals,
      valuepoolAddress,
      tokenAddress,
      initialized,
      supply, // : supply.(10**vaDecimals),
      totalLiquidity: new BigNumber(totalLiquidity.toString())
        .div(10 ** Number(decimals.result))
        .toFixed(Number(decimals.result)),
      devaddr_,
      requiredIndentity,
      valueName,
      riskpool,
      totalpaidBySponsors: totalpaidBySponsors.toString(),
      treasuryShare: new BigNumber(treasuryShare.toString()).div(100).toString(),
      maxWithdrawable: new BigNumber(100).minus(new BigNumber(maxWithdrawable.toString()).div(100)).toJSON(),
      merchantMinIDBadgeColor: colors[new BigNumber(merchantMinIDBadgeColor.toString()).toJSON()],
      merchantValueName,
      maxDueReceivable: maxDueReceivable.toString(),
      queueDuration: queueDuration.toString(),
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

export const fetchValuepools = async ({ fromVesting, fromValuepool }) => {
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
    const bscClient = publicClient({ chainId: 4002 })
    const valuepools = await Promise.all(
      valuepoolsFromSg
        .map(async ({ id, ...rest }, index) => {
          console.log('valuepoolsFromSg1===================>')
          const valuepoolContract = getValuepoolContract(id)
          const data = await fetchValuepool(valuepoolContract)
          console.log('valuepoolsFromSg2===================>', data)
          const [onePersonOneVote] = await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: getValuepoolHelperAddress(),
                abi: valuePoolHelperABI,
                functionName: 'onePersonOneVote',
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