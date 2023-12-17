import styled from 'styled-components'
import { Modal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { LotteryStatus } from 'config/constants/types'
import useTheme from 'hooks/useTheme'
import CurrentRoundTicketsInner from './CurrentRoundTicketsInner'

const StyledModal = styled(Modal)`
  ${({ theme }) => theme.mediaQueries.md} {
    width: 280px;
  }
`

interface ViewTicketsModalProps {
  roundId: string
  roundStatus?: LotteryStatus
  onDismiss?: () => void
}

const ViewTicketsModal: React.FC<any> = ({ currentTokenId, currTokenData, onDismiss }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  return (
    <StyledModal title={t('Ticket Info')} onDismiss={onDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <CurrentRoundTicketsInner currentTokenId={currentTokenId} currTokenData={currTokenData} />
    </StyledModal>
  )
}

export default ViewTicketsModal
