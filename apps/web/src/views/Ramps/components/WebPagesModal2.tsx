import { useMemo } from 'react'
import { Modal, Grid } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import * as React from 'react'
import Iframe from 'react-iframe'
import { useCurrBribe } from 'state/ramps/hooks'
import { useTranslation } from '@pancakeswap/localization'

interface BuyTicketsModalProps {
  pool?: any
  height: any
  onDismiss?: () => void
}

const WebPageModal: React.FC<any> = ({ pool, height = '400px', onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const currState = useCurrBribe()
  const nft = useMemo(() => pool?.rampNotes?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  return (
    <Modal title={t('Note #%val%', { val: nft?.id })} onDismiss={onDismiss} headerBackground={theme.colors.textSubtle}>
      <Iframe url={nft?.metadataUrl} height={height} styles={{ marginBottom: '10px' }} id="myId2" />
    </Modal>
  )
}

export default WebPageModal
