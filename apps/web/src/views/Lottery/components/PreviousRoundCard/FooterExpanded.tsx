import { useMemo } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { Flex, Skeleton, Heading, Box, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import RewardBrackets from '../RewardBrackets'

const NextDrawWrapper = styled(Flex)`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

const PreviousRoundCardFooter: React.FC<any> = ({ lotteryNodeData, currentTokenId }) => {
  const { t } = useTranslation()
  const currTokenData = useMemo(
    () => (lotteryNodeData?.tokenData?.length ? lotteryNodeData.tokenData[parseInt(currentTokenId)] : {}),
    [lotteryNodeData, currentTokenId],
  )
  let prizeInBusd = new BigNumber(NaN)
  if (lotteryNodeData) {
    const { priceTicket } = currTokenData
    prizeInBusd = new BigNumber(priceTicket)
  }

  const getPrizeBalances = () => {
    return (
      <>
        {prizeInBusd.isNaN() ? (
          <Skeleton my="7px" height={40} width={200} />
        ) : (
          <Heading scale="xl" lineHeight="1" color="secondary">
            {formatNumber(getBalanceNumber(currTokenData?.amountCollected), 3, currTokenData?.token?.decimals)}{' '}
            {` ${currTokenData?.token?.symbol?.toUpperCase() ?? ''}`}
          </Heading>
        )}
      </>
    )
  }
  return (
    <NextDrawWrapper>
      <Flex mr="24px" flexDirection="column" justifyContent="space-between">
        <Box>
          <Heading>{t('Prize pot')}</Heading>
          {getPrizeBalances()}
        </Box>
        <Box mb="24px">
          <Flex>
            <Text fontSize="14px" display="inline">
              {t('Total players this round')}: {lotteryNodeData ? lotteryNodeData?.users?.length : null}
            </Text>
          </Flex>
        </Box>
      </Flex>
      <RewardBrackets lotteryNodeData={lotteryNodeData} currentTokenId={currentTokenId} isHistoricRound />
    </NextDrawWrapper>
  )
}

export default PreviousRoundCardFooter
