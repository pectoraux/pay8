import { useMemo } from 'react'
import styled from 'styled-components'
import { Flex, Box, Text, Balance } from '@pancakeswap/uikit'
import BigNumber from 'bignumber.js'
import { useTranslation } from '@pancakeswap/localization'
import { weeksToSeconds } from 'views/Pools/components/utils/formatSecondsToWeeks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { distanceToNowStrictWithUnit } from 'utils/timeHelper'
import { DeserializedPublicData, DeserializedPotteryUserData, PotteryDepositStatus } from 'state/types'

const Container = styled(Flex)`
  flex-direction: column;
  padding: 16px 24px;
  background: ${({ theme }) => theme.colors.gradientCardHeader};
`

interface CardFooterProps {
  account: string
  publicData: DeserializedPublicData
  userData: DeserializedPotteryUserData
}

const CardFooter: React.FC<any> = ({ account, data }) => {
  const { t } = useTranslation()
  const symb = ` ${data?.token?.symbol?.toUpperCase() ?? '$'}`
  const boostFactorDisplay = useMemo(() => `X${Number(data?.numPlayers ?? 0).toFixed(2)}`, [data])

  return (
    <Container>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('Number')}
          </Text>
          <Text fontSize="12px" ml="4px" color="secondary" textTransform="uppercase" bold as="span">
            {t('of Players')}
          </Text>
        </Box>
        <Text bold>{account ? boostFactorDisplay : '-'}</Text>
      </Flex>
      <Flex justifyContent="space-between">
        <Box>
          <Text fontSize="12px" color="textSubtle" textTransform="uppercase" bold as="span">
            {t('total #')}
          </Text>
          <Text fontSize="12px" ml="4px" color="secondary" textTransform="uppercase" bold as="span">
            {t('winnings')}
          </Text>
        </Box>
        <Text bold>
          {account && Number(data?.totalEarned) ? getBalanceNumber(data?.totalEarned, data?.token?.decimals) : '-'}
        </Text>
        <Text>{symb}</Text>
      </Flex>
    </Container>
  )
}

export default CardFooter
