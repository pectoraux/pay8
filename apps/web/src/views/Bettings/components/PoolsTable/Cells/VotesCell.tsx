import { Flex, Text, Pool, useMatchBreakpoints, Balance } from '@pancakeswap/uikit'
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

const VotesCell: React.FC<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { isMobile } = useMatchBreakpoints()
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Flex flexDirection="column">
          <Flex flexDirection="row" mb="16px">
            <Text mr="8px" mt="4px" fontSize="12px" color="primary" textAlign="left">
              {t('Min. Ticket #')}
            </Text>
            <Balance
              decimals={0}
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={Number(pool?.newMinTicketNumber) ? 'primary' : 'textDisabled'}
              value={Number(pool?.newMinTicketNumber) ?? 0}
            />
          </Flex>
          <Flex flexDirection="row" position="relative" bottom="5px">
            <Text mr="8px" mt="4px" fontSize="12px" color="failure" textAlign="left">
              {t('Ticket Range')}
            </Text>
            <Balance
              decimals={0}
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={Number(pool?.newTicketRange) ? 'primary' : 'textDisabled'}
              value={Number(pool?.newTicketRange) ?? 0}
            />
          </Flex>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default VotesCell
