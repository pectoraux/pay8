import { ReactNode } from 'react'
import { Text, Flex, Box, Skeleton, TooltipText, useTooltip, ScanLink } from '@pancakeswap/uikit'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from '@pancakeswap/localization'
import { Ifo, PoolIds } from 'config/constants/types'
import truncateHash from '@pancakeswap/utils/truncateHash'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { format } from 'date-fns'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'

export interface IfoCardDetailsProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  isEligible: boolean
}

export interface FooterEntryProps {
  label: ReactNode
  value: ReactNode
  tooltipContent?: string
}

const FooterEntry: React.FC<any> = ({ label, value, tooltipContent, isAddress = false }) => {
  const { targetRef, tooltip, tooltipVisible } = useTooltip(tooltipContent, { placement: 'bottom-start' })
  const { chainId } = useActiveChainId()

  return (
    <Flex justifyContent="space-between" alignItems="center">
      {tooltipVisible && tooltip}
      {tooltipContent ? (
        <TooltipText ref={targetRef}>
          <Text small color="textSubtle">
            {label}
          </Text>
        </TooltipText>
      ) : (
        <Text small color="textSubtle">
          {label}
        </Text>
      )}
      {value && isAddress ? (
        <ScanLink href={getBlockExploreLink(value, 'address', chainId)} bold={false} small>
          {truncateHash(value, 10, 10)}
        </ScanLink>
      ) : value ? (
        <Text small textAlign="right">
          {value}
        </Text>
      ) : (
        <Skeleton height={21} width={80} />
      )}
    </Flex>
  )
}

const IfoCardDetails: React.FC<any> = ({ status, data }) => {
  const { t } = useTranslation()
  const timeUntil = data?.bid?.length ? (parseInt(data?.bid[1]) + 86400 * 7 * 52) * 1000 : 0

  /* Format end */
  const renderBasedOnIfoStatus = () => {
    return (
      <>
        <FooterEntry label={t('Unique Profile ID:')} value={data?.boughtProfileId} />
        <FooterEntry label={t('Bid Increments:')} value={`${10}%`} />
        {status === 'finished' ? (
          <FooterEntry label={t('Sale Amount:')} value={`${formatNumber(getBalanceNumber(data?.bid[0]), 2, 2)} USD`} />
        ) : null}
        {status === 'finished' ? (
          <FooterEntry label={t('Profile Expires:')} value={format(new Date(timeUntil), 'yyyy-MM-dd HH:mm')} />
        ) : null}
        <FooterEntry label={t('Last Bidder:')} value={data?.bid?.length ? data?.bid[2] : ADDRESS_ZERO} isAddress />
      </>
    )
  }

  return <Box>{renderBasedOnIfoStatus()}</Box>
}

export default IfoCardDetails
