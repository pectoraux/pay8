import { Button, Text, Flex, Box, Balance, ScanLink, LinkExternal } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import Divider from 'components/Divider'
import { getBlockExploreLink } from 'utils'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const HarvestAction: React.FunctionComponent<any> = ({ pool, currToken, currAccount, nativeBalance }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { address: account } = useAccount()
  const { days, hours, minutes } = getTimePeriods(Number(pool?.willWithdrawalPeriod ?? '0'))
  const { days: days2, hours: hours2, minutes: minutes2 } = getTimePeriods(Number(pool?.updatePeriod ?? '0'))
  console.log('currAccount==================>', currAccount)
  const actionTitle = (
    <Flex flexDirection="row">
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
          {t('Current Token')}{' '}
        </Text>
        <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
          {currToken?.symbol}
        </Text>
      </Flex>
      {currAccount ? (
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
            {t('Current Heir')}{' '}
          </Text>
          <Text fontSize="12px" bold color="secondary" as="span" textTransform="uppercase">
            {currAccount?.protocolId}
          </Text>
        </Flex>
      ) : null}
    </Flex>
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

  if (!pool?.protocols?.length) {
    return (
      <ActionContainer>
        <ActionContent>
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('No protocols created yet')}
          </Text>
        </ActionContent>
      </ActionContainer>
    )
  }

  // if (!currToken) {
  //   return (
  //     <ActionContainer>
  //       <ActionContent>
  //         <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
  //           {t('Pick a token')}
  //         </Text>
  //       </ActionContent>
  //     </ActionContainer>
  //   )
  // }

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      <ActionContent>
        <Flex flex="1" flexDirection="column" alignSelf="flex-center">
          {currToken?.id ? (
            <>
              <CopyAddress title={t('Curr Token Address')} account={currToken?.tokenAddress} />
              <Box mr="8px" height="32px">
                <Balance
                  lineHeight="1"
                  color="textSubtle"
                  fontSize="12px"
                  decimals={5}
                  value={
                    currToken?.isNative
                      ? nativeBalance
                      : parseInt(currToken?.tokenType)
                      ? currToken?.value
                      : getBalanceNumber(currToken?.totalLiquidity, currToken.decimals ?? 18)
                  }
                />
                <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                  {parseInt(currToken?.tokenType) ? t('Token ID') : t('Total Liquidity')}
                </Text>
              </Box>
              <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                {currToken?.tokenType === '0'
                  ? 'Fugible'
                  : currToken?.tokenType === '1'
                  ? 'NFT - ERC721'
                  : 'NFT - ERC1155'}
              </Text>
              <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Token Type')}
              </Text>
            </>
          ) : null}
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {days} {t('days')} {hours} {t('hours')} {minutes} {t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Will Withdrawable Period')}
          </Text>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {days2} {t('days')} {hours2} {t('hours')} {minutes2} {t('minutes')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Update Period')}
          </Text>
          {currAccount ? (
            <>
              <LinkExternal href={currAccount?.media} bold={false} small>
                {t('View Attached Media')}
              </LinkExternal>
              <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                {currAccount?.description}
              </Text>
              <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
                {t('Description')}
              </Text>
              <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
                {t('SSID')}
              </Text>
              {currAccount?.ssid?.length ? (
                <CopyAddress title={truncateHash(currAccount?.ssid)} account={currAccount?.ssid} />
              ) : (
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  N/A
                </Text>
              )}
            </>
          ) : null}
        </Flex>
        <Flex style={{ overflow: 'hidden' }} maxHeight={150}>
          <Flex style={{ overflowY: 'scroll' }} flex="1" flexDirection="column" alignSelf="flex-center">
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
                {t('Attached Profile Id')}
              </Text>
            </Box>
            {currAccount?.tokenData?.map((td, index) => (
              <>
                <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                  {td?.tokenType === 0 ? 'Fugible' : td?.tokenType === 1 ? 'NFT - ERC721' : 'NFT - ERC1155'}
                </Text>
                <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                  {t('Token Type')}
                </Text>
                <Box mr="8px" height="32px">
                  {currAccount?.percentages?.length > index ? (
                    <Balance
                      lineHeight="1"
                      color="textSubtle"
                      fontSize="12px"
                      decimals={0}
                      value={currAccount?.percentages[index]}
                      unit=" %"
                    />
                  ) : (
                    <Text lineHeight="1" color="textDisabled" fontSize="12px" textTransform="uppercase">
                      N/A
                    </Text>
                  )}
                  <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                    {t('Percentage')}
                  </Text>
                </Box>
                <Box mr="8px" height="32px">
                  <Balance
                    lineHeight="1"
                    color="textSubtle"
                    fontSize="12px"
                    decimals={5}
                    value={
                      parseInt(td?.tokenType)
                        ? td?.paidPayable
                        : getBalanceNumber(td?.paidPayable, td?.token?.decimals ?? 18)
                    }
                  />
                  <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                    {t('Paid Payable')}
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
                <ScanLink href={getBlockExploreLink(td?.token?.address, 'address', chainId)} bold={false} small>
                  {t('View %val% Info', { val: td?.token?.symbol })}
                </ScanLink>
                <Divider />
              </>
            ))}
          </Flex>
        </Flex>
      </ActionContent>
    </ActionContainer>
  )
}

export default HarvestAction
