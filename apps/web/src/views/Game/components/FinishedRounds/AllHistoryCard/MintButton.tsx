import { useTranslation } from '@pancakeswap/localization'
import { Button, AutoRenewIcon, useModal } from '@pancakeswap/uikit'
import { useMintObject } from 'views/Game/hooks/useMintObject'
import { PotteryDepositStatus } from 'state/types'
import MintModal from './MintModal'

interface DepositButtonProps {
  status: PotteryDepositStatus
  depositAmount: string
  potteryVaultAddress: string
  setDepositAmount: (value: string) => void
}

const MintButton: React.FC<any> = ({ tokenId, data }) => {
  const { t } = useTranslation()
  const [onMintModal] = useModal(<MintModal tokenId={tokenId} data={data} />)

  return (
    <Button
      mt="10px"
      width="100%"
      // isLoading={isPending}
      // endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={onMintModal}
    >
      {t('Mint Object NOW')}
    </Button>
  )
}

export default MintButton
