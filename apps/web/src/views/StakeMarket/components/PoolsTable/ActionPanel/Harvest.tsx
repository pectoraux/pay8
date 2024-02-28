import {
  Button,
  Text,
  Flex,
  Box,
  Balance,
  useModal,
  IconButton,
  ProposalIcon,
  Link,
  CopyButton,
} from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { useCurrency } from 'hooks/Tokens'
import { useMemo, useState } from 'react'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import styled from 'styled-components'

import { ActionContainer, ActionTitles, ActionContent } from './styles'
import ArticleModal from './ArticleModal'

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`

const HarvestAction: React.FunctionComponent<any> = ({ pool, currPool, setCurrPool }) => {
  // eslint-disable-next-line no-param-reassign
  if (!currPool) currPool = pool
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const token = useCurrency(pool?.tokenAddress)

  const balances = pool?.partnerStakeIds?.reduce(
    (acc, partnerStakeId) => {
      acc.push(partnerStakeId)
      return acc
    },
    [pool?.sousId],
  )
  const [_tokenId, setTokenId] = useState(pool?.sousId)

  setCurrPool(
    useMemo(() => [pool, ...pool?.partnerData].find((p) => parseInt(p.sousId) === parseInt(_tokenId)), [_tokenId]),
  )

  const {
    days: daysPayable,
    hours: hoursPayable,
    minutes: minutesPayable,
  } = getTimePeriods(Number(currPool?.periodPayable ?? '0'))
  const {
    days: daysReceivable,
    hours: hoursReceivable,
    minutes: minutesReceivable,
  } = getTimePeriods(Number(currPool?.periodReceivable ?? '0'))
  const {
    days: daysWaiting,
    hours: hoursWaiting,
    minutes: minutesWaiting,
  } = getTimePeriods(Number(currPool?.waitingPeriod ?? '0'))

  const [onPresentArticle] = useModal(<ArticleModal currPool={currPool} />)

  const actionTitle = (
    <Flex flexDirection="column" justifyContent="space-around">
      <Flex flexDirection="row" justifyContent="space-around">
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {t('Stake Uses')} {token?.symbol}
        </Text>
      </Flex>
      <Flex flexDirection="row" justifyContent="space-around">
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {t('Account Overview')}
        </Text>
        <Wrapper>
          <Text fontSize="12px" bold mb="10px" color="textSubtle" as="span" textTransform="uppercase">
            {t('Account Address')}
          </Text>
          <CopyButton width="24px" text={currPool?.owner} tooltipMessage={t('Copied')} />
        </Wrapper>
      </Flex>
    </Flex>
  )

  if (!account) {
    return (
      <ActionContainer>
        <ActionTitles>{actionTitle}</ActionTitles>
        <ActionContent>
          <Button disabled>{t('Connect your wallet')}</Button>
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
              decimals={5}
              value={getBalanceNumber(currPool?.paidPayable, token?.decimals)}
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
              decimals={5}
              value={getBalanceNumber(currPool?.paidReceivable, token?.decimals)}
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
              decimals={5}
              value={getBalanceNumber(currPool?.amountPayable, token?.decimals)}
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
              decimals={5}
              value={getBalanceNumber(currPool?.amountReceivable, token?.decimals)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Receivable')}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysPayable} {t('days')} {hoursPayable} {t('hours')} {minutesPayable} {t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Period Payable')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysReceivable} {t('days')} {hoursReceivable} {t('hours')} {minutesReceivable} {t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Period Receivable')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {daysWaiting} {t('days')} {hoursWaiting} {t('hours')} {minutesWaiting} {t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Waiting Duration')}
          </Text>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={0}
              value={parseInt(currPool?.gasPercent) / 100}
              unit="%"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Gas Percentage')}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center" mb="9px">
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={5}
              value={getBalanceNumber(currPool?.duePayable, token?.decimals)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Due Payable')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={5}
              value={getBalanceNumber(currPool?.dueReceivable, token?.decimals)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Due Receivable')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currPool?.profileId} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Profile ID')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currPool?.bountyId} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Bounty ID')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={currPool?.tokenId} />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Token ID')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
              {currPool?.ownerAgreement === 0
                ? t('Undefined')
                : currPool?.ownerAgreement === 1
                ? t('Pending')
                : currPool?.ownerAgreement === 2
                ? t('Good')
                : currPool?.ownerAgreement === 3
                ? t('Not Good')
                : t('Disagreement')}
            </Text>
            <br />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Agreement State')}
            </Text>
          </Box>
          <Flex flexDirection="row">
            <IconButton as={Link} style={{ cursor: 'pointer' }} onClick={onPresentArticle}>
              <Text color="primary" fontSize="12px" bold textTransform="uppercase">
                {t('Terms')}
              </Text>
              <ProposalIcon color="textSubtle" />
            </IconButton>
          </Flex>
        </Flex>
      </ActionContent>
      <Flex flexWrap="wrap" justifyContent="center" alignItems="center">
        {balances
          .filter((balance) => !!parseInt(balance))
          .map((balance) => (
            <Button
              key={balance}
              onClick={(e) => setTokenId(balance)}
              mt="4px"
              mr={['2px', '2px', '4px', '4px']}
              scale="sm"
              variant={_tokenId === balance ? 'subtle' : 'tertiary'}
            >
              {balance}
            </Button>
          ))}
      </Flex>
    </ActionContainer>
  )
}

export default HarvestAction
