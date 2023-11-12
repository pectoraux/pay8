import { Modal, Grid } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import * as React from 'react'
import Iframe from 'react-iframe'
import { useTranslation } from '@pancakeswap/localization'
import { useGetTokenURIs } from 'state/valuepools/hooks'

interface BuyTicketsModalProps {
  title: string
  link: string
  onDismiss?: () => void
}

const WebPageModal: React.FC<any> = ({ nfts, height = '400px', onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const vaAddress = nfts?.length && nfts[0]?.id?.split('-')?.length && nfts[0]?.id?.split('-')[0]
  const { data } = useGetTokenURIs(vaAddress, nfts)
  const _nfts = data ?? nfts
  return (
    <Modal title={t('All NFTs')} onDismiss={onDismiss} headerBackground={theme.colors.textSubtle}>
      <Grid gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} alignItems="start">
        {_nfts?.map((nft) => (
          <Iframe url={nft.metadataUrl} height={height} styles={{ marginBottom: '10px' }} id="myId" />
        ))}
      </Grid>
    </Modal>
  )
}

export default WebPageModal
