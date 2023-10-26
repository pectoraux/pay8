import { Flex, Text, Balance, Pool } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { format } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const DateInfoCell: React.FC<any> = ({ t, pool }) => {
  const getDate = (endTime) => {
    try {
      return Number(endTime) ? format(convertTimeToSeconds(endTime), 'MMM do, yyyy HH:mm') : '-'
    } catch (err) {
      return '-'
    }
  }
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Lock End Date')}
        </Text>
        <Flex height="20px" alignItems="center">
          {getDate(pool?.endTime)}
        </Flex>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Lock Start Date')}
        </Text>
        <Flex height="20px" alignItems="center">
          {getDate(pool?.startTime)}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default DateInfoCell
