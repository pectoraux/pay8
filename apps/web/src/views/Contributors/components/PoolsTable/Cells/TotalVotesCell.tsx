import { Flex, Text, Balance, Pool, Box } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useGetWeight } from 'state/contributors/hooks'

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
  const { data } = useGetWeight(pool?.collection?.id, pool?.ve)
  const hasEarnings = new BigNumber(data?.weights).gt(0)
  console.log('useGetWeight============>', data)
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
              value={hasEarnings ? getBalanceNumber(new BigNumber(data?.weights)) : 0}
              decimals={hasEarnings ? 5 : 1}
              color={hasEarnings ? 'primary' : 'textDisabled'}
            />
            {data?.weightPercent > 0 ? (
              <Balance
                display="inline"
                fontSize="12px"
                color="textSubtle"
                decimals={2}
                prefix="~"
                value={data?.weightPercent}
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
