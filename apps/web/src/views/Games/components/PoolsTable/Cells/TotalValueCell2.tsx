import { Flex, Text, Balance, Pool, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useGetGame } from 'state/games/hooks'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const TotalValueCell: React.FC<any> = ({ pool, currAccount, symbol }) => {
  const { t } = useTranslation()
  const gameData = useGetGame(pool?.gameName?.toLowerCase(), currAccount?.id ?? '0') as any
  const totalPaid = parseFloat(getBalanceNumber(pool?.totalPaid, pool?.token?.decimals)?.toString())
  const earned = (totalPaid * parseFloat(gameData?.score ?? '0')) / Math.max(parseFloat(pool?.totalScore), 1)
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total Earnings')}
        </Text>
        <Flex height="20px" mb="10px" alignItems="center">
          <Balance
            fontSize="16px"
            value={getBalanceNumber(pool?.totalEarned, pool?.token?.decimals)}
            decimals={5}
            unit={` ${symbol}`}
          />
        </Flex>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Potential Earnings')}
        </Text>
        <Flex height="20px" alignItems="center">
          {earned ? (
            <Balance fontSize="16px" value={earned} decimals={5} unit={` ${symbol}`} />
          ) : (
            <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
              -
            </Text>
          )}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalValueCell
