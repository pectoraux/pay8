import { Flex, Text, Balance, Pool, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const BribesCell: React.FC<any> = ({ currBribe }) => {
  const { t } = useTranslation()
  const fullBalance = getBalanceNumber(currBribe?.rewardAmount, currBribe?.decimals)
  const earned = getBalanceNumber(currBribe?.earned, currBribe?.decimals)
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Bribe')}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Balance
              fontSize="16px"
              value={fullBalance ?? 0}
              decimals={fullBalance ? 5 : 1}
              unit={` ${currBribe?.symbol || ''}`}
            />
            {currBribe ? (
              <Balance
                display="inline"
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix={t('Earned ')}
                value={earned}
                unit={` ${currBribe?.symbol || ''}`}
              />
            ) : (
              <Text mt="4px" fontSize="12px" color="textDisabled">
                {t('No Bribe Selected')}
              </Text>
            )}
          </Box>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default BribesCell
