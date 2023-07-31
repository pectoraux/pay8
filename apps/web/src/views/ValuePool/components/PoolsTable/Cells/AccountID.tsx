import { Flex, Text, Balance, Pool, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const AccountID: React.FC<any> = ({ vpAccount, labelText }) => {
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex height="20px" alignItems="center">
          <Box mr="8px" height="32px">
            {Number(vpAccount?.tokenId) ? (
              <Balance
                mt="4px"
                bold={!isMobile}
                fontSize={isMobile ? '14px' : '16px'}
                color={Number(vpAccount?.tokenId) ? 'primary' : 'textDisabled'}
                decimals={0}
                prefix="# "
                value={vpAccount?.tokenId}
              />
            ) : (
              <Text mt="8px" ml="8px" fontSize="12px" color="textDisabled">
                N/A
              </Text>
            )}
          </Box>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default AccountID
