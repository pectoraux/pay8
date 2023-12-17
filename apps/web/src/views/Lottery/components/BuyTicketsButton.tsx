import { Button, useModal, WaitIcon, ButtonProps } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useLottery } from 'state/lottery/hooks'
import { useTheme } from 'styled-components'
import { LotteryStatus } from 'config/constants/types'
import BuyTicketsModal from './BuyTicketsModal/BuyTicketsModal'
import ClaimTicketModal from './ClaimTicketModal'

interface BuyTicketsButtonProps extends ButtonProps {
  disabled?: boolean
  themeMode?: string
}

const BuyTicketsButton: React.FC<any> = ({ currentTokenId, currTokenData, disabled, themeMode, ...props }) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketsModal currentTokenId={currentTokenId} disabled={disabled} />)
  const {
    lotteryData: { status, id: lotteryId, users },
  } = useLottery()

  const [onClaimTicketModal] = useModal(
    <ClaimTicketModal currTokenData={currTokenData} lotteryId={lotteryId} users={users} />,
  )

  const getBuyButtonText = () => {
    if (status === LotteryStatus.OPEN) {
      return t('Buy Tickets')
    }
    return t('Claim Tickets!')
  }

  const themeStr = themeMode ?? (isDark ? 'dark' : 'light')

  return (
    <Button
      data-theme={themeStr}
      {...props}
      onClick={status === LotteryStatus.OPEN ? onPresentBuyTicketsModal : onClaimTicketModal}
    >
      {getBuyButtonText()}
    </Button>
  )
}

export default BuyTicketsButton
