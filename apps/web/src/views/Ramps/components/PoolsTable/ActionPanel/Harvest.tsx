import { Button, Text, Flex, Box, Balance, ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { useState } from 'react'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'

import { useGetCardFromStripe, useGetCardId } from 'state/ramps/hooks'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool, rampAccount }) => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const { data: vc } = useGetCardId(pool.rampAddress, account)
  const { data: cardInfo } = useGetCardFromStripe(pool?.secretKeys && pool?.secretKeys[0], vc?.cardId)
  const [activeButtonIndex, setActiveButtonIndex] = useState(0)

  const actionTitle = (
    <Flex flex="1" flexDirection="row" alignSelf="flex-center">
      {rampAccount ? (
        <Text fontSize="12px" bold mr="2px" color="textSubtle" as="span" textTransform="uppercase">
          {t('Current Token')}{' '}
        </Text>
      ) : null}
      <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
        {rampAccount?.token?.symbol ?? ''}
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
            {pool?.isOverCollateralised ? t('Yes') : t('No')}
          </Text>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Over-Collateralized ?')}
          </Text>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={rampAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(rampAccount?.mintable)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Amount Mintable')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={rampAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(rampAccount?.cap)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Cap')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={rampAccount?.token?.decimals ?? 18}
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
              decimals={rampAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(rampAccount?.burnt)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Token Burnt')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            <Balance
              lineHeight="1"
              color="textSubtle"
              fontSize="12px"
              decimals={rampAccount?.token?.decimals ?? 18}
              value={getBalanceNumber(rampAccount?.salePrice)}
            />
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Sale Price')}
            </Text>
          </Box>
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
              {t('Leviathan Token ID')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.bountyId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={rampAccount?.bountyId}
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
            {parseInt(rampAccount?.partnerBounties) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={rampAccount?.partnerBounties}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Partner Bounty IDs')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.profileId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={rampAccount?.profileId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Attached Profile ID')}
            </Text>
          </Box>
          <Box mr="8px" height="32px">
            {parseInt(rampAccount?.badgeId) ? (
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={0}
                value={rampAccount?.profileId}
                prefix="# "
              />
            ) : (
              <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                N/A
              </Text>
            )}
            <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
              {t('Attached Badge ID')}
            </Text>
          </Box>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t("Ramp's Leviathan")}
          </Text>
          <CopyAddress title={truncateHash(pool?._ve)} account={pool?._ve} />
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
            {t(`Card Number: ${cardInfo?.data?.cardNumber}`)}
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
