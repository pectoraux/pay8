import { Flex, Text, Box, Pool } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { format } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import Countdown from 'views/Lottery/components/Countdown'
import { usePool } from 'state/stakemarket/hooks'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const DateInfoCell: React.FC<any> = ({ labelText, sousId }) => {
  const { pool } = usePool(sousId)
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          {!parseFloat(pool?.waitingDuration) ? (
            <Box mr="8px" height="32px">
              <Text mt="4px" fontSize="14px" color="primary" bold>
                {parseInt(pool?.nextDueReceivable)
                  ? format(convertTimeToSeconds(pool?.nextDueReceivable), 'MMM do, yyyy HH:mm')
                  : '-'}
              </Text>
              <Text mt="4px" fontSize="14px" color="textSubtle">
                {parseInt(pool?.nextDuePayable)
                  ? format(convertTimeToSeconds(pool?.nextDuePayable), 'MMM do, yyyy HH:mm')
                  : '-'}
              </Text>
            </Box>
          ) : (
            <Box mr="8px" height="32px">
              <Countdown nextEventTime={pool.waitingDuration} postCountdownText="" preCountdownText="" />
            </Box>
          )}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default DateInfoCell
