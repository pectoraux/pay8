import { Text, Flex, Box, Balance } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'

import CopyAddress from './CopyAddress'
import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  const actionTitle = (
    <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
      {t('Future Collateral Info')}{' '}
    </Text>
  )
  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flexDirection="column" alignSelf="flex-center">
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Auditor')}
          </Text>
          <CopyAddress title={truncateHash(pool?.auditor)} account={pool?.auditor} />
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              decimals={5}
              fontSize="12px"
              value={getBalanceNumber(pool?.fund, pool?.token?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Channel Fund')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              decimals={5}
              fontSize="12px"
              value={getBalanceNumber(pool?.currentPrice, pool?.token?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Current Price')}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {pool?.table?.map((val) => getBalanceNumber(val))?.toString()}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Estimation Table')}
          </Text>
        </Flex>
        <Flex flexDirection="column" alignSelf="flex-center">
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Owner')}
          </Text>
          <CopyAddress title={truncateHash(pool?.owner)} account={pool?.owner} />
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
