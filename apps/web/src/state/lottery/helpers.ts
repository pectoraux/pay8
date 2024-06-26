import { LotteryStatus, LotteryTicket } from 'config/constants/types'
import { lotteryV2ABI } from 'config/abi/lotteryV2'
import { getLotteryAddress, getLotteryHelperAddress, getLotteryV2Address } from 'utils/addressHelpers'
import { LotteryResponse } from 'state/types'
import { getLotteryV2Contract } from 'utils/contractHelpers'
import { bigIntToSerializedBigNumber } from '@pancakeswap/utils/bigNumber'
import { NUM_ROUNDS_TO_FETCH_FROM_NODES } from 'config/constants/lottery'
import { publicClient } from 'utils/wagmi'
import { ChainId, Token } from '@pancakeswap/sdk'
import { ContractFunctionResult } from 'viem'
import { lotteryABI } from 'config/abi/lottery'
import { lotteryHelperABI } from 'config/abi/lotteryHelper'
import { erc20ABI } from 'wagmi'

const lotteryContract = getLotteryV2Contract()

const processViewLotterySuccessResponse = (
  response: ContractFunctionResult<typeof lotteryV2ABI, 'viewLottery'>,
  lotteryId: string,
): LotteryResponse => {
  const {
    status,
    startTime,
    endTime,
    priceTicketInCake,
    discountDivisor,
    treasuryFee,
    firstTicketId,
    amountCollectedInCake,
    finalNumber,
    cakePerBracket,
    countWinnersPerBracket,
    rewardsBreakdown,
  } = response

  const statusKey = Object.keys(LotteryStatus)[status]
  const serializedCakePerBracket = cakePerBracket.map((cakeInBracket) => bigIntToSerializedBigNumber(cakeInBracket))
  const serializedCountWinnersPerBracket = countWinnersPerBracket.map((winnersInBracket) =>
    bigIntToSerializedBigNumber(winnersInBracket),
  )
  const serializedRewardsBreakdown = rewardsBreakdown.map((reward) => bigIntToSerializedBigNumber(reward))

  return {
    isLoading: false,
    lotteryId,
    status: LotteryStatus[statusKey],
    startTime: startTime?.toString(),
    endTime: endTime?.toString(),
    priceTicketInCake: bigIntToSerializedBigNumber(priceTicketInCake),
    discountDivisor: discountDivisor?.toString(),
    treasuryFee: treasuryFee?.toString(),
    firstTicketId: firstTicketId?.toString(),
    amountCollectedInCake: bigIntToSerializedBigNumber(amountCollectedInCake),
    finalNumber,
    cakePerBracket: serializedCakePerBracket,
    countWinnersPerBracket: serializedCountWinnersPerBracket,
    rewardsBreakdown: serializedRewardsBreakdown,
  }
}

const processViewLotteryErrorResponse = (lotteryId: string): LotteryResponse => {
  return {
    isLoading: true,
    lotteryId,
    status: LotteryStatus.PENDING,
    startTime: '',
    endTime: '',
    priceTicketInCake: '',
    discountDivisor: '',
    treasuryFee: '',
    firstTicketId: '',
    amountCollectedInCake: '',
    finalNumber: null,
    cakePerBracket: [],
    countWinnersPerBracket: [],
    rewardsBreakdown: [],
  }
}

export const fetchLottery = async (lotteryId: string): Promise<LotteryResponse> => {
  try {
    const lotteryData = await lotteryContract.read.viewLottery([BigInt(lotteryId)])
    return processViewLotterySuccessResponse(lotteryData, lotteryId)
  } catch (error) {
    return processViewLotteryErrorResponse(lotteryId)
  }
}

export const fetchMultipleLotteries = async (lotteryIds: string[]): Promise<LotteryResponse[]> => {
  const calls = lotteryIds.map(
    (id) =>
      ({
        abi: lotteryV2ABI,
        functionName: 'viewLottery',
        address: getLotteryV2Address(),
        args: [BigInt(id)],
      } as const),
  )
  try {
    const client = publicClient({ chainId: ChainId.BSC })
    const multicallRes = await client.multicall({
      contracts: calls,
    })
    const processedResponses = multicallRes.map((res, index) =>
      processViewLotterySuccessResponse(res.result, lotteryIds[index]),
    )
    return processedResponses
  } catch (error) {
    console.error(error)
    return calls.map((call, index) => processViewLotteryErrorResponse(lotteryIds[index]))
  }
}

export const fetchCurrentLotteryId = async (): Promise<bigint> => {
  return lotteryContract.read.currentLotteryId()
}

