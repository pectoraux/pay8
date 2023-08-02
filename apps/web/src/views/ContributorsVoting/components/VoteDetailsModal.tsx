import { useState } from 'react'
import { Box, Flex, InjectedModalProps, Modal, Button, Spinner } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useTheme from 'hooks/useTheme'
import DetailsView from './CastVoteModal/DetailsView'

interface VoteDetailsModalProps extends InjectedModalProps {
  block: number
}

const VoteDetailsModal: React.FC<any> = ({ block, onDismiss }) => {
  const { t } = useTranslation()
  const [modalIsOpen, setModalIsOpen] = useState(true)
  // const {
  //   isLoading,
  //   total
  // } = useGetVotingPower(block, modalIsOpen)
  const { theme } = useTheme()

  const handleDismiss = () => {
    setModalIsOpen(false)
    onDismiss()
  }

  return (
    <Modal title={t('Voting Power')} onDismiss={handleDismiss} headerBackground={theme.colors.gradientCardHeader}>
      <Box mb="24px" width={['100%', '100%', '100%', '320px']}>
        <DetailsView
          total={0}
          cakeBalance={0}
          cakeVaultBalance={0}
          cakePoolBalance={0}
          poolsBalance={0}
          ifoPoolBalance={0}
          cakeBnbLpBalance={0}
          lockedCakeBalance={0}
          lockedEndTime={0}
          block={block}
        />
        <Button variant="secondary" onClick={onDismiss} width="100%" mt="16px">
          {t('Close')}
        </Button>
      </Box>
    </Modal>
  )
}

export default VoteDetailsModal
