import { useCallback, useState } from 'react'
import { useAppDispatch } from 'state'
import { useTranslation } from '@pancakeswap/localization'
import { useToast } from '@pancakeswap/uikit'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { useGameFactory } from 'hooks/useContract'
import { useWeb3React } from '@pancakeswap/wagmi'
import { fetchGameAsync } from 'state/games'
import { useRouter } from 'next/router'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'

export const useDepositPottery = (amount: string, tokenId, identityTokenId, collectionAddress: string) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const dispatch = useAppDispatch()
  const { referrer } = useRouter().query
  const { chainId } = useActiveChainId()
  const { toastSuccess, toastError } = useToast()
  const { fetchWithCatchTxError, loading: isPending } = useCatchTxError()
  const { callWithGasPrice } = useCallWithGasPrice()
  const contract = useGameFactory()
  const [pendingFb, setPendingFb] = useState(false)

  const handleDeposit = useCallback(async () => {
    setPendingFb(true)
    // eslint-disable-next-line consistent-return
    const receipt = await fetchWithCatchTxError(async () => {
      const args = [
        collectionAddress,
        account,
        referrer || ADDRESS_ZERO,
        'game',
        tokenId,
        identityTokenId,
        [amount?.toString()],
      ]
      console.log('9handleDeposit=============>', contract, args)
      return callWithGasPrice(contract, 'buyWithContract', args).catch((err) => {
        console.log('err================>', err)
        setPendingFb(false)
        toastError(
          t('Issue buying minutes for this game'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>{err}</ToastDescriptionWithTx>,
        )
      })
    })
    if (receipt?.status) {
      setPendingFb(false)
      toastSuccess(
        t('Success!'),
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your have successfully bought minutes in this game')}
        </ToastDescriptionWithTx>,
      )
      dispatch(fetchGameAsync(collectionAddress, chainId))
    }
  }, [
    fetchWithCatchTxError,
    collectionAddress,
    account,
    referrer,
    tokenId,
    identityTokenId,
    amount,
    contract,
    callWithGasPrice,
    toastError,
    t,
    toastSuccess,
    dispatch,
    chainId,
  ])

  return { isPending: isPending || pendingFb, handleDeposit }
}
