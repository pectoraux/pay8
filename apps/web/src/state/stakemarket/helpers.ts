import { Token } from '@pancakeswap/sdk'
import request, { gql } from 'graphql-request'
import { GRAPH_API_STAKES } from 'config/constants/endpoints'
// import { getItemSg } from 'state/cancan/helpers'
import { publicClient } from 'utils/wagmi'
import { getStakeMarketAddress, getStakeMarketNoteAddress } from 'utils/addressHelpers'
import { stakeMarketABI } from 'config/abi/stakeMarket'
import { stakeMarketNoteABI } from 'config/abi/stakeMarketNote'

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
  console.log('stakesFromSg==============>', stakesFromSg)
  const bscClient = publicClient({ chainId: 4002 })
  const stakes = await Promise.all(
    stakesFromSg
      .map(async (stake) => {
        const { id: stakeId } = stake
        const [getStake, nextDuePayable, nextDueReceivable, applications, partnerStakeIds, waitingDuration] =
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
        const ve = getStake.result[0]
        const token = getStake.result[1]
        const tokenId = getStake.result[2]
        const owner = getStake.result[3]
        const startPayable = getStake.result[4][0]
        const startReceivable = getStake.result[4][1]
        const amountPayable = getStake.result[4][2]
        const amountReceivable = getStake.result[4][3]
        const periodPayable = getStake.result[4][4]
        const periodReceivable = getStake.result[4][5]
        const paidPayable = getStake.result[4][6]
        const paidReceivable = getStake.result[4][7]
        const gasPercent = getStake.result[4][8]
        const waitingPeriod = getStake.result[4][9]
        const stakeRequired = getStake.result[4][10]
        const profileId = getStake.result[5]
        const bountyId = getStake.result[6]
        const parentStakeId = getStake.result[7]
        const profileRequired = getStake.result[8]
        const bountyRequired = getStake.result[9]
        const source = getStake.result[10]
        const collection = getStake.result[11]
        const referrer = getStake.result[12]
        const userTokenId = getStake.result[13]
        const identityTokenId = getStake.result[14]
        const options = getStake.result[15]
        const ownerAgreement = getStake.result[16]

        const [status, totalLiquidity] = await bscClient.multicall({
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
          ],
        })
        const item = {} as any // await getItemSg(`${collectionId}-${tokenId}`)
        if (item?.countries || item?.cities || item?.products) {
          // eslint-disable-next-line no-param-reassign
          if (!stake.countries) stake.countries = item?.countries
          // eslint-disable-next-line no-param-reassign
          if (!stake.cities) stake.cities = item?.cities
          // eslint-disable-next-line no-param-reassign
          if (!stake.products) stake.products = item?.products
        }
        const duePayable = nextDuePayable[0].toString()
        const dueReceivable = nextDuePayable[0].toString()

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
          status,
          source,
          collection,
          tokenAddress: token,
          token: new Token(56, token, 18, 'TUSD', 'Binance-Peg TrueUSD Token', 'https://www.trueusd.com/'),
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
          waitingDuration: waitingDuration.toString(),
          profileId: profileId.toString(),
          bountyId: bountyId.toString(),
          profileRequired,
          bountyRequired,
          ownerAgreement,
          applicationsConverted,
          duePayable,
          dueReceivable,
          nextDuePayable: nextDuePayable[1].toString(),
          nextDueReceivable: nextDueReceivable[1].toString(),
          totalLiquidity: totalLiquidity.toString(),
        }
      })
      .flat(),
  )
  return stakes
}
