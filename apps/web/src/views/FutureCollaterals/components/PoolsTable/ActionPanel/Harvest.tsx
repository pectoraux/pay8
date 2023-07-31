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
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <CopyAddress title={truncateHash(pool?.auditor)} account={pool?.auditor} />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Auditor')}
          </Text>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              decimals={pool?.token?.decimals ?? 18}
              fontSize="12px"
              value={getBalanceNumber(pool?.fund, pool?.token?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Channel Fund')}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <CopyAddress title={truncateHash(pool?.owner)} account={pool?.owner} />
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Owner')}
          </Text>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
