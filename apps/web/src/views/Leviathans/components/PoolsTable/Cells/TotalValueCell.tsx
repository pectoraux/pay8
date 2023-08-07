import { Flex, Text, Balance, Pool, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const TotalValueCell: React.FC<any> = ({ pool, vpCurrencyInput }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Flex height="20px" alignItems="center">
          <Box mr="8px" height="32px">
            <Balance
              bold={!isMobile}
              fontSize="14px"
              color={Number(pool?.totalLiquidity || 0) ? 'primary' : 'textDisabled'}
              decimals={5}
              unit={` ${vpCurrencyInput?.symbol ?? ''}`}
              value={pool?.totalLiquidity}
            />
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Total Liquidity')}
            </Text>
            <Balance
              bold={!isMobile}
              fontSize="14px"
              color={Number(pool?.vaBalance || 0) ? 'primary' : 'textDisabled'}
              decimals={5}
              unit={` ${vpCurrencyInput?.symbol ?? ''}`}
              value={parseFloat(getBalanceAmount(pool?.vaBalance, pool?.vaDecimals)?.toString())}
            />
            <Text fontSize="12px" color="textSubtle" textAlign="left">
              {t('Total Locked')}
            </Text>
          </Box>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
