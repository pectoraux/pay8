import { useTranslation } from '@pancakeswap/localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useDepositPottery } from 'views/Game/hooks/useDepositPottery'
import { PotteryDepositStatus } from 'state/types'

interface DepositButtonProps {
  status: PotteryDepositStatus
  depositAmount: string
  potteryVaultAddress: string
  setDepositAmount: (value: string) => void
}

const DepositButton: React.FC<any> = ({ tokenId, numMinutes, identityTokenId, collectionAddress }) => {
  const { t } = useTranslation()
  const { isPending, handleDeposit } = useDepositPottery(numMinutes, tokenId, identityTokenId, collectionAddress)

  // const onClickDeposit = useCallback(async () => {
  //   await handleDeposit()
  //   setDepositAmount('')
  //   setIdentityTokenId('')
  //   setNumMinutes('')
  // }, [handleDeposit, setNumMinutes, setDepositAmount, setIdentityTokenId])

  return (
    <Button
      mt="10px"
      width="100%"
      isLoading={isPending}
      // disabled={status !== PotteryDepositStatus.BEFORE_LOCK || depositAmountAsBN.lte(0) || depositAmountAsBN.isNaN()}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleDeposit}
    >
      {t('Buy NOW')}
    </Button>
  )
}

export default DepositButton
