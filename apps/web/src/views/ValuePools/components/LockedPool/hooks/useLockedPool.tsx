import { useState, useCallback, Dispatch, SetStateAction, useMemo } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { ONE_WEEK_DEFAULT, MAX_TIME } from '@pancakeswap/pools'
import { useAppDispatch } from 'state'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useVaContract } from 'hooks/useContract'
import BigNumber from 'bignumber.js'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'
import { Token } from '@pancakeswap/sdk'
import { VaultKey } from 'state/types'

import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { PrepConfirmArg } from '../types'
import { useCurrPool } from 'state/valuepools/hooks'
import { useWeb3React } from '@pancakeswap/wagmi'
import { vaultPoolConfig } from 'config/constants/pools'

interface HookArgs {
  lockedAmount: BigNumber
  stakingToken: Token
  onDismiss: () => void
  prepConfirmArg: PrepConfirmArg
  defaultDuration?: number
}

interface HookReturn {
  usdValueStaked: number
  duration: number
  setDuration: Dispatch<SetStateAction<number>>
  pendingTx: boolean
  handleConfirmClick: () => Promise<void>
}

export default function useLockedPool(hookArgs: any): any {
  const { pool, lockedAmount, identityTokenId, stakingToken, onDismiss, prepConfirmArg } = hookArgs
  const dispatch = useAppDispatch()
  const currState = useCurrPool()

  const { account } = useWeb3React()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const vaContract = useVaContract(pool?.ve ?? '')
  const { callWithGasPrice } = useCallWithGasPrice()
  const methodName = typeof prepConfirmArg === 'function' ? prepConfirmArg().methodName : 'create_lock_for'
  const checkedState = typeof prepConfirmArg === 'function' ? prepConfirmArg().checkedState : true
  const tokenId = currState[pool?.valuepoolAddress]
  const nft = useMemo(
    () => pool?.userData?.nfts?.find((n) => n.id === currState[pool?.valuepoolAddress]),
    [pool, currState],
  )
  const { t } = useTranslation()
  const { toastSuccess } = useToast()
  const [duration, setDuration] = useState(ONE_WEEK_DEFAULT)
  const usdValueStaked = useBUSDCakeAmount(lockedAmount.toNumber())
  console.log('9vaContract====================>', hookArgs)
  const handleDeposit = useCallback(
    async (convertedStakeAmount: BigNumber, lockDuration: number) => {
      const callOptions = {
        gasLimit: vaultPoolConfig[VaultKey.CakeVault].gasLimit,
      }
      // eslint-disable-next-line consistent-return
      const receipt = await fetchWithCatchTxError(async () => {
        // .toString() being called to fix a BigNumber error in prod
        // as suggested here https://github.com/ChainSafe/web3.js/issues/2077
        const methodArgs =
          methodName === 'create_lock_for'
            ? [convertedStakeAmount.toString(), lockDuration, Number(identityTokenId) ?? 0, account]
            : methodName === 'increase_amount'
            ? [tokenId, convertedStakeAmount.toString()]
            : [tokenId]
        console.log('1useLockedPool==============>', vaContract, methodName, methodArgs)
        return callWithGasPrice(vaContract, methodName, methodArgs, callOptions)
          .then((res) => {
            if (methodName === 'increase_amount') {
              return callWithGasPrice(
                vaContract,
                'increase_unlock_time',
                [tokenId, Math.min(lockDuration + parseInt(nft.lockEnds), MAX_TIME)],
                callOptions,
              )
            }
            return res
          })
          .catch((err) => console.log('useLockedPool==============>', methodName, methodArgs, err))
      })

      if (receipt?.status) {
        toastSuccess(
          t('Lock successfully created!'),
          <ToastDescriptionWithTx txHash={receipt?.transactionHash || ''}>
            {t('Your funds have been staked in the pool')}
          </ToastDescriptionWithTx>,
        )
        // dispatch(fetchValuepoolsUserDataAsync(account))
        onDismiss?.()
      }
    },
    [
      nft,
      fetchWithCatchTxError,
      toastSuccess,
      dispatch,
      onDismiss,
      account,
      vaContract,
      identityTokenId,
      t,
      callWithGasPrice,
      methodName,
      tokenId,
    ],
  )

  const handleConfirmClick = useCallback(async () => {
    const { finalLockedAmount = lockedAmount, finalDuration = checkedState ? duration : 0 } = {}
    // typeof prepConfirmArg === 'function' ? prepConfirmArg({ duration }) : {}

    const convertedStakeAmount: BigNumber = getDecimalAmount(new BigNumber(finalLockedAmount), stakingToken.decimals)

    handleDeposit(convertedStakeAmount, finalDuration)
  }, [checkedState, stakingToken, handleDeposit, duration, lockedAmount])

  return { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick }
}
