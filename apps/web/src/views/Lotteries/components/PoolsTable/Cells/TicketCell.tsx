import { Flex, Text, Pool, useMatchBreakpoints, Balance } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useGetCalculateRewardsForTicketId } from 'state/bettings/hooks'
import { useGetRewardsForTicketId } from 'state/lotteries/hooks'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const TicketCell: React.FC<any> = ({ pool, currAccount, currUser, decimals = 18 }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  const rewards = useGetRewardsForTicketId(currAccount?.token?.address, pool?.id, currUser?.id)
  console.log('rewardsrewards==================>', rewards)
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Flex flexDirection="column" justifyContent="center" alignItems="flex-center">
          {!currAccount ? (
            <Flex flexDirection="row" mb="30x">
              <Text mr="8px" mt="4px" fontSize="12px" color="primary" textAlign="left">
                {t('Ticket #')}
              </Text>
              <Balance
                decimals={0}
                bold={!isMobile}
                fontSize={isMobile ? '14px' : '16px'}
                color={Number(currUser?.ticketNumber) ? 'primary' : 'textDisabled'}
                value={Number(currUser?.ticketNumber) ?? 0}
              />
            </Flex>
          ) : (
            <>
              <Text mr="8px" mb="10px" fontSize="12px" color="failure" textAlign="left">
                {t('Ticket Rewards Per Bracket (%val%)', { val: currUser?.claimed ? 'CLAIMED' : 'UNCLAIMED' })}
              </Text>
              <Flex flexDirection="column" overflow="auto" maxHeight="50px" position="relative">
                {rewards?.length
                  ? rewards?.map((rwd, index) => (
                      <Balance
                        decimals={5}
                        bold={!isMobile}
                        fontSize="13px"
                        color={Number(currUser?.rewards) ? 'primary' : 'textDisabled'}
                        value={getBalanceNumber(new BigNumber(rwd.toString()), decimals) ?? 0}
                        prefix={`${index + 1}) `}
                      />
                    ))
                  : null}
              </Flex>
            </>
          )}
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default TicketCell
