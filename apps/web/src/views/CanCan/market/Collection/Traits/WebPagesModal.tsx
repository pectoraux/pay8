import { Modal } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import * as React from 'react'
import Iframe from 'react-iframe'
import { useTranslation } from '@pancakeswap/localization'

interface BuyTicketsModalProps {
  pool?: any
  height: any
  onDismiss?: () => void
}

const WebPageModal: React.FC<any> = ({ nft, metadataUrl, height = '400px', onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <Modal
      title={t('Note #%val%', { val: nft[2]?.toString() })}
      onDismiss={onDismiss}
      headerBackground={theme.colors.textSubtle}
    >
      <Iframe url={metadataUrl} height={height} id="myId" />
    </Modal>
  )
}

export default WebPageModal
