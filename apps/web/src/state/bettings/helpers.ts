import { Token } from '@pancakeswap/sdk'
import { GRAPH_API_BETTINGS } from 'config/constants/endpoints'
import request, { gql } from 'graphql-request'
import { getCollection } from 'state/cancan/helpers'
import { bettingFields } from './queries'
import { publicClient } from 'utils/wagmi'
import { bettingABI } from 'config/abi/betting'
import { erc20ABI } from 'wagmi'

export const getTag = async () => {
  try {
    const res = await request(
      GRAPH_API_BETTINGS,
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

export const getBetting = async (bettingAddress) => {
  try {
    const res = await request(
      GRAPH_API_BETTINGS,
      gql`
        query getBetting($bettingAddress: String) 
        {
          betting(id: $bettingAddress) {
            ${bettingFields}
          }
        }
      `,
      { bettingAddress },
    )
    const bettingEvents = res.betting?.bettingEvents?.map((be) => {
      const currPeriod = parseInt(
        ((Date.now() / 1000 - Number(be.startTime || 0)) / Number(be.bracketDuration || 0)).toString(),
      )
      const currStart = parseInt(be.startTime || 0) + currPeriod * parseInt(be.bracketDuration || 0)
      const currEnd = currStart + parseInt(be.bracketDuration)
      return {
        ...be,
        currStart,
        currEnd,
        currPeriod,
        rewardsBreakdown: be.rewardsBreakdown?.map((rwb) => parseInt(rwb) / 100),
        rewardsBreakdownBc: be.rewardsBreakdown?.map((rwb) => parseInt(rwb) / 100),
      }
    })
    return {
      ...res.betting,
      bettingEvents,
    }
  } catch (error) {
    console.error('Failed to fetch protocol=============>', error, bettingAddress)
    return null
  }
}

export const getBettings = async (first = 5, skip = 0, where) => {
  try {
    const res = await request(
      GRAPH_API_BETTINGS,
      gql`
        query getBettings($where: Betting_filter) 
        {
          bettings(first: $first, skip: $skip, where: $where) {
            ${bettingFields}
          }
        }
      `,
      { first, skip, where },
    )
    console.log('getBettingsFromSg33=============>', res)
    return res.bettings
  } catch (error) {
    console.error('Failed to fetch protocol=============>', where, error)
    return null
  }
}

export const getAmountCollected = async (bettingAddress, bettingId, period) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [amountCollected] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: bettingAddress,
        abi: bettingABI,
        functionName: 'amountCollected',
        args: [BigInt(bettingId), BigInt(period)],
      },
    ],
  })
  return amountCollected.result.toString()
}

export const getSubjects = async (bettingAddress, bettingId) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [subjects] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: bettingAddress,
        abi: bettingABI,
        functionName: 'subjects',
        args: [BigInt(bettingId)],
      },
    ],
  })
  return subjects.result
}

export const getCountWinnersPerBracket = async (bettingAddress, bettingId, period, idx) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [count] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: bettingAddress,
        abi: bettingABI,
        functionName: 'countWinnersPerBracket',
        args: [BigInt(bettingId), BigInt(period), BigInt(idx)],
      },
    ],
  })
  return count.result
}

export const fetchBetting = async (bettingAddress) => {
  const bettingFromSg = await getBetting(bettingAddress)
  const bscClient = publicClient({ chainId: 4002 })
  const [devaddr_, collectionId, oracle] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: bettingAddress,
        abi: bettingABI,
        functionName: 'devaddr_',
      },
      {
        address: bettingAddress,
        abi: bettingABI,
        functionName: 'collectionId',
      },
      {
        address: bettingAddress,
        abi: bettingABI,
        functionName: 'oracle',
      },
    ],
  })
  const collection = await getCollection(collectionId.result.toString())
  const bettingEvents = await Promise.all(
    bettingFromSg?.bettingEvents?.map(async (bettingEvent) => {
      const [protocolInfo, ticketSize] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: bettingAddress,
            abi: bettingABI,
            functionName: 'protocolInfo',
            args: [BigInt(bettingEvent.bettingId)],
          },
          {
            address: bettingAddress,
            abi: bettingABI,
            functionName: 'ticketSizes',
            args: [BigInt(bettingEvent.bettingId)],
          },
        ],
      })
      const _token = protocolInfo.result[0]
      const action = protocolInfo.result[1]
      const alphabetEncoding = protocolInfo.result[2]
      const startTime = protocolInfo.result[3]
      const numberOfPeriods = protocolInfo.result[4]
      const nextToClose = protocolInfo.result[5]
      const adminShare = protocolInfo.result[6]
      const referrerShare = protocolInfo.result[7]
      const bracketDuration = protocolInfo.result[8]
      const pricePerTicket = protocolInfo.result[9]
      const discountDivisor = protocolInfo.result[10]
      const newTicketRange = protocolInfo.result[11]
      const newMinTicketNumber = protocolInfo.result[12]

      const [name, symbol, decimals] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
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
        ],
      })

      return {
        id: bettingAddress,
        ...bettingEvent,
        alphabetEncoding,
        ticketSize: ticketSize.result.toString(),
        startTime: startTime.toString(),
        nextToClose: nextToClose.toString(),
        adminShare: adminShare.toString(),
        numberOfPeriods: numberOfPeriods.toString(),
        referrerShare: referrerShare.toString(),
        bracketDuration: bracketDuration.toString(),
        pricePerTicket: pricePerTicket.toString(),
        discountDivisor: discountDivisor.toString(),
        newTicketRange: newTicketRange.toString(),
        newMinTicketNumber: newMinTicketNumber.toString(),
        token: new Token(
          56,
          _token,
          decimals.result,
          symbol.result?.toString(),
          name.result?.toString(),
          'https://www.trueusd.com/',
        ),
      }
    }),
  )
  return {
    ...bettingFromSg,
    collection,
    devaddr_: devaddr_.result,
    collectionId: collectionId.result.toString(),
    bettingEvents,
    oracle: oracle.result,
  }
}

export const fetchBettings = async ({ fromBetting }) => {
  const bettingsFromSg = await getBettings(0, 0, {})
  const bettings = await Promise.all(
    bettingsFromSg
      .filter((betting) => (fromBetting ? betting?.id === fromBetting : true))
      .map(async (betting, index) => {
        const data = await fetchBetting(betting.id)
        return {
          sousId: index,
          ...data,
        }
      })
      .flat(),
  )
  return bettings
}

export const getCalculateRewardsForTicketId = async (bettingAddress, bettingId, ticketId, bracketNumber) => {
  const arr = Array.from({ length: Number(bracketNumber) }, (v, i) => i)
  const bscClient = publicClient({ chainId: 4002 })
  const rewards = await Promise.all(
    arr.map(async (bracket) => {
      const [reward] = await bscClient.multicall({
        allowFailure: true,
        contracts: [
          {
            address: bettingAddress,
            abi: bettingABI,
            functionName: 'calculateRewardsForTicketId',
            args: [bettingId, ticketId, BigInt(bracket)],
          },
        ],
      })
      return reward.result || '0'
    }),
  )
  return rewards
}
