import {
  useGetPaymentCredits,
  useGetPendingRevenue,
  useGetTokenForCredit,
  useGetAmountCollected,
  useGetWinnersPerBracketNPeriod,
} from 'state/bettings/hooks'
import { format } from 'date-fns'
import BigNumber from 'bignumber.js'
import { getBlockExploreLink } from 'utils'
import { useWeb3React } from '@pancakeswap/wagmi'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { useTranslation } from '@pancakeswap/localization'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { DEFAULT_BET_SIZE } from 'config/constants/exchange'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'
import { Button, Text, Flex, Box, Balance, ScanLink, useMatchBreakpoints } from '@pancakeswap/uikit'

import { Divider } from '../../styles'
import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool, currAccount }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { chainId } = useActiveChainId()
  const {
    days: daysReceivable,
    hours: hoursReceivable,
    minutes: minutesReceivable,
  } = getTimePeriods(Number(currAccount?.bracketDuration ?? '0'))
  const { isMobile } = useMatchBreakpoints()
  const divisor = isMobile ? 5 : 1
  const arr2 = Array.from(
    { length: Math.min(parseInt(currAccount?.currPeriod || 0) + 2, parseInt(currAccount?.numberOfPeriods)) },
    (v, i) => i,
  )?.slice(-DEFAULT_BET_SIZE / divisor)
  const winBr = useGetWinnersPerBracketNPeriod(pool?.id, currAccount?.bettingId, arr2, currAccount?.ticketSize)
  const pendingRevenue = useGetPendingRevenue(pool?.id, currAccount?.token?.address)
  const { data: burnForCreditTokens } = useGetTokenForCredit(pool?.id) as any
  const { data: paymentCredits } = useGetPaymentCredits(pool?.id, account, currAccount?.bettingId)
  const { amountCollected } = useGetAmountCollected(
    pool?.id,
    currAccount?.bettingId,
    currAccount?.periods?.length > 0 ? currAccount.periods.length - 1 : 0,
  )
  console.log(
    '8currAccount==================>',
    pool,
    currAccount,
    winBr,
    burnForCreditTokens,
    paymentCredits?.toString(),
  )
  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Betting Contract Uses')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {currAccount?.token?.symbol ?? '...'}
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

  if (!pool?.bettingEvents?.length) {
    return (
      <ActionContainer>
        <ActionContent>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('No events created yet')}
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
            {t('Pick an event to display its data')}
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
              decimals={5}
              value={getBalanceNumber(currAccount?.pricePerTicket, currAccount?.token?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Price Per Ticket')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={1}
              value={parseInt(currAccount?.adminShare) / 100}
              unit="%"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Admin Share')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={1}
              value={parseInt(currAccount?.referrerShare) / 100}
              unit="%"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Referrer Share')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={1}
              value={parseInt(currAccount?.discountDivisor) / 100}
              unit="%"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Discount Divisor')}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.alphabetEncoding ? 'Yes' : 'No'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Alphabet Encoding')}
          </Text>
          <Text lineHeight="1" mt="4px" fontSize="12px" color="textSubtle" as="span">
            {Number(currAccount?.numberOfPeriods || 0) === 0 ? 'Infinity' : currAccount?.numberOfPeriods}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Number of Periods')}
          </Text>
          <Flex mr="8px" height="32px" mt="4px" flexDirection="column" justifyContent="space-between">
            <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
              {daysReceivable} {t('days')} {hoursReceivable} {t('hours')} {minutesReceivable} {t('minutes')}
            </Text>
            <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
              {t('Bracket Duration')}
            </Text>
          </Flex>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.nextToClose) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={currAccount?.nextToClose}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Next To Close')}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.action ?? ''}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Action')}
          </Text>
          {currAccount ? (
            <>
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={5}
                value={getBalanceNumber(new BigNumber(pendingRevenue?.toString()), currAccount?.token?.decimals ?? 18)}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Event Pending Revenue')}
              </Text>
            </>
          ) : null}
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.description ?? ''}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Description')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {currAccount?.rewardsBreakdown?.length ? currAccount?.rewardsBreakdown.map((rwb) => `${rwb}%, `) : 'N/A'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Rewards BreakDown')}
          </Text>
          <Text lineHeight="1" mt="4px" fontSize="12px" color="textSubtle" as="span">
            {format(new Date(parseInt(currAccount?.startTime || 0) * 1000), 'yyyy-MM-dd HH:mm')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Start Time')}
          </Text>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Text lineHeight="1" mt="4px" fontSize="12px" color="textSubtle" as="span">
            {format(new Date(parseInt(currAccount?.currStart || 0) * 1000), 'yyyy-MM-dd HH:mm')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Latest Period Start Time')}
          </Text>
          <Text lineHeight="1" mt="4px" fontSize="12px" color="textSubtle" as="span">
            {format(new Date(parseInt(currAccount?.currEnd || 0) * 1000), 'yyyy-MM-dd HH:mm')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Latest Period End Time')}
          </Text>
          <ScanLink href={getBlockExploreLink(pool?.oracle, 'address', chainId)} bold={false} small>
            {truncateHash(pool?.oracle ?? '', 12)}
          </ScanLink>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Oracle')}
          </Text>
          <Box mr="8px" height="32px">
            {parseInt(currAccount?.currPeriod) || parseInt(currAccount?.currPeriod) === 0 ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={currAccount?.currPeriod}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Current Period')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {currAccount?.periods?.length > 0 ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={5}
                value={getBalanceNumber(new BigNumber(amountCollected?.toString()), currAccount?.token?.decimals ?? 18)}
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Collected Last Period')}
            </Text>
          </Box>
          <Text lineHeight="1" color="textSubtle" fontSize="12px" textTransform="uppercase">
            {currAccount?.periods?.length && currAccount.periods[currAccount.periods.length - 1].finalNumber > 0
              ? currAccount.periods[currAccount.periods.length - 1].finalNumber
              : // getTicketAnswer(
                //     currAccount.periods[currAccount.periods.length - 1].finalNumber,
                //     currAccount.ticketSize,
                //     currAccount.alphabetEncoding,
                //   )
                'N/A'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Latest Winning Answer')}
          </Text>
          {winBr?.map((br) => (
            <Text lineHeight="1" color="textSubtle" fontSize="12px" textTransform="uppercase">
              {br?.toString()}
            </Text>
          ))}
          {winBr?.length ? (
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Winners Per Bracket')}
            </Text>
          ) : null}
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={5}
              value={getBalanceNumber(new BigNumber(paymentCredits?.toString()), currAccount?.token?.decimals)}
              unit={` ${currAccount?.token?.symbol}`}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Payment Credits')}
            </Text>
          </Box>
          {burnForCreditTokens?.length > 0 &&
            burnForCreditTokens?.map((data, index) => (
              <>
                <Divider />
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {t('Token Position: %val%', { val: index })}
                </Text>
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {t('Token Name: %val%', { val: data.token?.name })}
                </Text>
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {t('Token Symbol: %val%', { val: data.token?.symbol })}
                </Text>
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {t('Discount: %val%', {
                    val:
                      data.checker !== ADDRESS_ZERO
                        ? getBalanceNumber(new BigNumber(data.discount))
                        : parseInt(data.discount ?? '0') / 100,
                  })}{' '}
                  {data.checker !== ADDRESS_ZERO ? 'USD' : '%'}
                </Text>
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {t('Collection ID: %val%', { val: data.collectionId })}
                </Text>
                <Flex flexDirection="row">
                  <Text lineHeight="1" mt="3px" mr="3px" fontSize="12px" color="textSubtle" as="span">
                    {t('Checker: ')}
                  </Text>
                  <CopyAddress title={truncateHash(data.checker)} account={data.checker} />
                </Flex>
                <Flex flexDirection="row">
                  <Text lineHeight="1" mt="3px" mr="3px" fontSize="12px" color="textSubtle" as="span">
                    {t('Token Address: ')}
                  </Text>
                  <CopyAddress title={truncateHash(data.token?.address)} account={data.token?.address} />
                </Flex>
                <Flex flexDirection="row">
                  <Text lineHeight="1" mt="3px" mr="3px" fontSize="12px" color="textSubtle" as="span">
                    {t('Destination Address: ')}
                  </Text>
                  <CopyAddress title={truncateHash(data.destination)} account={data.destination} />
                </Flex>
              </>
            ))}
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
