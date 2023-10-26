import { Flex, Text, Balance, Pool } from '@pancakeswap/uikit'
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

const TotalValueCell: React.FC<any> = ({ labelText, pool, amount, symbol }) => {
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {labelText}
        </Text>
        <Flex height="20px" alignItems="center">
          <Balance fontSize="16px" value={amount} decimals={parseInt(pool?.isNFT) ? 0 : 5} unit={` ${symbol}`} />
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
