import { Flex, Text, Box, Pool } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { format } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { useTranslation } from '@pancakeswap/localization'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const EndsInCell: React.FC<any> = ({ currAccount }) => {
  const { t } = useTranslation()
  const getDate = (nextDue) => {
    try {
      return Number(nextDue) ? format(convertTimeToSeconds(nextDue), 'MMM do, yyyy HH:mm') : '-'
    } catch (err) {
      return '-'
    }
  }
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Next Due Receivable')}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Text mt="4px" fontSize="14px" color="primary" bold>
              {getDate(currAccount?.nextDueReceivable)}
            </Text>
          </Box>
        </Flex>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Next Due Payable')}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Text mt="4px" fontSize="14px" color="primary" bold>
              {getDate(currAccount?.nextDuePayable)}
            </Text>
          </Box>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default EndsInCell
