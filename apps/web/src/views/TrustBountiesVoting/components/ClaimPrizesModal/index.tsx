import { useEffect } from 'react'
import styled from 'styled-components'
import {
  Heading,
  ModalContainer,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalCloseButton,
  useToast,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import delay from 'lodash/delay'
import confetti from 'canvas-confetti'
import { LotteryTicketClaimData } from 'config/constants/types'

import ClaimPrizesInner from './ClaimPrizesInner'

const StyledModal = styled(ModalContainer)`
  position: relative;
  overflow: visible;

  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 380px;
  }
`

const StyledModalHeader = styled(ModalHeader)`
  background: ${({ theme }) => theme.colors.gradientCardHeader};
  border-top-right-radius: 32px;
  border-top-left-radius: 32px;
`

const BunnyDecoration = styled.div`
  position: absolute;
  top: -116px; // line up bunny at the top of the modal
  left: 0px;
  text-align: center;
  width: 100%;
`

const showConfetti = () => {
  confetti({
    particleCount: 200,
    startVelocity: 30,
    gravity: 0.5,
    spread: 350,
    origin: {
      x: 0.5,
      y: 0.3,
    },
  })
}

interface ClaimPrizesModalModalProps {
  roundsToClaim: LotteryTicketClaimData[]
  onDismiss?: () => void
}

const ClaimPrizesModal: React.FC<any> = ({ earned, veAddress, tokenAddress, tokenId, onDismiss }) => {
  const { t } = useTranslation()

  useEffect(() => {
    delay(showConfetti, 100)
  }, [])

  return (
    <StyledModal minWidth="280px">
      <BunnyDecoration>
        <img src="/images/decorations/prize-bunny.png" alt="bunny decoration" height="124px" width="168px" />
      </BunnyDecoration>
      <StyledModalHeader>
        <ModalTitle>
          <Heading>{t('Collect Winnings')}</Heading>
        </ModalTitle>
        <ModalCloseButton onDismiss={onDismiss} />
      </StyledModalHeader>
      <ModalBody p="24px">
        <ClaimPrizesInner
          earned={earned}
          onSuccess={onDismiss}
          veAddress={veAddress}
          tokenAddress={tokenAddress}
          tokenId={tokenId}
        />
      </ModalBody>
    </StyledModal>
  )
}

export default ClaimPrizesModal
