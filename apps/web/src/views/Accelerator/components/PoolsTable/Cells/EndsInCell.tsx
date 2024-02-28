import { Flex, Text, Box, Pool } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { getDrawnDate } from 'views/Lottery/helpers'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const EndsInCell: React.FC<any> = ({ pool }) => {
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()

  const getDate = (nextDue) => {
    try {
      return Number(nextDue) ? getDrawnDate(locale, nextDue) : '-'
    } catch (err) {
      return '-'
    }
  }
  return (
    <StyledCell role="cell">
      <Pool.CellContent>
        <Text fontSize="12px" mt="20px" color="textSubtle" textAlign="left">
          {t('Next Mint Event')}
        </Text>
        <Flex>
          <Box mr="8px" height="32px">
            <Text mt="4px" fontSize="14px" color="primary" bold>
              {getDate(pool?.activePeriod)}
            </Text>
          </Box>
        </Flex>
      </Pool.CellContent>
    </StyledCell>
  )
}

export default EndsInCell
