import { Flex, Text, Box, Pool, Heading } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { differenceInSeconds, format } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useFetchLocale, usePool } from 'state/stakemarket/hooks'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import Timer from './Timer'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`
const StyledTimerText = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const DateInfoCell: React.FC<any> = ({ labelText, sousId, t }) => {
  const { pool } = usePool(sousId)
  const statusEndTime = pool?.status?.length ? pool?.status[1] : 0
  const stakeWinner = parseInt(pool?.status?.length ? pool?.status[2] : 0)
  const locale = useFetchLocale()
  const diff = Math.max(
    differenceInSeconds(new Date(parseInt(pool.waitingDuration) * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days, hours, minutes } = getTimePeriods(diff ?? 0)

  const diff2 = Math.max(
    differenceInSeconds(new Date(parseInt(statusEndTime) * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days: days2, hours: hours2, minutes: minutes2 } = getTimePeriods(diff2 ?? 0)

  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          {(days2 || hours2 || minutes2) && stakeWinner ? (
            <Flex flexDirection="row">
              <StyledTimerText pt="1px">{days2 || hours2 || minutes2 ? t('Appeal window') : ''}</StyledTimerText>
              <Timer minutes={minutes2} hours={hours2} days={days2} />
            </Flex>
          ) : !parseFloat(pool?.waitingDuration) ? (
            <Box mr="8px" height="32px">
              <Text mt="4px" fontSize="14px" color="primary" bold>
                {parseInt(pool?.nextDuePayable)
                  ? format(convertTimeToSeconds(pool?.nextDuePayable), 'MMM do, yyyy HH:mm', { locale })
                  : '-'}
              </Text>
              <Text mt="4px" fontSize="14px" color="textSubtle">
                {parseInt(pool?.nextDueReceivable)
                  ? format(convertTimeToSeconds(pool?.nextDueReceivable), 'MMM do, yyyy HH:mm', { locale })
                  : '-'}
              </Text>
            </Box>
          ) : (
            <Flex flexDirection="row">
              <Timer minutes={minutes} hours={hours} days={days} />
              <StyledTimerText pt="18px">
                {days || hours || minutes ? t('left') : t('Litigation ongoing')}
              </StyledTimerText>
            </Flex>
          )}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default DateInfoCell
