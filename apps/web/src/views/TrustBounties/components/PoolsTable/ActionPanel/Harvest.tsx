import styled from 'styled-components'
import { Text, Flex, Box, CopyButton, useMatchBreakpoints, ScanLink, Balance } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import RichTextEditor from 'components/RichText'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useGetBalanceSource, useGetLatestClaim2 } from 'state/trustbounties/hooks'
import { differenceInSeconds } from 'date-fns'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import BigNumber from 'bignumber.js'
import {
  getMarketTradesAddress,
  getNftMarketTradesAddress,
  getPaywallMarketTradesAddress,
  getTrustBountiesAddress,
} from 'utils/addressHelpers'
import { getBlockExploreLink } from 'utils'
import { useActiveChainId } from 'hooks/useActiveChainId'

import { ActionContainer, ActionTitles, ActionContent } from './styles'

const Wrapper = styled(Flex)`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.dropdown};
  border-radius: 16px;
  position: relative;
`

const HarvestAction: React.FunctionComponent<any> = ({ pool }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { isMobile } = useMatchBreakpoints()
  const balance = useGetBalanceSource(pool?.id)
  const claim = useGetLatestClaim2(pool?.id)
  const actionTitle = (
    <Flex flexDirection="row" justifyContent="space-around">
      <Text fontSize="12px" bold color="textSubtle" as="span" textTransform="uppercase">
        {t('Terms')}
      </Text>
      <Wrapper>
        <Text fontSize="12px" bold mb="10px" color="textSubtle" as="span" textTransform="uppercase">
          {t('Owner Address')}
        </Text>
        <CopyButton width="24px" text={pool?.owner} tooltipMessage={t('Copied')} />
      </Wrapper>
      <Wrapper>
        <Text fontSize="12px" bold mb="10px" color="textSubtle" as="span" textTransform="uppercase">
          {t('VeNFT Address')}
        </Text>
        <CopyButton width="24px" text={pool?.ve} tooltipMessage={t('Copied')} />
      </Wrapper>
    </Flex>
  )

  return (
    <ActionContainer>
      <ActionTitles>{actionTitle}</ActionTitles>
      {pool?.terms ? (
        <Flex flex="2" alignItems="center" overflow="auto" maxWidth={isMobile ? 250 : 1000}>
          <RichTextEditor value={pool?.terms} readOnly id="rte" />
        </Flex>
      ) : null}
      {!pool?.terms ? (
        <ActionContent>
          <Text color="failure" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('Update the terms of your bounty so users know when it is legitimate to attack it')}
          </Text>
        </ActionContent>
      ) : null}
      <Box mr="8px" mb="8px" height="32px">
        <Balance
          lineHeight="1"
          color="textSubtle"
          fontSize="12px"
          decimals={pool?.token?.decimals}
          value={getBalanceNumber(new BigNumber(balance?.length ? balance[1]?.toString() : '0'), pool?.token?.decimals)}
        />
        <Text color="textSubtle" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
          {t('Bounty Balance')}
        </Text>
      </Box>
      {pool?.bountyBalances
        ?.filter(
          (bb) =>
            bb.source?.toLowerCase() !== getTrustBountiesAddress()?.toLowerCase() &&
            bb.source?.toLowerCase() !== getMarketTradesAddress()?.toLowerCase() &&
            bb.source?.toLowerCase() !== getNftMarketTradesAddress()?.toLowerCase() &&
            bb.source?.toLowerCase() !== getPaywallMarketTradesAddress()?.toLowerCase(),
        )
        ?.map((bb) => (
          <>
            <Box mr="8px" height="32px">
              <Balance
                lineHeight="1"
                color="textSubtle"
                fontSize="12px"
                decimals={pool?.token?.decimals}
                value={getBalanceNumber(new BigNumber(bb?.amount), pool?.token?.decimals)}
              />
              <Text color="textSubtle" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                {t('Bounty Balance')}
              </Text>
            </Box>
            <Box>
              <ScanLink mb="8px" href={getBlockExploreLink(bb?.source, 'address', chainId)} bold={false} small>
                {t('View Source Info')}
              </ScanLink>
            </Box>
          </>
        ))}
      {claim ? (
        <>
          <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
            {parseInt(claim[6]) === 0 ? t('At Peace') : t('At War')}
          </Text>
          <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
            {t('Latest Claim Status')}
          </Text>
        </>
      ) : null}
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        {pool?.receivedApprovals?.length ? (
          <Text color="primary" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
            {t('APPROVALS')}
          </Text>
        ) : null}
        {pool?.receivedApprovals?.map((approval, index) => {
          const diff = Math.max(
            differenceInSeconds(new Date(parseInt(approval?.endTime) * 1000 ?? 0), new Date(), {
              roundingMethod: 'ceil',
            }),
            0,
          )
          const { days, hours, minutes } = getTimePeriods(diff ?? 0)
          return days || hours || minutes ? (
            <>
              <Box mr="8px" height="32px">
                <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={index} />
                <Text color="textSubtle" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                  {t('Position')}
                </Text>
              </Box>
              <Box mr="8px" height="32px">
                <Balance
                  lineHeight="1"
                  color="textSubtle"
                  fontSize="12px"
                  decimals={pool?.token?.decimals}
                  value={approval?.amount}
                />
                <Text color="textSubtle" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                  {t('Amount Approved')}
                </Text>
              </Box>
              <Box mr="8px" height="32px">
                <Balance lineHeight="1" color="textSubtle" fontSize="12px" decimals={0} value={approval?.bounty?.id} />
                <Text color="textSubtle" fontSize="12px" display="inline" bold as="span" textTransform="uppercase">
                  {t('Approving Bounty')}
                </Text>
              </Box>
              <Text lineHeight="1" fontSize="12px" color="textSubtle" as="span">
                {days} {t('days')} {hours} {t('hours')} {minutes} {t('minutes')}
              </Text>
              <Text color="primary" fontSize="12px" bold as="span" textTransform="uppercase">
                {t('Minutes Before Expiration')}
              </Text>
            </>
          ) : null
        })}
      </Flex>
    </ActionContainer>
  )
}

export default HarvestAction
