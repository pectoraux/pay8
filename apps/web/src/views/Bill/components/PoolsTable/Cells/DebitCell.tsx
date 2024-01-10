import { Flex, Text, Balance, Pool } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const DebitCell: React.FC<any> = ({ currAccount }) => {
  const { t } = useTranslation()
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Debit Factor')}
        </Text>
        <Flex height="20px" alignItems="center">
          <Balance fontSize="16px" value={currAccount?.debitFactor} decimals={0} prefix="# " />
        </Flex>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Debit')}
        </Text>
        <Flex height="20px" alignItems="center">
          <Balance
            fontSize="16px"
            value={getBalanceNumber(currAccount?.debit, currAccount?.token?.decimals)}
            decimals={3}
            unit={` ${currAccount?.token?.symbol ?? ''}`}
          />
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default DebitCell
