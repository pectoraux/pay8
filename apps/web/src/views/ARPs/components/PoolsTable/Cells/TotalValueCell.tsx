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

const TotalValueCell: React.FC<any> = ({ amount, totalLiquidity, symbol }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Amount Due')}
        </Text>
        <Flex height="20px" mb="10px" alignItems="center">
          <Balance fontSize="16px" value={amount} decimals={0} unit={` ${symbol}`} />
        </Flex>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('ARP Liquidity')}
        </Text>
        <Flex height="20px" alignItems="center">
          <Balance fontSize="16px" value={totalLiquidity} decimals={0} unit={` ${symbol}`} />
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
