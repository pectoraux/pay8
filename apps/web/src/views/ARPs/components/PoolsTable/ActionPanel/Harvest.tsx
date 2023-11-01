import { Button, Text, Flex, Box, Balance } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'

import { ActionContainer, ActionTitles, ActionContent } from './styles'
import { useWeb3React } from '@pancakeswap/wagmi'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'

const HarvestAction: React.FunctionComponent<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const {
    days: daysReceivable,
    hours: hoursReceivable,
    minutes: minutesReceivable,
  } = getTimePeriods(Number(currAccount?.periodReceivable ?? '0'))
  const {
    days: daysPayable,
    hours: hoursPayable,
    minutes: minutesPayable,
  } = getTimePeriods(Number(currAccount?.periodPayable ?? '0'))

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('ARP Protocol Uses')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {currAccount?.token?.symbol ?? ''}
      </Text>
    </>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionContent>
          <Button disabled>{t('Please Connect Your Wallet')}</Button>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!pool?.accounts?.length) {
    return (
      <ActionContainer>
        <ActionContent>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('No protocol created yet')}
          </Text>
        </ActionContent>
      </ActionContainer>
    )
  }

  if (!currAccount) {
    return (
      <ActionContainer>
        <ActionContent>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Pick an account to display its data')}
          </Text>
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
              decimals={currAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(currAccount?.paidReceivable, currAccount?.token?.decimals)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Paid Receivable')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={currAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(currAccount?.paidPayable, currAccount?.token?.decimals)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Paid Payable')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={pool?.percentages ? 0 : currAccount?.token?.decimals ?? 18}
              value={
                pool?.percentages
                  ? parseInt(currAccount?.amountReceivable ?? '0') / 100
                  : getBalanceNumber(currAccount?.amountReceivable, currAccount?.token?.decimals)
              }
              unit={pool?.percentages ? '%' : ''}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Receivable')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={pool?.percentages ? 0 : currAccount?.token?.decimals ?? 18}
              value={
                pool?.percentages
                  ? parseInt(currAccount?.amountPayable ?? '0') / 100
                  : getBalanceNumber(currAccount?.amountPayable, currAccount?.token?.decimals)
              }
              unit={pool?.percentages ? '%' : ''}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Payable')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={currAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(currAccount?.totalLiquidity, currAccount?.token?.decimals)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Total Liquidity')}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysReceivable} {t('days')} {hoursReceivable} {t('hours')} {minutesReceivable} {t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Period Receivable')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysPayable} {t('days')} {hoursPayable} {t('hours')} {minutesPayable} {t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Period Payable')}
          </Text>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.tokenId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={currAccount?.tokenId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('veNFT Token ID')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.bountyId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={currAccount?.bountyId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Bounty Id')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.adminBountyId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={currAccount?.adminBountyId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Admin Bounty Id')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.profileId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={currAccount?.profileId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Profile Id')}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.autocharge ? 'Yes' : 'No'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('AutoCharge')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.optionId ?? ''}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Option ID')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.description ?? ''}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Description')}
          </Text>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
