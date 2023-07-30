import { firestore } from 'utils/firebase'
import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_LOTTERIES } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
// import { getCollection } from 'state/cancan/helpers'
import { lotteryFields } from './queries'
import { publicClient } from 'utils/wagmi'
import { getLotteryAddress } from 'utils/addressHelpers'
import { lotteryABI } from 'config/abi/lottery'
import { erc20ABI } from 'wagmi'
import { DEFAULT_TFIAT } from 'config/constants/exchange'

export const fetchRampData = async (rampAddress) => {
  return (await firestore.collection('ramps').doc(rampAddress).get()).data()
}

export const fetchSessionInfo = async (sessionId) => {
  return (await firestore.collection('onramp').doc(sessionId).get()).data()
}

export const getLottery = async (lotteryId) => {
  try {
    const res = await request(
      GRAPH_API_LOTTERIES,
      gql`
        query getLottery($lotteryId: Int) 
        {
          lottery(id: $lotteryId) {
            ${lotteryFields}
          }
        }
      `,
      { lotteryId },
    )
    console.log('getLottery=================>', lotteryId, res)
    return res.lottery
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, lotteryId)
    return null
  }
}

export const getLotteries = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_LOTTERIES,
      gql`
        query getLotteries($where: Lottery_filter) 
        {
          lotteries(first: $first, skip: $skip, where: $where) {
            ${lotteryFields}
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getLotteryFromSg33=============>', res)
    return res.lotteries
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const fetchLottery = async (lotteryId) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [viewLottery, tokens] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getLotteryAddress(),
        abi: lotteryABI,
        functionName: 'viewLottery',
        args: [BigInt(lotteryId)],
      },
      {
        address: getLotteryAddress(),
        abi: lotteryABI,
        functionName: 'getAllTokens',
        args: [BigInt(lotteryId), BigInt(0)],
      },
    ],
  })
  const status = viewLottery.result[0]
  const startTime = viewLottery.result[1]
  const endTime = viewLottery.result[2]
  const endAmount = viewLottery.result[3]
  const discountDivisor = viewLottery.result[4]
  const rewardsBreakdown = viewLottery.result[5]
  const countWinnersPerBracket = viewLottery.result[6]
  const firstTicketId = viewLottery.result[7]
  const lockDuration = viewLottery.result[8]
  const finalNumber = viewLottery.result[9]
  const valuepool = viewLottery.result[10]
  const owner = viewLottery.result[11]
  const [priceTicket, fee, useNFTicket, referrerFee] = viewLottery.result[12]

  const _lottery = await getLotteries(0, 0, { id: lotteryId })
  const lottery = _lottery?.length && _lottery[0]
  const tokenData = await Promise.all(
    tokens.result?.map(async (token) => {
      const [name, decimals, symbol, amountCollected] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: token,
            abi: erc20ABI,
            functionName: 'name',
          },
          {
            address: token,
            abi: erc20ABI,
            functionName: 'decimals',
          },
          {
            address: token,
            abi: erc20ABI,
            functionName: 'symbol',
          },
          {
            address: getLotteryAddress(),
            abi: lotteryABI,
            functionName: 'amountCollected',
            args: [BigInt(lotteryId), token],
          },
        ],
      })
      return {
        amountCollected: amountCollected?.toString(),
        token: new Token(
          56,
          token,
          decimals.result,
          symbol?.toString()?.toUpperCase(),
          name?.toString(),
          'https://www.trueusd.com/',
        ),
      }
    }),
  )
  if (tokenData?.length === 0) {
    const [name, decimals, symbol, amountCollected] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: DEFAULT_TFIAT,
          abi: erc20ABI,
          functionName: 'name',
        },
        {
          address: DEFAULT_TFIAT,
          abi: erc20ABI,
          functionName: 'decimals',
        },
        {
          address: DEFAULT_TFIAT,
          abi: erc20ABI,
          functionName: 'symbol',
        },
        {
          address: getLotteryAddress(),
          abi: lotteryABI,
          functionName: 'amountCollected',
          args: [BigInt(lotteryId), DEFAULT_TFIAT],
        },
      ],
    })
    tokenData.push({
      amountCollected: amountCollected.toString(),
      token: new Token(
        56,
        DEFAULT_TFIAT,
        decimals.result,
        symbol?.toString()?.toUpperCase(),
        name?.toString(),
        'https://www.trueusd.com/',
      ),
    })
  }

  // probably do some decimals math before returning info. Maybe get more info. I don't know what it returns.
  return {
    id: lotteryId,
    users: lottery?.users,
    history: lottery?.history,
    status: status === 0 ? 'pending' : status === 1 ? 'open' : status === 2 ? 'close' : 'claimable',
    startTime: startTime.toString(),
    endTime: endTime.toString(),
    endAmount: endAmount.toString(),
    discountDivisor: discountDivisor.toString(),
    rewardsBreakdown: rewardsBreakdown.map((rwb) => rwb.dividedBy(100).toJSON()),
    countWinnersPerBracket: countWinnersPerBracket.map((cwb) => cwb.toString()),
    firstTicketId: firstTicketId.toString(),
    treasuryFee: fee.toString(),
    referrerFee: referrerFee.toString(),
    priceTicket: priceTicket.toString(),
    finalNumber: finalNumber.toString(),
    lockDuration: lockDuration.toString(),
    useNFTicket,
    owner,
    valuepool,
    tokenData,
  }
}

export const fetchLotteries = async ({ fromLottery }) => {
  const _lotteries = await getLotteries(0, 0, {})

  const lotteries = await Promise.all(
    _lotteries
      .map(async (lottery, index) => {
        const data = await fetchLottery(lottery.id)
        const collection = {} // await getCollection(lottery.collectionId)
        return {
          sousId: index,
          ...lottery,
          ...data,
          collection,
        }
      })
      .flat(),
  )
  return lotteries
}
