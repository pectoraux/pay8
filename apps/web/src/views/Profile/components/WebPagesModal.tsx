import { useMemo } from 'react'
import { Modal, Grid } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import * as React from 'react'
import Iframe from 'react-iframe'
import { useTranslation } from '@pancakeswap/localization'

interface BuyTicketsModalProps {
  title: string
  link: string
  onDismiss?: () => void
}

const WebPageModal: React.FC<any> = ({ pool, height = '400px', onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <Modal
      title={t('Profile ID %val%', { val: pool.id })}
      onDismiss={onDismiss}
      headerBackground={theme.colors.textSubtle}
    >
      <Grid alignItems="center">
        <Iframe url={pool?.metadataUrl} height={height} id="myId" />
      </Grid>
    </Modal>
  )
}

export default WebPageModal
