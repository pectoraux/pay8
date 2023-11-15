import { useCallback } from 'react'
import { useAccount } from 'wagmi'
import { MaxUint256 } from '@pancakeswap/swap-sdk-core'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { useERC20, useVaultPoolContract } from 'hooks/useContract'
import { useToast } from '@pancakeswap/uikit'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useCakeApprove from 'hooks/useCakeApprove'
import useCakeApprovalStatus from 'hooks/useCakeApprovalStatus'

export const useApprovePool = (
  lpContract: ReturnType<typeof useERC20>,
  address,
  earningTokenSymbol,
  onSuccess = null,
) => {
  const { toastSuccess } = useToast()
  const { chainId } = useActiveChainId()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const { address: account } = useAccount()

  const handleApprove = useCallback(async () => {
    const receipt = await fetchWithCatchTxError(() => {
      return callWithGasPrice(lpContract, 'approve', [address, MaxUint256])
    })
    if (receipt?.status) {
      toastSuccess(
        t('Contract Enabled'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('You have successfully enabled the contract to spend your %symbol%', { symbol: earningTokenSymbol })}
        </ToastDescriptionWithTx>,
      )
      onSuccess?.()
    }
  }, [
    chainId,
    account,
    dispatch,
    onSuccess,
    lpContract,
    address,
    earningTokenSymbol,
    t,
    toastSuccess,
    callWithGasPrice,
    fetchWithCatchTxError,
  ])

  return { handleApprove, pendingTx }
}

// Approve CAKE auto pool
export const useVaultApprove = (vaultKey: any, setLastUpdated: () => void) => {
  const vaultPoolContract = useVaultPoolContract(vaultKey)
  const { t } = useTranslation()

  return useCakeApprove(
    setLastUpdated,
    vaultPoolContract?.address,
    t('You can now stake in the %symbol% vault!', { symbol: 'CAKE' }),
  )
}

export const useCheckVaultApprovalStatus = (vaultKey: any) => {
  const vaultPoolContract = useVaultPoolContract(vaultKey)

  return useCakeApprovalStatus(vaultPoolContract?.address)
}
