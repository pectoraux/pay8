import { Flex, Text, Balance, Pool, useMatchBreakpoints, Heading } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { differenceInSeconds, format } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
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

const DateInfoCell: React.FC<any> = ({ t, pool }) => {
  const { isMobile } = useMatchBreakpoints()
  const getDate = (endTime) => {
    try {
      return Number(endTime) ? format(convertTimeToSeconds(endTime), 'MMM do, yyyy HH:mm') : '-'
    } catch (err) {
      return '-'
    }
  }
  const statusEndTime = pool?.claims?.length ? pool?.claims[pool?.claims?.length - 1].endTime : 0
  const diff = Math.max(
    differenceInSeconds(new Date(parseInt(statusEndTime) * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days, hours, minutes } = getTimePeriods(diff ?? 0)
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        {days || hours || minutes ? (
          <Flex flexDirection="row">
            <StyledTimerText pt="1px">{days || hours || minutes ? t('Appeal window') : ''}</StyledTimerText>
            <Timer minutes={minutes} hours={hours} days={days} />
          </Flex>
        ) : (
          <>
            <Text fontSize="12px" mb={isMobile ? '10px' : '0px'} color="textSubtle" textAlign="left">
              {t('Lock End Date')}
            </Text>
            <Flex height="20px" alignItems="center">
              {getDate(pool?.endTime)}
            </Flex>
            <Text
              fontSize="12px"
              mt={isMobile ? '10px' : '0px'}
              mb={isMobile ? '10px' : '0px'}
              color="textSubtle"
              textAlign="left"
            >
              {t('Lock Start Date')}
            </Text>
            <Flex height="20px" alignItems="center">
              {getDate(pool?.startTime)}
            </Flex>
          </>
        )}
      </Pool.CellContent>
    </StyledCell>
  )
}

export default DateInfoCell
