import { useEffect } from 'react'
import { Balance, Box, Flex, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useGetLatestTokenId } from 'state/referrals/hooks'

import { ActionContainer, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { data: latestTokenId, refetch } = useGetLatestTokenId()

  useEffect(() => {
    refetch()
  }, [pool, refetch])

  return (
    <ActionContainer>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={pool?.vestingTokenDecimals ?? 18}
              value={getBalanceNumber(pool?.toMint, pool?.vestingTokenDecimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount To Mint')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={pool?.vestingTokenDecimals ?? 18}
              value={getBalanceNumber(pool?.toErase, pool?.vestingTokenDecimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Debt To Erase')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={pool?.vestingTokenDecimals ?? 18}
              value={getBalanceNumber(pool?.treasuryFees, pool?.vestingTokenDecimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Treasury Fees')}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={pool?.vestingTokenDecimals ?? 18}
              value={getBalanceNumber(pool?.currentVolume, pool?.vestingTokenDecimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Current Volume')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={pool?.vestingTokenDecimals ?? 18}
              value={getBalanceNumber(pool?.currentDebt, pool?.vestingTokenDecimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Current Debt')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={pool?.vestingTokenDecimals ?? 18}
              value={getBalanceNumber(pool?.previousVolume, pool?.vestingTokenDecimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Previous Volume')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={0}
              value={Number(latestTokenId) - 1}
              prefix="#"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Number Of Donors So Far')}
            </Text>
          </Box>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
