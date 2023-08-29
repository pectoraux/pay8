import { Token } from '@pancakeswap/sdk'
import request, { gql } from 'graphql-request'
import { GRAPH_API_STAKES } from 'config/constants/endpoints'
import { getItemSg } from 'state/cancan/helpers'
import { publicClient } from 'utils/wagmi'
import { getStakeMarketAddress, getStakeMarketNoteAddress } from 'utils/addressHelpers'
import { stakeMarketABI } from 'config/abi/stakeMarket'
import { stakeMarketNoteABI } from 'config/abi/stakeMarketNote'
import { erc20ABI } from 'wagmi'

const stakeField = `
id,
stakeSource,
countries,
cities,
products,
terms,
timestamp,
appliedTo {
  id
}
tokenIds {
  id
  metadataUrl
}
`
const transactionFields = `
id
block
timestamp
stake {
  id
}
netPrice
txType
`

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_STAKES,
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

export const getStakes = async (first: number, skip: number, where) => {
  try {
    const res = await request(
      GRAPH_API_STAKES,
      gql`
        query getStakes($first: Int!, $skip: Int!, $where: Stake_filter)
        {
          stakes(first: $first, skip: $skip, where: $where) {
            ${stakeField}
            appliedToPartnerStake {
              ${stakeField}
            }
            transactionHistory{
              ${transactionFields}
            }
          }
        }
      `,
      { first, skip, where },
    )
    console.log('res.stakes=======================>', res.stakes, where)
    return res.stakes
  } catch (err) {
    console.log('err sg================>', err)
  }
  return null
}

