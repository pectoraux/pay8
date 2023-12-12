import request, { gql } from 'graphql-request'
import { GRAPH_API_STAKES } from 'config/constants/endpoints'
import { getItemSg } from 'state/cancan/helpers'
import { publicClient } from 'utils/wagmi'
import { getStakeMarketAddress, getStakeMarketHeperAddress, getStakeMarketNoteAddress } from 'utils/addressHelpers'
import { stakeMarketABI } from 'config/abi/stakeMarket'
import { stakeMarketNoteABI } from 'config/abi/stakeMarketNote'
import { erc20ABI } from 'wagmi'
import { stakeMarketHelperABI } from 'config/abi/stakeMarketHelper'

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

export const getStakeApplication = async (stakeId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [application] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getStakeMarketAddress(),
        abi: stakeMarketABI,
        functionName: 'stakesApplication',
        args: [stakeId],
      },
    ],
  })
  return {
    status: application.result[0],
    stakeId: application.result[1],
    deadline: application.result[2],
  }
}

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

export const getNote = async (tokenId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [note] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getStakeMarketAddress(),
        abi: stakeMarketABI,
        functionName: 'notes',
        args: [BigInt(tokenId)],
      },
    ],
  })
  return note.result
}

export const getStake = async (stakeId, chainId) => {
  const bscClient = publicClient({ chainId })
  const [stake] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getStakeMarketAddress(),
        abi: stakeMarketABI,
        functionName: 'getStake',
        args: [BigInt(stakeId)],
      },
    ],
  })
  return stake.result
}

export const fetchStakes = async (collectionId, chainId) => {
  const whereClause = Number(collectionId)
    ? {
        stakeSource: collectionId,
        active: true,
      }
    : {
        active: true,
      }
  const stakesFromSg = await getStakes(1000, 0, whereClause)
  const bscClient = publicClient({ chainId })
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
        const __getStake = _getStake as any
        const ve = __getStake.result.ve
        const token = __getStake.result.token
        const tokenId = __getStake.result.tokenId
        const owner = __getStake.result.owner
        const startPayable = __getStake.result.bank.startPayable
        const startReceivable = __getStake.result.bank.startReceivable
        const amountPayable = __getStake.result.bank.amountPayable
        const amountReceivable = __getStake.result.bank.amountReceivable
        const periodPayable = __getStake.result.bank.periodPayable
        const periodReceivable = __getStake.result.bank.periodReceivable
        const paidPayable = __getStake.result.bank.paidPayable
        const paidReceivable = __getStake.result.bank.paidReceivable
        const gasPercent = __getStake.result.bank.gasPercent
        const waitingPeriod = __getStake.result.bank.waitingPeriod
        const stakeRequired = __getStake.result.bank.stakeRequired
        const profileId = __getStake.result.profileId
        const bountyId = __getStake.result.bountyId
        const parentStakeId = __getStake.result.parentStakeId
        const profileRequired = __getStake.result.profileRequired
        const bountyRequired = __getStake.result.bountyRequired
        const source = __getStake.result.metadata.source
        const collection = __getStake.result.metadata.collection
        const referrer = __getStake.result.metadata.referrer
        const userTokenId = __getStake.result.metadata.userTokenId
        const identityTokenId = __getStake.result.metadata.identityTokenId
        const options = __getStake.result.metadata.options
        const ownerAgreement = __getStake.result.ownerAgreement
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
        const duePayable = nextDuePayable.result?.length ? nextDuePayable.result[0].toString() : '0'
        const dueReceivable = nextDueReceivable.result?.length ? nextDueReceivable.result[0].toString() : '0'
        console.log('nextDuePayable==================>', nextDuePayable, duePayable)
        const applicationsConverted =
          applications.result?.map((application) => {
            const appId = application.toString()
            return appId
          }) || []

        const partnersConverted = partnerStakeIds.result?.reduce((resultArray, partnerStakeId) => {
          resultArray.push(partnerStakeId.toString())
          return resultArray
        }, [])
        console.log('stakestake=================>', stake)
        const payableNotes = await Promise.all(
          stake?.tokenIds?.map(async (note) => {
            const [_owner, metadatUrl] = await bscClient.multicall({
              allowFailure: true,
              contracts: [
                {
                  address: getStakeMarketHeperAddress(),
                  abi: stakeMarketHelperABI,
                  functionName: 'ownerOf',
                  args: [BigInt(note?.id)],
                },
                {
                  address: getStakeMarketHeperAddress(),
                  abi: stakeMarketHelperABI,
                  functionName: 'tokenURI',
                  args: [BigInt(note?.id)],
                },
              ],
            })
            return {
              ...note,
              metadataUrl: metadatUrl.result,
              owner: _owner.result,
            }
          }),
        )
        return {
          ...stake,
          payableNotes,
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
          nextDuePayable: nextDuePayable.result?.length > 1 ? nextDuePayable.result[1].toString() : null,
          nextDueReceivable: nextDueReceivable.result?.length > 1 ? nextDueReceivable.result[1].toString() : null,
          totalLiquidity: totalLiquidity.result.toString(),
        }
      })
      .flat(),
  )
  return stakes
}
