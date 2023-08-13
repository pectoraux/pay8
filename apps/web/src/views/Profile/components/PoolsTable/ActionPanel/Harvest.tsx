import { Button, Text, Flex, Box, Balance, ScanLink } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useTranslation } from '@pancakeswap/localization'
import { getBlockExploreLink } from 'utils'
import { useActiveChainId } from 'hooks/useActiveChainId'
import truncateHash from '@pancakeswap/utils/truncateHash'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { chainId } = useActiveChainId()

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
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={pool?.blackLateSeconds} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Black late Seconds')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={pool?.blackLateValue} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Black late Value')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={pool?.brownLateValue} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Brown late Value')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={pool?.brownLateValue} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Brown late Value')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={pool?.silverLateValue} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Silver late Value')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={pool?.silverLateValue} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Silver late Value')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={pool?.goldLateValue} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Gold late Value')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" value={pool?.goldLateValue} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Gold late Value')}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={pool?.paidPayable} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Paid Payable')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={pool?.ssid} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('SSID')}
            </Text>
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
          {pool?.accounts?.map((acct) => (
            <ScanLink href={getBlockExploreLink(acct?.ownerAddress, 'address', chainId)} bold={false} small>
              {truncateHash(acct?.ownerAddress)}
            </ScanLink>
          ))}
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