export const fetchStakes = async (collectionId) => {
  const whereClause = Number(collectionId)
    ? {
        stakeSource: collectionId,
        active: true,
      }
    : {
        active: true,
      }
  const stakesFromSg = await getStakes(1000, 0, whereClause)
  const bscClient = publicClient({ chainId: 4002 })
  const stakes = await Promise.all(
    stakesFromSg
      .map(async (stake) => {
        const { id: stakeId } = stake
        const [_getStake, nextDuePayable, nextDueReceivable, applications, partnerStakeIds, waitingDuration] =
          await bscClient.multicall({
            allowFailure: true,
            contracts: [
              {
                address: getStakeMarketAddress(),
                abi: stakeMarketABI,
                functionName: 'getStake',
                args: [BigInt(stakeId)],
              },
              {
                address: getStakeMarketNoteAddress(),
                abi: stakeMarketNoteABI,
                functionName: 'getDuePayable',
                args: [BigInt(stakeId), BigInt(0)],
              },
              {
                address: getStakeMarketNoteAddress(),
                abi: stakeMarketNoteABI,
                functionName: 'getDueReceivable',
                args: [BigInt(stakeId), BigInt(0)],
              },
              {
                address: getStakeMarketAddress(),
                abi: stakeMarketABI,
                functionName: 'getAllApplications',
                args: [BigInt(stakeId), BigInt(0)],
              },
              {
                address: getStakeMarketAddress(),
                abi: stakeMarketABI,
                functionName: 'getAllPartners',
                args: [BigInt(stakeId), BigInt(0)],
              },
              {
                address: getStakeMarketAddress(),
                abi: stakeMarketABI,
                functionName: 'waitingPeriodDeadline',
                args: [BigInt(stakeId)],
              },
            ],
          })
        const getStake = _getStake as any
        const ve = getStake.result.ve
        const token = getStake.result.token
        const tokenId = getStake.result.tokenId
        const owner = getStake.result.owner
        const startPayable = getStake.result.bank.startPayable
        const startReceivable = getStake.result.bank.startReceivable
        const amountPayable = getStake.result.bank.amountPayable
        const amountReceivable = getStake.result.bank.amountReceivable
        const periodPayable = getStake.result.bank.periodPayable
        const periodReceivable = getStake.result.bank.periodReceivable
        const paidPayable = getStake.result.bank.paidPayable
        const paidReceivable = getStake.result.bank.paidReceivable
        const gasPercent = getStake.result.bank.gasPercent
        const waitingPeriod = getStake.result.bank.waitingPeriod
        const stakeRequired = getStake.result.bank.stakeRequired
        const profileId = getStake.result.profileId
        const bountyId = getStake.result.bountyId
        const parentStakeId = getStake.result.parentStakeId
        const profileRequired = getStake.result.profileRequired
        const bountyRequired = getStake.result.bountyRequired
        const source = getStake.result.metadata.source
        const collection = getStake.result.metadata.collection
        const referrer = getStake.result.metadata.referrer
        const userTokenId = getStake.result.metadata.userTokenId
        const identityTokenId = getStake.result.metadata.identityTokenId
        const options = getStake.result.metadata.options
        const ownerAgreement = getStake.result.ownerAgreement
        const [status, totalLiquidity, name, symbol, decimals] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getStakeMarketAddress(),
              abi: stakeMarketABI,
              functionName: 'stakeStatus',
              args: [BigInt(parentStakeId)],
            },
            {
              address: getStakeMarketAddress(),
              abi: stakeMarketABI,
              functionName: 'stakesBalances',
              args: [BigInt(parentStakeId)],
            },
            {
              address: token,
              abi: erc20ABI,
              functionName: 'name',
            },
            {
              address: token,
              abi: erc20ABI,
              functionName: 'symbol',
            },
            {
              address: token,
              abi: erc20ABI,
              functionName: 'decimals',
            },
          ],
        })
        const item = await getItemSg(`${collectionId}-${tokenId}`)
        if (item?.countries || item?.cities || item?.products) {
          // eslint-disable-next-line no-param-reassign
          if (!stake.countries) stake.countries = item?.countries
          // eslint-disable-next-line no-param-reassign
          if (!stake.cities) stake.cities = item?.cities
          // eslint-disable-next-line no-param-reassign
          if (!stake.products) stake.products = item?.products
        }
        const duePayable = nextDuePayable.result[0].toString()
        const dueReceivable = nextDueReceivable.result[0].toString()

        const applicationsConverted =
          applications.result?.map((application) => {
            const appId = application.toString()
            return appId
          }) || []

        const partnersConverted = partnerStakeIds.result?.reduce((resultArray, partnerStakeId) => {
          resultArray.push(partnerStakeId.toString())
          return resultArray
        }, [])

        return {
          ...stake,
          sousId: stakeId,
          ve,
          status: status.result?.map((rs) => rs?.toString()),
          source,
          collection,
          tokenAddress: token,
          tokenSymbol: symbol.result,
          tokenName: name.result,
          tokenDecimals: decimals.result,
          tokenId,
          owner,
          referrer,
          options,
          userTokenId: userTokenId.toString(),
          identityTokenId: identityTokenId.toString(),
          partnerStakeIds: partnersConverted,
          parentStakeId: parentStakeId.toString(),
          startPayable: startPayable.toString(),
          startReceivable: startReceivable.toString(),
          amountPayable: amountPayable.toString(),
          amountReceivable: amountReceivable.toString(),
          periodPayable: periodPayable.toString(),
          periodReceivable: periodReceivable.toString(),
          paidPayable: paidPayable.toString(),
          paidReceivable: paidReceivable.toString(),
          gasPercent: gasPercent.toString(),
          waitingPeriod: waitingPeriod.toString(),
          stakeRequired: stakeRequired.toString(),
          waitingDuration: waitingDuration.result.toString(),
          profileId: profileId.toString(),
          bountyId: bountyId.toString(),
          profileRequired,
          bountyRequired,
          ownerAgreement,
          applicationsConverted,
          duePayable,
          dueReceivable,
          nextDuePayable: nextDuePayable.result[1].toString(),
          nextDueReceivable: nextDueReceivable.result[1].toString(),
          totalLiquidity: totalLiquidity.result.toString(),
        }
      })
      .flat(),
  )
  return stakes
}
