import { Box, CardBody, Flex, NextLinkFromReactRouter, Text, Heading } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'
import styled from 'styled-components'
import { differenceInSeconds } from 'date-fns'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import { useGetNftOrder } from 'state/cancan/hooks'

import Timer from './Timer'
import PreviewImage from './PreviewImage'
import { CostLabel, MetaRow } from './styles'
import NFTMedia from '../NFTMedia'

const StyledTimerText = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

export const getTitle = (title) => {
  return title?.replaceAll('-', ' ')?.trim() ?? ''
}

const CollectibleCardBody: React.FC<any> = ({ nft, link, referrer, currentAskPrice, isUserNft }) => {
  const { t } = useTranslation()
  const name = nft?.name
  const bnbBusdPrice = useBNBBusdPrice()
  const { mainCurrency } = useWorkspaceCurrency(nft?.ve?.toLowerCase(), nft?.tFIAT, nft?.usetFIAT, nft?.currentAskPrice)
  const isAuction = Number(nft?.bidDuration) > 0
  const askOrder = useGetNftOrder(nft?.collection?.id, nft?.tokenId)?.data as any
  const isDrop = parseInt(askOrder?.dropinTimer ?? '0')
  const diff = Math.max(
    differenceInSeconds(new Date(isDrop * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days, hours, minutes } = getTimePeriods(Number(diff ?? 0))
  return (
    <CardBody
      p="8px"
      style={{ background: isAuction ? 'linear-gradient(111.68deg, #F2ECF2 0%, #E8F2F6 100%)' : 'white' }}
    >
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="8px" borderRadius="8px" />
      <Flex alignItems="center" justifyContent="space-between">
        {nft?.tokenId && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.tokenId}
          </Text>
        )}
        <CopyAddress account={nft?.tokenId} title="_" mb="24px" />
      </Flex>
      <NextLinkFromReactRouter to={referrer ? `${link}?referrer=${referrer}` : `${link}`}>
        <Text as="h4" fontWeight="600" mb="8px">
          {getTitle(name)}
        </Text>
        <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
          {currentAskPrice && (
            <MetaRow title={isUserNft ? t('Your price') : t('Asking price')}>
              <CostLabel cost={currentAskPrice} mainCurrency={mainCurrency} bnbBusdPrice={bnbBusdPrice} />
            </MetaRow>
          )}
        </Box>
        {isDrop && (days || hours || minutes) ? (
          <>
            <StyledTimerText pt="20px" pr="10px">
              {t('Drops in')}
            </StyledTimerText>
            <Timer minutes={minutes} hours={hours} days={days} />
          </>
        ) : null}
      </NextLinkFromReactRouter>
    </CardBody>
  )
}

export default CollectibleCardBody
