import { useMemo } from 'react'
import { Modal, Grid } from '@pancakeswap/uikit'
import { useCurrPool } from 'state/bettings/hooks'
import useTheme from 'hooks/useTheme'
import * as React from 'react'
import Iframe from 'react-iframe'
import { useTranslation } from '@pancakeswap/localization'
import { useWeb3React } from '@pancakeswap/wagmi'
import { RoundedImage } from 'views/CanCan/market/Collection/IndividualNFTPage/shared/styles'

interface BuyTicketsModalProps {
  title: string
  link: string
  onDismiss?: () => void
}

const WebPageModal: React.FC<any> = ({ pool, height = '400px', onDismiss }) => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const currState = useCurrPool()
  const currAccount = useMemo(() => pool?.bettingEvents?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  console.log('currAccount=====================>', currAccount)
  return (
    <Modal title={t('Betting NFTs')} onDismiss={onDismiss} headerBackground={theme.colors.textSubtle}>
      <Grid gridTemplateColumns={['1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} alignItems="start">
        {currAccount?.tickets?.length
          ? currAccount?.tickets
              ?.filter(
                (nft) =>
                  (pool?.owner?.toLowerCase() === account?.toLowerCase() ||
                    nft?.owner?.toLowerCase() === account?.toLowerCase()) &&
                  !!nft.metadataUrl,
              )
              ?.map((nft) => {
                return <Iframe url={nft?.metadataUrl} height={height} styles={{ marginBottom: '10px' }} />
              })
          : null}
      </Grid>
    </Modal>
  )
}

export default WebPageModal
