import { Flex, Text, Balance, Pool } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const TotalValueCell2: React.FC<any> = ({ totalLiquidity, symbol }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('ARP Liquidity')}
        </Text>
        <Flex height="20px" alignItems="center">
          <Balance fontSize="16px" value={totalLiquidity} decimals={3} unit={` ${symbol}`} />
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalValueCell2
