import { useTranslation } from '@pancakeswap/localization'
import { Button, AutoRenewIcon } from '@pancakeswap/uikit'
import { useMintObject } from 'views/Game/hooks/useMintObject'
import { PotteryDepositStatus } from 'state/types'

interface DepositButtonProps {
  status: PotteryDepositStatus
  depositAmount: string
  potteryVaultAddress: string
  setDepositAmount: (value: string) => void
}

const MintButton: React.FC<any> = ({ objectName, tokenId, tokenIds }) => {
  const { t } = useTranslation()
  const { isPending, handleMintObject } = useMintObject(objectName, tokenId, tokenIds)

  return (
    <Button
      mt="10px"
      width="100%"
      isLoading={isPending}
      endIcon={isPending ? <AutoRenewIcon spin color="currentColor" /> : null}
      onClick={handleMintObject}
    >
      {t('Mint Object NOW')}
    </Button>
  )
}

export default MintButton
