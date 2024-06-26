import { useMemo } from 'react'
import { Flex, Box, Text, Balance, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
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

const TotalValueCell: React.FC<any> = ({ labelText, value, symbol, decimals }) => {
  const { isMobile } = useMatchBreakpoints()
  const totalStakedBalance = useMemo(() => getBalanceNumber(new BigNumber(value), decimals), [value, decimals])

  return (
    <StyledCell role="cell">
      <CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={Number(totalStakedBalance) ? 'primary' : 'textDisabled'}
              decimals={3}
              unit={` ${symbol ?? ''}`}
              value={Number(totalStakedBalance) ?? 0}
            />
          </Box>
        </Flex>
      </CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
