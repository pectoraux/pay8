import { useCallback } from 'react'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { useERC20 } from 'hooks/useContract'
import { Address } from 'viem'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { getProfileHelperAddress } from 'utils/addressHelpers'

const useIfoApprove = () => {
  const raisingTokenContract = useERC20(DEFAULT_TFIAT)
  const { callWithGasPrice } = useCallWithGasPrice()
  const onApprove = useCallback(async () => {
    return callWithGasPrice(raisingTokenContract, 'approve', [getProfileHelperAddress() as Address, MaxUint256])
  }, [raisingTokenContract, callWithGasPrice])

  return onApprove
}

export default useIfoApprove
