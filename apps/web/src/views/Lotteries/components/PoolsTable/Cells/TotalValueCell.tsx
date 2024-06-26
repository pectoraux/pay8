import { Flex, Text, Balance, Pool, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { MaxUint256, Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useMemo } from 'react'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`
const TotalValueCell: React.FC<any> = ({ labelText, pool }) => {
  const { isMobile } = useMatchBreakpoints()
  const defaultToken = pool?.tokenData?.length ? pool?.tokenData[0] : ''
  const decimals = defaultToken?.decimals ?? 18
  const MAX_INT = 1.157920892373162e59
  const totalStakedBalance = useMemo(() => getBalanceNumber(pool?.endAmount, decimals), [pool, decimals])
  console.log('TotalValueCell============>', totalStakedBalance, MaxUint256.toString(), MAX_INT - totalStakedBalance)
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex>
          {defaultToken && totalStakedBalance < MAX_INT ? (
            <Box mr="8px" height="32px">
              <Balance
                mt="4px"
                bold={!isMobile}
                fontSize={isMobile ? '14px' : '16px'}
                color={Number(pool?.endAmount) ? 'primary' : 'textDisabled'}
                decimals={3}
                unit={` ${defaultToken?.symbol?.toUpperCase() ?? ''}`}
                value={Number(pool?.endAmount) ? Number(totalStakedBalance) : 0}
              />
            </Box>
          ) : (
            '-'
          )}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
