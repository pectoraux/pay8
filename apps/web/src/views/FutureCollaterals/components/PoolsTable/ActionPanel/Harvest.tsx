import { format } from 'date-fns'
import { Text, Flex, Box, Balance } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { usePool } from 'state/futureCollaterals/hooks'

import CopyAddress from './CopyAddress'
import { ActionContainer, ActionTitles, ActionContent } from './styles'

export function chunk(items = [], size) {
  const chunks = []
  // eslint-disable-next-line no-param-reassign
  items = [].concat(...items)

  while (items.length) {
    chunks.push(items.splice(0, size))
  }

  return chunks
}

const HarvestAction: React.FunctionComponent<any> = ({ sousId }) => {
  const { t } = useTranslation()
  const { pool } = usePool(sousId)
  const actionTitle = (
    <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
      {t('Future Collateral Uses USD')}{' '}
    </Text>
  )
  const table = chunk(pool?.table, 4)
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
            {format(new Date(parseInt(pool?.startTime || '0') * 1000), 'yyyy-MM-dd HH:mm')}
          </Text>
          <Text color="primary" mb="3px" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Mint Date')}
          </Text>
        </Flex>
        <Flex flexDirection="column" alignSelf="flex-center">
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Owner')}
          </Text>
          <CopyAddress title={truncateHash(pool?.owner)} account={pool?.owner} />
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {table?.length && table[0]?.map((val) => `${getBalanceNumber(val)?.toString()}  =>  `)}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {table?.length && table[1]?.map((val) => `${getBalanceNumber(val)?.toString()}  =>  `)}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {table?.length && table[2]?.map((val) => `${getBalanceNumber(val)?.toString()}  =>  `)}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {table?.length &&
              table[3]?.map((val, index) => {
                if (index === table[3]?.length - 1) {
                  return getBalanceNumber(val)?.toString()
                }
                return `${getBalanceNumber(val)?.toString()}  =>  `
              })}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Estimation Table')}
          </Text>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
