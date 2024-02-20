import { useState, useMemo } from 'react'
import styled from 'styled-components'
import {
  Card,
  CardHeader,
  CardBody,
  Flex,
  Heading,
  Text,
  Button,
  useModal,
  Box,
  CardFooter,
  ExpandableLabel,
  Balance,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import { useLottery } from 'state/lottery/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import RoundSwitcher from './RoundSwitcher'
import ViewTicketsModal from './ViewTicketsModal'
import BuyTicketsButton from './BuyTicketsButton'
import { dateTimeOptions } from '../helpers'
import RewardBrackets from './RewardBrackets'

const Grid = styled.div`
  display: grid;
  grid-template-columns: auto;

  ${({ theme }) => theme.mediaQueries.md} {
    grid-column-gap: 32px;
    grid-template-columns: auto 1fr;
  }
`

const StyledCard = styled(Card)`
  width: 100%;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: 520px;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    width: 756px;
  }
`

const NextDrawWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: 24px;
`

const NextDrawCard = ({ currentTokenId, setCurrentTokenId }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { account } = useWeb3React()
  const { lotteryData } = useLottery()
  const { id: currentLotteryId, endTime, tokenData, status } = lotteryData
  const userTickets = lotteryData?.users
  const [onPresentViewTicketsModal] = useModal(<ViewTicketsModal roundId={currentLotteryId} roundStatus={status} />)
  const [isExpanded, setIsExpanded] = useState(false)
  // const cakePriceBusd = usePriceCakeBusd()
  const currTokenData = useMemo(
    () => (tokenData?.length ? tokenData[parseInt(currentTokenId)] : {}),
    [tokenData, currentTokenId],
  )
  console.log('4currentTokenId===============>', userTickets)
  // const prizeInBusd = amountCollectedInCake.times(cakePriceBusd)
  const endTimeMs = parseInt(endTime, 10) * 1000
  const endDate = new Date(endTimeMs)
  const isLotteryOpen = status === LotteryStatus.OPEN
  const userTicketCount =
    userTickets?.filter((user) => user?.account?.toLowerCase() === account?.toLowerCase())?.length || 0
  const latestRoundId = tokenData?.length
  const ids = lotteryData?.isNFT ? lotteryData?.nftPrizes?.map((prize) => prize?.tokenId) : ''
  const getPrizeBalances = () => {
    return (
      <Balance
        fontSize="40px"
        color="secondary"
        textAlign={['center', null, null, 'left']}
        lineHeight="1"
        bold
        prefix={parseInt(lotteryData?.isNFT) ? 'NFT ID(s) ' : ''}
        unit={parseInt(lotteryData?.isNFT) ? '' : ` ${currTokenData.token?.symbol ?? '$'}`}
        value={
          parseInt(lotteryData?.isNFT)
            ? ids?.toString()
            : getBalanceNumber(currTokenData?.amountCollected, currTokenData.token?.decimals)
        }
        decimals={parseInt(lotteryData?.isNFT) ? 0 : 5}
      />
    )
  }

  const getNextDrawId = () => {
    if (status === LotteryStatus.OPEN) {
      return `${currentLotteryId} |`
    }
    if (status === LotteryStatus.PENDING) {
      return ''
    }
    return parseInt(currentLotteryId, 10)
  }

  const getNextToken = () => {
    if (status === LotteryStatus.OPEN) {
      return t('Token: %val%', { val: currTokenData.token?.symbol ?? '' })
    }
    return ''
  }

  const getNextDrawDateTime = () => {
    if (status === LotteryStatus.OPEN) {
      return t('Draw: %val%', { val: endDate.toLocaleString(locale, dateTimeOptions) })
    }
    return ''
  }

  const handleInputChange = (event) => {
    const {
      target: { value },
    } = event
    if (value) {
      setCurrentTokenId(value)
      if (parseInt(value, 10) <= 0) {
        setCurrentTokenId('0')
      }
      if (parseInt(value, 10) >= latestRoundId) {
        setCurrentTokenId(latestRoundId - 1)
      }
    } else {
      setCurrentTokenId('0')
    }
  }

  const handleArrowButtonPress = (targetRound) => {
    if (targetRound) {
      setCurrentTokenId(targetRound.toString())
      if (parseInt(targetRound, 10) >= latestRoundId) {
        setCurrentTokenId(latestRoundId - 1)
      }
    } else {
      // targetRound is NaN when the input is empty, the only button press that will trigger this func is 'forward one'
      setCurrentTokenId('0')
    }
  }

  const ticketRoundText =
    userTicketCount > 1
      ? t('You have %amount% tickets this round', { amount: userTicketCount })
      : t('You have %amount% ticket this round', { amount: userTicketCount })
  const [youHaveText, ticketsThisRoundText] = ticketRoundText.split(userTicketCount.toString())

  return (
    <StyledCard>
      <CardHeader p="16px 24px">
        <Flex justifyContent="space-between">
          {/* <Heading mr="12px">{t('Next Draw')}</Heading> */}
          <Text>
            {currentLotteryId && `#${getNextDrawId()}`} {getNextToken()} {Boolean(endTime) && getNextDrawDateTime()}
          </Text>
        </Flex>
        <RoundSwitcher
          isLoading={false}
          selectedRoundId={currentTokenId}
          mostRecentRound={latestRoundId}
          handleInputChange={handleInputChange}
          handleArrowButtonPress={handleArrowButtonPress}
        />
      </CardHeader>
      <CardBody>
        <Grid>
          <Flex justifyContent={['center', null, null, 'flex-start']}>
            <Heading>{t('Prize Pot')}</Heading>
          </Flex>
          <Flex flexDirection="column" mb="18px">
            {getPrizeBalances()}
          </Flex>
          <Box display={['none', null, null, 'flex']}>
            <Heading>{t('Your tickets')}</Heading>
          </Box>
          <Flex flexDirection={['column', null, null, 'row']} alignItems={['center', null, null, 'flex-start']}>
            {isLotteryOpen && (
              <Flex
                flexDirection="column"
                mr={[null, null, null, '24px']}
                alignItems={['center', null, null, 'flex-start']}
              >
                {account && (
                  <Flex justifyContent={['center', null, null, 'flex-start']}>
                    <Text display="inline">{youHaveText} </Text>
                    <Balance value={userTicketCount} decimals={0} display="inline" bold mx="4px" />
                    <Text display="inline"> {ticketsThisRoundText}</Text>
                  </Flex>
                )}
                {userTicketCount > 0 && (
                  <Button
                    onClick={onPresentViewTicketsModal}
                    height="auto"
                    width="fit-content"
                    p="0"
                    mb={['32px', null, null, '0']}
                    variant="text"
                    scale="sm"
                  >
                    {t('View your tickets')}
                  </Button>
                )}
              </Flex>
            )}
            <BuyTicketsButton
              currentTokenId={currentTokenId}
              currTokenData={currTokenData}
              disabled={false}
              maxWidth="280px"
            />
          </Flex>
        </Grid>
      </CardBody>
      <CardFooter p="0">
        {isExpanded && (
          <NextDrawWrapper>
            <RewardBrackets lotteryNodeData={lotteryData} currTokenData={currTokenData} />
          </NextDrawWrapper>
        )}
        {(status === LotteryStatus.OPEN || status === LotteryStatus.CLOSE) && (
          <Flex p="8px 24px" alignItems="center" justifyContent="center">
            <ExpandableLabel expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? t('Hide') : t('Details')}
            </ExpandableLabel>
          </Flex>
        )}
      </CardFooter>
    </StyledCard>
  )
}

export default NextDrawCard
