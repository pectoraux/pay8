import { Box, CardBody, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import PreviewImage from './PreviewImage'
import styled from 'styled-components'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'

import { CostLabel, MetaRow } from './styles'
import NFTMedia from '../NFTMedia'
import Timer from '../../Collection/IndividualNFTPage/OneOfAKindNftPage/Timer'
import { differenceInSeconds } from 'date-fns'
import { useGetOrder } from 'state/cancan/hooks'

export const getTitle = (title) => {
  return title?.replaceAll('-', ' ')?.trim() ?? ''
}

const StyledTimerText = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const CollectibleCardBody: React.FC<any> = ({ nft, currentAskPrice, isUserNft }) => {
  const { t } = useTranslation()
  const { tokenId: name } = nft
  const bnbBusdPrice = useBNBBusdPrice()
  const { mainCurrency } = useWorkspaceCurrency(nft?.ve?.toLowerCase(), nft?.tFIAT, nft?.usetFIAT, nft?.currentAskPrice)
  const isAuction = Number(nft?.bidDuration) > 0
  const askOrder = useGetOrder(nft?.collection?.id, nft?.tokenId)?.data as any
  const isDrop = parseInt(askOrder?.dropinTimer ?? '0')
  const diff = Math.max(
    differenceInSeconds(new Date(isDrop * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days, hours, minutes } = getTimePeriods(diff)
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
      </Flex>
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
    </CardBody>
  )
}

export default CollectibleCardBody
