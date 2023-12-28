import { Button, Text, Flex, Box, Balance, ScanLink } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { getBlockExploreLink } from 'utils'
import { useActiveChainId } from 'hooks/useActiveChainId'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useGetIsUnique } from 'state/profile/hooks'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()
  const { isUnique } = useGetIsUnique(pool?.id)
  console.log('HarvestAction==================>', pool, currAccount)
  const actionTitle = (
    <Flex flex="1" flexDirection="row" alignSelf="flex-center">
      <Text fontSize="12px" bold mr="2px" color="textSubtle" as="span" textTransform="uppercase">
        {t('Profile Token: ')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {currAccount?.token?.symbol ?? ''}
      </Text>
    </Flex>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Button disabled>{t('Please Connect Your Wallet')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              value={parseInt(pool?.blackLateSeconds ?? '0') / 60}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Black late minutes')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={getBalanceNumber(pool?.blackLateValue)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Black late value')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              value={parseInt(pool?.brownLateSeconds ?? '0') / 60}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Brown late minutes')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={getBalanceNumber(pool?.brownLateValue)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Brown late value')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              value={parseInt(pool?.silverLateSeconds ?? '0') / 60}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Silver late minutes')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              value={getBalanceNumber(pool?.silverLateValue)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Silver late value')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              value={parseInt(pool?.goldLateSeconds ?? '0') / 60}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Gold late minutes')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={getBalanceNumber(pool?.goldLateValue)} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Gold late value')}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={currAccount?.token?.decimals}
              value={getBalanceNumber(new BigNumber(pool?.paidPayable), currAccount?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Paid Payable')}
            </Text>
          </Box>
          <Box mr="8px" height="32px" mb="8px">
            <Flex flexDirection="column">
              <Text fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {isUnique ? t('Yes') : t('No')}
              </Text>
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Is Unique ?')}
              </Text>
            </Flex>
          </Box>
          <Box mr="8px" height="32px" mb="8px">
            <Flex flexDirection="column">
              <Text fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {pool?.ssid?.length ? pool?.ssid : 'N/A'}
              </Text>
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('SSID')}
              </Text>
            </Flex>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={0}
              value={pool?.ssidAuditorProfileId}
              prefix="# "
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('SSID Auditor Profile ID')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={0}
              value={pool?.crushCount}
              prefix="# "
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Crush Count')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {pool?.accounts?.map((acct) => (
              <ScanLink href={getBlockExploreLink(acct, 'address', chainId)} bold={false} small>
                {truncateHash(acct)}
              </ScanLink>
            ))}
            <Text color="textSubtle" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Accounts')}
            </Text>
          </Box>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
