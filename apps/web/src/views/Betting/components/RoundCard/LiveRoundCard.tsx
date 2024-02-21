import { useEffect } from 'react'
import { Card, CardBody, Flex, Button, PlayCircleOutlineIcon, Text, useTooltip, useModal } from '@pancakeswap/uikit'
import { getNow } from 'utils/getNow'
import { useTranslation } from '@pancakeswap/localization'
import { NodeRound, NodeLedger, BetPosition } from 'state/types'
import RoundProgress from 'components/RoundProgress'
import { RoundResultBox, PrizePoolRow } from '../RoundResult'
import MultiplierArrow from './MultiplierArrow'
import CardHeader from './CardHeader'
import BuyTicketsModal from '../BuyTicketsModal/BuyTicketsModal'

interface LiveRoundCardProps {
  round: NodeRound
  betAmount?: NodeLedger['amount']
  hasEnteredUp: boolean
  hasEnteredDown: boolean
  bullMultiplier: string
  bearMultiplier: string
}

const LiveRoundCard: React.FC<any> = ({ allBettings, betting }) => {
  const { t } = useTranslation()
  const closeTimestamp = betting?.currEnd
  const lockTimestamp = betting?.currStart

  // const variants = ['success', 'primary', 'secondary', 'tertiary', 'light', 'danger']
  const isBull = true
  const [onPresentBuyTicketsModal] = useModal(<BuyTicketsModal betting={betting} />)
  const { targetRef, tooltip, tooltipVisible } = useTooltip(t('Last price from Chainlink Oracle'), {
    placement: 'bottom',
  })

  useEffect(() => {
    const secondsToClose = closeTimestamp ? closeTimestamp - getNow() : 0
    if (secondsToClose > 0) {
      const refreshPriceTimeout = setTimeout(() => 1, secondsToClose * 1000)

      const calculatingPhaseTimeout = setTimeout(() => 1, secondsToClose * 1000)

      return () => {
        clearTimeout(refreshPriceTimeout)
        clearTimeout(calculatingPhaseTimeout)
      }
    }
    return undefined
  }, [closeTimestamp])

  return (
    <Card isActive style={{ cursor: 'pointer' }}>
      <CardHeader
        status="live"
        icon={<PlayCircleOutlineIcon mr="4px" width="24px" color="secondary" />}
        title={t('Live')}
        epoch={betting?.idx}
      />
      <RoundProgress variant="flat" scale="sm" lockTimestamp={lockTimestamp} closeTimestamp={closeTimestamp} />
      <CardBody p="16px">
        <RoundResultBox betPosition={isBull ? BetPosition.BULL : BetPosition.BEAR}>
          <PrizePoolRow betting={betting} closeTimestamp={closeTimestamp} mb="8px" />
          <Flex
            justifyContent="flex-start"
            alignItems="center"
            flexDirection="column"
            overflow="auto"
            maxHeight="200px"
          >
            {betting?.subjects?.split(',')?.map((subject, index) => (
              <Button width="150px" height="200px" onClick={onPresentBuyTicketsModal} mb="4px">
                <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
                  {subject} ({index + 1})
                </Text>
              </Button>
            ))}
          </Flex>
        </RoundResultBox>
        <MultiplierArrow
          isActive={!isBull}
          allBettings={allBettings}
          action={betting?.action}
          adminShare={betting?.adminShare}
          referrerShare={betting?.referrerShare}
          bettingId={betting?.bettingId}
          rewardsBreakdown={betting?.rewardsBreakdown}
        />
      </CardBody>
      {tooltipVisible && tooltip}
    </Card>
  )
}

export default LiveRoundCard
