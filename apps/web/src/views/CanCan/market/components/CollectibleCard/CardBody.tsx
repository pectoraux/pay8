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
  // const { tokenId: name } = nft
  // const bnbBusdPrice = useBNBBusdPrice()
  // const { mainCurrency } = useWorkspaceCurrency(nft?.ve?.toLowerCase(), nft?.tFIAT, nft?.usetFIAT, nft?.currentAskPrice)
  // const isAuction = Number(nft?.bidDuration) > 0
  // const askOrder = useGetOrder(nft?.collection?.id, nft?.tokenId)?.data as any
  // const isDrop = parseInt(askOrder?.dropinTimer ?? '0')
  // const diff = Math.max(
  //   differenceInSeconds(new Date(isDrop * 1000 ?? 0), new Date(), {
  //     roundingMethod: 'ceil',
  //   }),
  //   0,
  // )
  // const { days, hours, minutes } = getTimePeriods(diff)
  return <></>
}

export default CollectibleCardBody
