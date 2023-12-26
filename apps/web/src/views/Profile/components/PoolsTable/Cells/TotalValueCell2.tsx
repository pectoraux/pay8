import { useMemo } from 'react'
import { Flex, Box, Text, Balance, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import { format } from 'date-fns'
import { convertTimeToSeconds } from 'utils/timeHelper'
import BaseCell, { CellContent } from './BaseCell'

interface TotalStakedCellProps {
  pool?: any
  labelText: string
  value: string
  symbol: string
}

const StyledCell = styled(BaseCell)`
  flex: 2 0 100px;
`

const TotalValueCell: React.FC<any> = ({ t, pool, value, symbol, decimals }) => {
  const { isMobile } = useMatchBreakpoints()
  const totalStakedBalance = useMemo(() => getBalanceNumber(new BigNumber(value), decimals), [value, decimals])
  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total Liquidity')}
        </Text>
        <Flex height="20px" mb="10px" alignItems="center">
          <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={Number(totalStakedBalance) ? 'primary' : 'textDisabled'}
              decimals={5}
              unit={` ${symbol ?? ''}`}
              value={Number(totalStakedBalance) ?? 0}
            />
          </Box>
        </Flex>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Active Period End')}
        </Text>
        <Flex height="20px" alignItems="center">
          {parseInt(pool?.activePeriod ?? '0')
            ? format(convertTimeToSeconds(pool?.activePeriod), 'MMM do, yyyy HH:mm')
            : '-'}
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
