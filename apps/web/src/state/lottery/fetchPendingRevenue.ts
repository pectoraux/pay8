import { getLotteryAddress } from 'utils/addressHelpers'
import { publicClient } from 'utils/wagmi'
import { lotteryABI } from 'config/abi/lottery'

const fetchPendingRevenue = async (lotteryId, account, tokenAddress, referrer) => {
  const bscClient = publicClient({ chainId: 4002 })
  const [pendingReward] = await bscClient.multicall({
    allowFailure: true,
    contracts: [
      {
        address: getLotteryAddress(),
        abi: lotteryABI,
        functionName: 'getPendingReward',
        args: [lotteryId, account, tokenAddress, referrer],
      },
    ],
  })
  console.log('fetchPendingRevenue==========>', pendingReward)
  return pendingReward.result.toString()
}

export default fetchPendingRevenue
