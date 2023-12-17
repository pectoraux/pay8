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

const WebPageModal: React.FC<any> = ({ pool, height = '400px', onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <Modal title={t('NFT Prize')} onDismiss={onDismiss} headerBackground={theme.colors.textSubtle}>
      <Iframe url={pool?.tokenURI} height={height} styles={{ marginBottom: '10px' }} id="myId2" />
    </Modal>
  )
}

export default WebPageModal
