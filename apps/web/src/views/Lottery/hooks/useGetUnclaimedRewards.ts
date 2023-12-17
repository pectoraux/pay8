import { useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useLottery } from 'state/lottery/hooks'
import fetchPendingRevenue from 'state/lottery/fetchPendingRevenue'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { FetchStatus } from 'config/constants/types'
import { useActiveChainId } from 'hooks/useActiveChainId'

const useGetUnclaimedRewards = ({ currentTokenId, isNFT, prizeAddress, activeIndex }) => {
  const { account } = useWeb3React()
  const {
    lotteryData: { id: currentLotteryId, tokenData },
  } = useLottery()
  const { chainId } = useActiveChainId()
  const [unclaimedRewards, setUnclaimedRewards] = useState([])
  const [fetchStatus, setFetchStatus] = useState<any>(FetchStatus.Idle)
  const currTokenData = useMemo(
    () => (tokenData?.length ? tokenData[parseInt(currentTokenId) > 0 ? parseInt(currentTokenId) : 0] : {}),
    [currentTokenId, tokenData],
  )
  // const {
  //   data,
  //   status: fetchStatus,
  //   refetch,
  // } = useGetPendingReward(account, currentLotteryId, currTokenData?.token?.address, !!activeIndex)

  console.log(
    'useGetUnclaimedRewards=============>',
    currentTokenId,
    activeIndex,
    currentLotteryId,
    tokenData,
    currTokenData,
  )

  useEffect(() => {
    // Reset on account change and round transition
    setFetchStatus(FetchStatus.Idle)
  }, [account])

  const fetchAllRewards = async () => {
    try {
      setFetchStatus(FetchStatus.Fetching)
      const pendingRevenue = (await fetchPendingRevenue(
        currentLotteryId,
        account,
        parseInt(isNFT) ? prizeAddress : currTokenData?.token?.address,
        parseInt(isNFT) ? false : !!activeIndex,
        chainId,
      )) as any
      setUnclaimedRewards([getBalanceNumber(new BigNumber(pendingRevenue), currTokenData?.token?.decimals)])
      setFetchStatus(FetchStatus.Fetched)
    } catch (err) {
      console.log('fetchPendingRevenue===========>', err)
    }
  }

  return { fetchAllRewards, unclaimedRewards, fetchStatus }
}

export default useGetUnclaimedRewards
