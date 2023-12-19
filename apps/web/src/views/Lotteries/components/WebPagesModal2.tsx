import { Modal, Grid } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import * as React from 'react'
import Iframe from 'react-iframe'
import { useTranslation } from '@pancakeswap/localization'

interface BuyTicketsModalProps {
  nfts: any
  height: any
  notes?: any
  onDismiss?: () => void
}

const WebPageModal: React.FC<any> = ({ pool, height = '400px', onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  return (
    <Modal title={t('All Prizes')} onDismiss={onDismiss} headerBackground={theme.colors.textSubtle}>
      <Grid gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} alignItems="start">
        {pool?.tokenURIs?.map((tokenURI) => (
          <Iframe url={tokenURI} height={height} styles={{ marginBottom: '10px' }} id="myId" />
        ))}
      </Grid>
    </Modal>
  )
}

export default WebPageModal
