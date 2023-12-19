import { useState, useCallback, Dispatch, SetStateAction } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { useSWRConfig } from 'swr'
import { useTranslation } from '@pancakeswap/localization'
import { ONE_WEEK_DEFAULT } from '@pancakeswap/pools'
import { useBUSDCakeAmount } from 'hooks/useBUSDPrice'
import { useWILLContract } from 'hooks/useContract'
import BigNumber from 'bignumber.js'
import { getDecimalAmount } from '@pancakeswap/utils/formatBalance'
import { useToast } from '@pancakeswap/uikit'
import useCatchTxError from 'hooks/useCatchTxError'

import { Token } from '@pancakeswap/sdk'
import { vaultPoolConfig } from 'config/constants/pools'
import { VaultKey } from 'state/types'

import { ToastDescriptionWithTx } from 'components/Toast'
import { useCallWithGasPrice } from 'hooks/useCallWithGasPrice'
import { PrepConfirmArg } from '../types'

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
  const {
    pool,
    state,
    lockedAmount,
    stakingToken,
    onDismiss,
    prepConfirmArg,
    defaultDuration = ONE_WEEK_DEFAULT,
  } = hookArgs
  const router = useRouter()
  const { address: account } = useAccount()
  const { fetchWithCatchTxError, loading: pendingTx } = useCatchTxError()
  const willContract = useWILLContract(pool?.id || router.query.will || '')
  const { callWithGasPrice } = useCallWithGasPrice()

  const { t } = useTranslation()
  const { mutate } = useSWRConfig()
  const { toastSuccess } = useToast()
  const [duration, setDuration] = useState(() => defaultDuration)
  const usdValueStaked = useBUSDCakeAmount(lockedAmount.toNumber())

  const handleDeposit = useCallback(
    async (convertedStakeAmount: BigNumber, lockDuration: number) => {
      const callOptions = {
        gas: vaultPoolConfig[VaultKey.CakeVault].gasLimit,
      }

      const receipt = await fetchWithCatchTxError(() => {
        const methodArgs = [
          state.token,
          state.ve,
          BigInt(lockDuration),
          state.identityTokenId,
          BigInt(convertedStakeAmount.toString()),
        ] as const
        console.log('createLock============>', willContract, methodArgs)
        return callWithGasPrice(willContract, 'createLock', methodArgs, callOptions)
      })

      if (receipt?.status) {
        toastSuccess(
          t('Staked!'),
          <ToastDescriptionWithTx txHash={receipt.transactionHash}>
            {t('Your funds have been staked in the pool')}
          </ToastDescriptionWithTx>,
        )
        onDismiss?.()
        // dispatch(fetchCakeVaultUserData({ account, chainId }))
        mutate(['userCakeLockStatus', account])
      }
    },
    [fetchWithCatchTxError, state, toastSuccess, onDismiss, account, willContract, t, callWithGasPrice, mutate],
  )

  const handleConfirmClick = useCallback(async () => {
    const { finalLockedAmount = lockedAmount, finalDuration = duration } =
      typeof prepConfirmArg === 'function' ? prepConfirmArg({ duration }) : {}

    const convertedStakeAmount: BigNumber = getDecimalAmount(new BigNumber(finalLockedAmount), stakingToken.decimals)

    handleDeposit(convertedStakeAmount, finalDuration)
  }, [prepConfirmArg, stakingToken, handleDeposit, duration, lockedAmount])

  return { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick }
}
