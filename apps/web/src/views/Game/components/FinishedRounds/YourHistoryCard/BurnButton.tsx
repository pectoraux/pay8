import { useTranslation } from '@pancakeswap/localization'
import { Button, AutoRenewIcon, useModal } from '@pancakeswap/uikit'
import { useBurnObject } from 'views/Game/hooks/useBurnObject'
import { PotteryDepositStatus } from 'state/types'
import BurnModal from './BurnModal'

interface DepositButtonProps {
  status: PotteryDepositStatus
  depositAmount: string
  potteryVaultAddress: string
  setDepositAmount: (value: string) => void
}

const BurnButton: React.FC<any> = ({ data, tokenId }) => {
  const { t } = useTranslation()
  const [onBurnModal] = useModal(<BurnModal tokenId={tokenId} data={data} />)

  return (
    <Button
      mt="10px"
      width="100%"
      variant="danger"
      // isLoading={isPending}
      // endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={onBurnModal}
    >
      {t('Burn Object')}
    </Button>
  )
}

export default BurnButton
