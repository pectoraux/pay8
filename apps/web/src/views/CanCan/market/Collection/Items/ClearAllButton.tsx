import { Button, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useNftStorage } from 'state/nftMarket/storage'
import { useGetNftFilters } from 'state/cancan/hooks'

interface ClearAllButtonProps extends ButtonProps {
  collectionAddress: string
}

const ClearAllButton: React.FC<React.PropsWithChildren<ClearAllButtonProps>> = ({ collectionAddress, ...props }) => {
  const { t } = useTranslation()
  const { updateItemFilters } = useNftStorage()
  const nftFilters = useGetNftFilters(collectionAddress) as any

  const clearAll = () => {
    updateItemFilters({ collectionAddress, nftFilters: {} })
  }

  return (
    <Button key="clear-all" variant="text" scale="sm" onClick={clearAll} {...props}>
      {t('Clear')}
    </Button>
  )
}

export default ClearAllButton
