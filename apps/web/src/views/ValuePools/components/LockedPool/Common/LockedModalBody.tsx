import { useMemo, useState } from 'react'
import { Button, AutoRenewIcon, Box, Flex } from '@pancakeswap/uikit'
import _noop from 'lodash/noop'
import { useTranslation } from '@pancakeswap/localization'
import { MAX_LOCK_DURATION } from '@pancakeswap/pools'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'

import { ModalValidator } from '../types'
import Overview from './Overview'
import LockDurationField from './LockDurationField'
import useLockedPool from '../hooks/useLockedPool'

const LockedModalBody: React.FC<any> = ({
  pool,
  stakingToken,
  checkedState,
  lockedAmount,
  currentBalance,
  editAmountOnly,
  prepConfirmArg,
  validator,
  customOverview,
  onDismiss,
}) => {
  const { t } = useTranslation()
  const [identityTokenId, setIdentityTokenId] = useState('')
  const { usdValueStaked, duration, setDuration, pendingTx, handleConfirmClick } = useLockedPool({
    pool,
    identityTokenId,
    stakingToken,
    onDismiss,
    lockedAmount,
    prepConfirmArg,
  })

  const { isValidAmount, isValidDuration, isOverMax }: ModalValidator = useMemo(() => {
    return typeof validator === 'function'
      ? validator({
          duration,
        })
      : {
          isValidAmount: lockedAmount?.toNumber() > 0 && getBalanceAmount(currentBalance).gte(lockedAmount),
          isValidDuration: duration > 0 && duration <= MAX_LOCK_DURATION,
          isOverMax: duration > MAX_LOCK_DURATION,
        }
  }, [validator, currentBalance, lockedAmount, duration])

  return (
    <>
      <Box mb="16px">
        {editAmountOnly}
        {checkedState ? (
          <LockDurationField
            identityTokenId={identityTokenId}
            setIdentityTokenId={setIdentityTokenId}
            isOverMax={isOverMax}
            setDuration={setDuration}
            duration={duration}
          />
        ) : null}
      </Box>
      {customOverview ? (
        customOverview({
          isValidDuration,
          duration,
        })
      ) : (
        <Overview
          isValidDuration={isValidDuration}
          openCalculator={_noop}
          stakingToken={stakingToken}
          duration={duration}
          lockedAmount={lockedAmount?.toNumber()}
          usdValueStaked={usdValueStaked}
          showLockWarning
        />
      )}
      <Flex mt="24px">
        <Button
          width="100%"
          isLoading={pendingTx}
          endIcon={pendingTx ? <AutoRenewIcon spin color="currentColor" /> : null}
          onClick={handleConfirmClick}
        >
          {pendingTx ? t('Confirming') : t('Confirm')}
        </Button>
      </Flex>
    </>
  )
}

export default LockedModalBody
