import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Button, Text, Flex, Box, Balance, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import { useGetAccountSg, useGetCardFromStripe, useGetCardId } from 'state/ramps/hooks'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { ccFormat } from 'views/Ramps/components/PoolsTable/ActionPanel/Harvest'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool, rampAccount }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: vc } = useGetCardId(pool.rampAddress, account)
  const { data: cardInfo } = useGetCardFromStripe(pool?.secretKeys && pool?.secretKeys[0], vc?.cardId)
  const { data: accountData } = useGetAccountSg(account, 'stripe')
  const [activeButtonIndex, setActiveButtonIndex] = useState(0)

  const actionTitle = (
    <Flex flex="1" flexDirection="column" alignSelf="flex-center">
      {rampAccount ? (
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {t('Current Token')}{' '}
        </Text>
      ) : null}
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {rampAccount?.symbol}
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
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {t(rampAccount?.status || '')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Account Status')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {pool?.automatic === undefined
              ? '-'
              : pool?.automatic
              ? t('Automatic')
              : pool?.redirect
              ? t('Semi-Automatic')
              : t('Manual')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Account Type')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {rampAccount?.isOverCollateralised ? t('Yes') : t('No')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Over-Collateralized?')}
          </Text>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={6}
              value={getBalanceNumber(rampAccount?.minted)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Token Minted')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={6}
              value={getBalanceNumber(rampAccount?.burnt)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Token Burnt')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {pool?.saleTokenSymbol && pool?.saleTokenSymbol?.length ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={6}
                value={getBalanceNumber(rampAccount?.salePrice)}
                unit={` ${pool?.saleTokenSymbol}`}
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Sale Price')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={6}
              value={getBalanceNumber(rampAccount?.totalRevenue)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Total Revenue')}
            </Text>
          </Box>
          {rampAccount ? (
            <Box mr="8px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={6}
                value={getBalanceNumber(rampAccount?.nativeToToken)}
              />
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('%token% price in %native%', { native: pool?.nativeSymbol, token: rampAccount?.token?.symbol })}
              </Text>
            </Box>
          ) : null}
          {accountData?.active && accountData?.id ? (
            <Box mr="8px" height="32px">
              <Text lineHeight="1" color="textSubtle" fontSize="12px" textTransform="uppercase">
                {accountData?.id}
              </Text>
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Linked Account')}
              </Text>
            </Box>
          ) : null}
        </Flex>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={0}
              value={rampAccount?.maxPartners}
              prefix="# "
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Maximum Partners')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.tokenId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={rampAccount?.tokenId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Attached veNFT Token Id')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.token?.bountyId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={rampAccount?.token?.bountyId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Attached Bounty ID')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Text lineHeight="1" color="textSubtle" fontSize="12px" textTransform="uppercase">
              {rampAccount?.partnerBounties?.toString()}
            </Text>
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Partner Bounty ID(s)')}
            </Text>
          </Box>
          <Flex flexDirection="column">
            {rampAccount?.paidToPartners?.map((pp) => (
              <Box mr="8px">
                <Text lineHeight="1" color="textSubtle" fontSize="12px" textTransform="uppercase">
                  {pp?.partnerBounty.toString()} {'=>'} {getBalanceNumber(pp.paidRevenue ?? '0')} {'=>'} {pp.share}%
                </Text>
              </Box>
            ))}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Paid To Partner(s)')}
            </Text>
          </Flex>
          <Box mr="8px">
            {parseInt(rampAccount?.bountyId) ? (
              <Text lineHeight="1" color="textSubtle" fontSize="12px" textTransform="uppercase">
                {rampAccount?.bountyId?.toString()} {'=>'} {getBalanceNumber(rampAccount?.rampPaidRevenue ?? '0')}{' '}
                {'=>'} {rampAccount?.rampShare}%
              </Text>
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Paid To Owner')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.token?.profileId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={rampAccount?.token?.profileId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Attached Profile Id')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.token?.badgeId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={rampAccount?.token?.profileId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Attached Badge Id')}
            </Text>
          </Box>
        </Flex>
      </ActionContent>
      {cardInfo?.data?.cardNumber?.length ? (
        <StyledItemRow>
          <Text fontSize="12px" pt="1px" pr="3px" bold as="span">
            {t('Reveal Card ?')}
          </Text>
          <ButtonMenu scale="xs" variant="subtle" activeIndex={activeButtonIndex} onItemClick={setActiveButtonIndex}>
            <ButtonMenuItem>{t('No')}</ButtonMenuItem>
            <ButtonMenuItem>{t('Yes')}</ButtonMenuItem>
          </ButtonMenu>
        </StyledItemRow>
      ) : null}
      {activeButtonIndex ? (
        <Flex flexDirection="column" mt="10px" justifyContent="center" alignItems="center">
          <Text small bold color="textSubtle">
            {t(`Card Number: ${ccFormat(cardInfo?.data?.cardNumber)}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`CVV: ${cardInfo?.data?.cvc}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Expiration: ${cardInfo?.data?.exp_month}/${cardInfo?.data?.exp_year}`)}
          </Text>
          <Text small bold color="textSubtle">
            {t(`Total Burnt To Card: ${cardInfo?.data?.amount} ${cardInfo?.data?.symbol?.toUpperCase()}`)}
          </Text>
        </Flex>
      ) : null}
    </ActionContainer>
  )
}

export default HarvestAction
