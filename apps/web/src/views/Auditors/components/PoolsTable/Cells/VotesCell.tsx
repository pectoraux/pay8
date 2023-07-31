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
          <Flex flexDirection="row">
            <Text mr="8px" mt="4px" fontSize="12px" color="primary" textAlign="left">
              {t('Likes')}
            </Text>
            <Balance
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={Number(pool?.likes) ? 'primary' : 'textDisabled'}
              decimals={0}
              value={Number(pool?.likes) ?? 0}
            />
          </Flex>
          <Flex flexDirection="row" position="relative" bottom="5px">
            <Text mr="8px" mt="4px" fontSize="12px" color="failure" textAlign="left">
              {t('Dislikes')}
            </Text>
            <Balance
              bold={!isMobile}
              fontSize={isMobile ? '14px' : '16px'}
              color={Number(pool?.dislikes) ? 'primary' : 'textDisabled'}
              decimals={0}
              value={Number(pool?.dislikes) ?? 0}
            />
          </Flex>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default VotesCell
