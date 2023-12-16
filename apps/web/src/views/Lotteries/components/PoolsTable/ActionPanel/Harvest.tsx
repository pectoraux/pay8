import BigNumber from 'bignumber.js'
import { Text, Flex, Box, Balance } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useGetPaymentCredits, useGetTokenForCredit } from 'state/lottery/hooks'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetToReinject } from 'state/lotteries/hooks'

import { ActionContainer, ActionTitles, ActionContent } from './styles'
import { Divider } from '../../styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool, currAccount, currUser }) => {
  const { t } = useTranslation()
  const {
    days: daysReceivable,
    hours: hoursReceivable,
    minutes: minutesReceivable,
  } = getTimePeriods(Number(pool?.lockDuration ?? '0'))
  const { account } = useWeb3React()
  const { data: burnForCreditTokens } = useGetTokenForCredit(pool?.collectionId) as any
  const { data: paymentCredits } = useGetPaymentCredits(pool?.id, account)
  const toReinject = useGetToReinject(account, currAccount?.token?.address)

  const actionTitle = (
    <>
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Lottery Uses')}{' '}
      </Text>
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {currAccount?.token?.symbol ?? 'USD'}
      </Text>
    </>
  )
  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          {currUser ? (
            <Box mr="8px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={getBalanceNumber(currUser?.ticketNumber || 0, 0)}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Ticket #')}
              </Text>
            </Box>
          ) : null}
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {t(pool?.status ?? '')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Status')}
          </Text>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={currAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(currAccount?.priceTicket || 0, currAccount?.token?.decimals ?? 18)}
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
              value={parseInt(pool?.discountDivisor) / 100}
              unit="%"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Discount Divisor')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={1}
              value={parseInt(currAccount?.treasuryFee) / 100}
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
              value={parseInt(currAccount?.referrerFee) / 100}
              unit="%"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Referrer Share')}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {pool?.useNFTicket ? 'True' : 'False'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Use NFTickets')}
          </Text>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={pool?.tokenData?.length ? pool?.tokenData[0].token.decimals : 18}
              value={getBalanceNumber(
                pool?.endAmount,
                pool?.tokenData?.length ? pool?.tokenData[0]?.token?.decimals : 18,
              )}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('End Amount')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={currAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(currAccount?.amountCollected, currAccount?.token?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Collected')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={currAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(new BigNumber(toReinject), currAccount?.token?.decimals ?? 18)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Left To Reinject')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={0}
              value={pool?.tokenData?.length}
              prefix="#"
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Number of Tokens')}
            </Text>
          </Box>
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          {parseInt(pool?.lockDuration) ? (
            <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
              {daysReceivable} {t('days')} {hoursReceivable} {t('hours')} {minutesReceivable} {t('minutes')}
            </Text>
          ) : (
            <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
              N/A
            </Text>
          )}
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Lock Duration')}
          </Text>
          <Box mr="8px" height="32px">
            {parseInt(pool?.finalNumber) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={pool?.finalNumber}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Winning Ticket')}
            </Text>
          </Box>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {pool?.rewardsBreakdown?.length ? pool?.rewardsBreakdown.map((rwb) => `${rwb}%, `) : 'N/A'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Rewards BreakDown')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {pool?.countWinnersPerBracket?.length ? pool?.countWinnersPerBracket.map((cwb) => `${cwb}, `) : 'N/A'}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Winners Per Bracket')}
          </Text>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={18}
              value={getBalanceNumber(new BigNumber(paymentCredits?.toString()))}
              unit=" USD"
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
                  {t(`Token Position: ${index}`)}
                </Text>
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {t(`Token Name: ${data.token?.name}`)}
                </Text>
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {t(`Token Symbol: ${data.token?.symbol}`)}
                </Text>
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {t(
                    `Discount: ${
                      data.checker !== ADDRESS_ZERO
                        ? getBalanceNumber(new BigNumber(data.discount))
                        : parseInt(data.discount ?? '0') / 100
                    }`,
                  )}{' '}
                  {data.checker !== ADDRESS_ZERO ? 'USD' : '%'}
                </Text>
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {t(`Collection ID: ${data.collectionId}`)}
                </Text>
                <Flex flexDirection="row">
                  <Text lineHeight="1" mt="3px" mr="3px" fontSize="12px" color="textSubtle" as="span">
                    {t(`Checker: `)}
                  </Text>
                  <CopyAddress title={truncateHash(data.checker)} account={data.checker} />
                </Flex>
                <Flex flexDirection="row">
                  <Text lineHeight="1" mt="3px" mr="3px" fontSize="12px" color="textSubtle" as="span">
                    {t(`Token Address: `)}
                  </Text>
                  <CopyAddress title={truncateHash(data.token?.address)} account={data.token?.address} />
                </Flex>
                <Flex flexDirection="row">
                  <Text lineHeight="1" mt="3px" mr="3px" fontSize="12px" color="textSubtle" as="span">
                    {t(`Destination Address: `)}
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
