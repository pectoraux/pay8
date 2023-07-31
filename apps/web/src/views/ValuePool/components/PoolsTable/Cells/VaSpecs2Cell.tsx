import { Flex, Text, Balance, Pool, Box, useMatchBreakpoints } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { Token } from '@pancakeswap/sdk'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { format } from 'util'

interface TotalStakedCellProps {
  totalStakedBalance: number
  stakingToken: Token
  totalStaked: BigNumber
}

const StyledCell = styled(Pool.BaseCell)`
  flex: 2 0 100px;
`

const VaSpecs2Cell: React.FC<any> = ({ nft }) => {
  const { isMobile } = useMatchBreakpoints()
  const { t } = useTranslation()
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
                  decimals={0}
                  value={(parseInt(nft.vavaPercentile ?? '0') + parseInt(nft.vaPercentile ?? '0')) / 2}
                  unit="%"
                />
                <Text fontSize="12px" color="textSubtle" textAlign="left">
                  {t('Percentile')}
                </Text>
                <Box mr="8px">
                  <Text mt="4px" fontSize="14px" color="primary" bold>
                    {parseInt(nft.lockTime) ? format(convertTimeToSeconds(nft.lockTime), 'MMM do, yyyy HH:mm') : '-'}
                  </Text>
                </Box>
                <Text fontSize="12px" color="textSubtle" textAlign="left">
                  {t('Lock Ends')}
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

export default VaSpecs2Cell
