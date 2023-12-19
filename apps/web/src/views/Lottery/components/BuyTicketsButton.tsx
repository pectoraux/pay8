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
    <ClaimTicketModal
      lotteryId={lotteryId}
      users={users}
      currentTokenId={currentTokenId}
      currTokenData={currTokenData}
    />,
  )

  const getBuyButtonText = () => {
    if (status === LotteryStatus.OPEN) {
      return t('Buy Tickets')
    }
    if (!disabled) {
      return t('Claim Tickets')
    }
    return (
      <>
        <WaitIcon mr="4px" color="textDisabled" /> {t('On sale soon!')}
      </>
    )
  }

  const themeStr = themeMode ?? (isDark ? 'dark' : 'light')

  return (
    <Button
      data-theme={themeStr}
      {...props}
      disabled={status !== LotteryStatus.OPEN && disabled}
      onClick={status === LotteryStatus.OPEN ? onPresentBuyTicketsModal : onClaimTicketModal}
    >
      {getBuyButtonText()}
    </Button>
  )
}

export default BuyTicketsButton
