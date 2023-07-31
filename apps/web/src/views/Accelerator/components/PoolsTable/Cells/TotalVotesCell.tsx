import { Flex, Text, Balance, Pool, Box } from '@pancakeswap/uikit'
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

const TotalVotesCell: React.FC<any> = ({ pool }) => {
  const { t } = useTranslation()
  const hasEarnings = new BigNumber(pool?.gaugeWeight).gt(0)
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" color="textSubtle" textAlign="left">
          {t('Total Votes')}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Balance
              mt="4px"
              fontSize="16px"
              value={hasEarnings ? pool?.gaugeWeight : 0}
              decimals={hasEarnings ? 5 : 1}
              color={hasEarnings ? 'primary' : 'textDisabled'}
            />
            {pool?.weightPercent > 0 ? (
              <Balance
                display="inline"
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                value={pool?.weightPercent}
                unit=" %"
              />
            ) : (
              <Text mt="4px" fontSize="12px" color="textDisabled">
                0 %
              </Text>
            )}
          </Box>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TotalVotesCell
