import { Box, CardBody, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { useBNBBusdPrice } from 'hooks/useBUSDPrice'
import { useGetOrder } from 'state/cancan/hooks'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import { differenceInSeconds } from 'date-fns'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'

import PreviewImage from './PreviewImage'
import { CostLabel, MetaRow } from './styles'
import LocationTag from './LocationTag'
import NFTMedia from '../NFTMedia'

export const getTitle = (title) => {
  return title?.replaceAll('-', ' ')?.trim() ?? ''
}

const CollectibleCardBody: React.FC<any> = ({ nft, nftLocation, currentAskPrice, isUserNft }) => {
  const { t } = useTranslation()
  const { tokenId: name } = nft
  const bnbBusdPrice = useBNBBusdPrice()
  const { mainCurrency } = useWorkspaceCurrency(nft?.ve?.toLowerCase(), nft?.tFIAT, nft?.usetFIAT, nft?.currentAskPrice)
  const isAuction = Number(nft?.bidDuration) > 0
  const askOrder = useGetOrder(nft?.collection?.id, nft?.tokenId)?.data as any
  const isDrop = parseInt(askOrder?.dropinTimer ?? '0')
  return (
    <CardBody p="8px">
      <NFTMedia as={PreviewImage} nft={nft} height={320} width={320} mb="8px" borderRadius="8px" />
      <Flex alignItems="center" justifyContent="space-between">
        {nft?.tokenId && (
          <Text fontSize="12px" color="textSubtle" mb="8px">
            {nft?.tokenId}
          </Text>
        )}
        {nftLocation && <LocationTag nftLocation={nftLocation} />}
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
    </CardBody>
  )
}

export default CollectibleCardBody
