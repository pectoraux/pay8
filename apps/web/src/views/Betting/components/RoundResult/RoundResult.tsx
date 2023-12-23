import { BoxProps, Text, Flex, useModal, useMatchBreakpoints } from '@pancakeswap/uikit'
import { NodeRound, BetPosition } from 'state/types'
import { useTranslation } from '@pancakeswap/localization'
import { DEFAULT_BET_SIZE } from 'config/constants/exchange'
import { useGetWinnersPerBracketNPeriod } from 'state/bettings/hooks'

import { PrizePoolRow, RoundPrice, RoundResultBox } from './styles'
import ClaimTicketsModal from '../ClaimTicketsModal/ClaimTicketsModal'

interface RoundResultProps extends BoxProps {
  round: NodeRound
  hasFailed?: boolean
}

const RoundResult: React.FC<any> = ({ betting, children, ...props }) => {
  // const { lockPrice, closePrice, totalAmount } = round
  const betPosition = BetPosition.HOUSE // getRoundPosition(lockPrice, closePrice)
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const divisor = isMobile ? 5 : 1
  const arr2 = Array.from(
    { length: Math.min(parseInt(betting?.currPeriod || 0) + 2, parseInt(betting?.numberOfPeriods)) },
    (v, i) => i,
  )?.slice(-DEFAULT_BET_SIZE / divisor)
  const bettingAddress = betting?.id?.split('_')?.length && betting?.id?.split('_')[0]
  const winBr = useGetWinnersPerBracketNPeriod(bettingAddress, betting?.bettingId, arr2, betting?.ticketSize)
  const [onPresentClaimTicketsModal] = useModal(<ClaimTicketsModal betting={betting} />)

  const subjects = betting?.subjects?.split(',')
  console.log('RoundResult==============>', betting)
  return (
    <RoundResultBox betPosition={betPosition} {...props}>
      <Text color="textSubtle" fontSize="12px" bold textTransform="uppercase" mb="8px">
        {t('Closed Betting')}
      </Text>
      <Flex
        justifyContent="flex-start"
        alignItems="center"
        flexDirection="column"
        overflow="auto"
        maxHeight="200px"
        onClick={onPresentClaimTicketsModal}
      >
        {betting?.rewardsBreakdownBc
          ?.filter((rwb) => !!parseFloat(rwb))
          ?.map((rwb, index) => {
            return (
              <RoundPrice
                percentReward={rwb}
                option={subjects?.length && subjects[index]}
                countOfWinners={winBr?.length && winBr[index]}
              />
            )
          })}
      </Flex>
      {/* <LockPriceRow  /> */}
      <PrizePoolRow betting={betting} mb="8px" />
      {children}
    </RoundResultBox>
  )
}

export default RoundResult
