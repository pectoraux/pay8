import { useMemo } from 'react'
import { Modal, Grid } from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import * as React from 'react'
import Iframe from 'react-iframe'
import { useCurrPool, useGetTokenURIs } from 'state/valuepools/hooks'
import { useTranslation } from '@pancakeswap/localization'

interface BuyTicketsModalProps {
  title: string
  link: string
  onDismiss?: () => void
}

const WebPageModal: React.FC<any> = ({ pool, height = '400px', onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const currState = useCurrPool()
  const nft = useMemo(() => pool?.tokens?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  const vaAddress = nft?.id?.split('-')?.length && nft?.id?.split('-')[0]
  const { data } = useGetTokenURIs(vaAddress, [nft])
  return (
    <Modal
      title={t('NFT ID %val%', { val: nft.tokenId })}
      onDismiss={onDismiss}
      headerBackground={theme.colors.textSubtle}
    >
      <Grid alignItems="center">
        <Iframe url={(data?.length && data[0])?.metadataUrl ?? nft.metadataUrl} height={height} id="myId" />
      </Grid>
    </Modal>
  )
}

export default WebPageModal
