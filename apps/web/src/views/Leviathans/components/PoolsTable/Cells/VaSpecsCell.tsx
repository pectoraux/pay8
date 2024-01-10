import { Flex, Text, Balance, Pool, useMatchBreakpoints, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { useMemo } from 'react'
import { useCurrPool } from 'state/valuepools/hooks'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const VaSpecsCell: React.FC<any> = ({ pool, vpCurrencyInput }) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
  const currState = useCurrPool()
  const nft = useMemo(() => pool?.tokens?.find((n) => n.id === currState[pool?.id]), [pool, currState])
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Flex height="20px" alignItems="center">
          <Box mr="8px" height="32px">
            {nft ? (
              <>
                <Balance
                  bold={!isMobile}
                  fontSize="14px"
                  color="primary"
                  decimals={3}
                  unit={` ${vpCurrencyInput?.symbol ?? ''}`}
                  value={parseFloat(getBalanceAmount(nft.lockValue, pool?.vaDecimals)?.toString())}
                />
                <Text fontSize="12px" color="textSubtle" textAlign="left">
                  {t('Lock Value')}
                </Text>
                <Balance
                  bold={!isMobile}
                  fontSize="14px"
                  color="primary"
                  decimals={3}
                  unit={` ${vpCurrencyInput?.symbol ?? ''}`}
                  value={parseFloat(getBalanceAmount(nft.lockAmount, pool?.vaDecimals)?.toString())}
                />
                <Text fontSize="12px" color="textSubtle" textAlign="left">
                  {t('Lock Amount')}
                </Text>
              </>
            ) : (
              '-'
            )}
          </Box>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default VaSpecsCell