export const fetchCurrentLotteryIdAndMaxBuy = async () => {
  try {
    const calls = (['currentLotteryId', 'maxNumberTicketsPerBuyOrClaim'] as const).map(
      (method) =>
        ({
          abi: lotteryV2ABI,
          address: getLotteryV2Address(),
          functionName: method,
        } as const),
    )

    const client = publicClient({ chainId: ChainId.BSC })
    const [currentLotteryId, maxNumberTicketsPerBuyOrClaim] = await client.multicall({
      contracts: calls,
      allowFailure: false,
    })

    return {
      currentLotteryId: currentLotteryId ? currentLotteryId.toString() : null,
      maxNumberTicketsPerBuyOrClaim: maxNumberTicketsPerBuyOrClaim ? maxNumberTicketsPerBuyOrClaim.toString() : null,
    }
  } catch (error) {
    return {
      currentLotteryId: null,
      maxNumberTicketsPerBuyOrClaim: null,
    }
  }
}

export const getRoundIdsArray = (currentLotteryId: string): string[] => {
  const currentIdAsInt = parseInt(currentLotteryId, 10)
  const roundIds = []
  for (let i = 0; i < NUM_ROUNDS_TO_FETCH_FROM_NODES; i++) {
    if (currentIdAsInt - i > 0) {
      roundIds.push(currentIdAsInt - i)
    }
  }
  return roundIds.map((roundId) => roundId?.toString())
}

export const hasRoundBeenClaimed = (tickets: LotteryTicket[]): boolean => {
  const claimedTickets = tickets.filter((ticket) => ticket.status)
  return claimedTickets.length > 0
}

export const getPendingReward = async (lotteryId, userAddress, tokenAddress, referrer, chainId) => {
  const bscClient = publicClient({ chainId })
  const [pendingReward] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getLotteryAddress(),
        abi: lotteryABI,
        functionName: 'getPendingReward',
        args: [lotteryId, userAddress, tokenAddress, referrer],
      },
    ],
  })
  console.log('getPendingReward=================>', lotteryId, userAddress, tokenAddress, referrer, pendingReward)
  return pendingReward.result.toString()
}

export const getTokenForCredit = async (collectionAddress, chainId = 4002) => {
  const bscClient = publicClient({ chainId })
  try {
    const [arrLength] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getLotteryHelperAddress(),
          abi: lotteryHelperABI,
          functionName: 'burnTokenForCreditLength',
          args: [collectionAddress],
        },
      ],
    })
    const arr = Array.from({ length: Number(arrLength.result) }, (v, i) => i)
    const credits = await Promise.all(
      arr?.map(async (idx) => {
        const [burnTokenForCredit] = await bscClient.multicall({
          allowFailure: true,
          contracts: [
            {
              address: getLotteryHelperAddress(),
              abi: lotteryHelperABI,
              functionName: 'burnTokenForCredit',
              args: [collectionAddress, BigInt(idx)],
            },
          ],
        })
        const _token = burnTokenForCredit.result[0]
        const checker = burnTokenForCredit.result[1]
        const destination = burnTokenForCredit.result[2]
        const discount = burnTokenForCredit.result[3]
        const collectionId = burnTokenForCredit.result[4]
        const item = burnTokenForCredit.result[5]

        const [name, symbol] = await bscClient.multicall({
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
            // {
            //   address: _token,
            //   abi: erc20ABI,
            //   functionName: 'decimals',
            // },
          ],
        })
        const decimals = 18
        // if (checker !== ADDRESS_ZERO) {
        //   const [_decimals] = await bscClient.multicall({
        //     allowFailure: true,
        //     contracts: [
        //       {
        //         address: _token,
        //         abi: erc20ABI,
        //         functionName: 'decimals',
        //       },
        //     ],
        //   })
        //   decimals = _decimals.result
        // }
        return {
          checker,
          destination,
          discount: discount.toString(),
          collectionId: collectionId.toString(),
          item,
          token: new Token(
            chainId,
            _token,
            decimals,
            symbol.result?.toString()?.toUpperCase(),
            name.result?.toString(),
            `https://tokens.payswap.org/images/${_token}.png`,
          ),
        }
      }),
    )
    console.log('arrLength=============>', arrLength, arr, credits)

    return credits
  } catch (error) {
    console.error('===========>Failed to fetch credits tokens', error)
    return []
  }
}

export const getPaymentCredits = async (lotteryId, userAddress, chainId = 4002) => {
  try {
    const bscClient = publicClient({ chainId })
    const [credits] = await bscClient.multicall({
      allowFailure: true,
      contracts: [
        {
          address: getLotteryHelperAddress(),
          abi: lotteryHelperABI,
          functionName: 'paymentCredits',
          args: [userAddress, lotteryId],
        },
      ],
    })
    return credits.result.toString()
  } catch (error) {
    console.error('===========>Failed to fetch payment credits', error)
    return []
  }
}
