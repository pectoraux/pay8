import {
  Text,
  Flex,
  Box,
  FlexProps,
  useTooltip,
  Button,
  AutoRenewIcon,
  BunnyPlaceholderIcon,
  IfoSkeletonCardTokens,
} from '@pancakeswap/uikit'
import { useEffect } from 'react'
import { useAccount } from 'wagmi'
import { Token } from '@pancakeswap/sdk'
import { Ifo, PoolIds } from 'config/constants/types'
import { PublicIfoData, WalletIfoData } from 'views/Ifos/types'
import { useTranslation } from '@pancakeswap/localization'
import { getBalanceNumber, formatNumber } from '@pancakeswap/utils/formatBalance'
import { TokenImage, TokenPairImage } from 'components/TokenImage'
import { useGetRequiresApproval } from 'state/valuepools/hooks'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useERC20 } from 'hooks/useContract'
import { getProfileHelperAddress } from 'utils/addressHelpers'
import { useToken } from 'hooks/Tokens'

import { EnableStatus } from '../types'
import StakeVaultButton from '../StakeVaultButton'

interface TokenSectionProps extends FlexProps {
  primaryToken?: Token
  secondaryToken?: Token
}

const TokenSection: React.FC<React.PropsWithChildren<TokenSectionProps>> = ({
  primaryToken,
  secondaryToken,
  children,
  ...props
}) => {
  const renderTokenComponent = () => {
    if (!primaryToken) {
      return <BunnyPlaceholderIcon width={32} mr="16px" />
    }

    if (primaryToken && secondaryToken) {
      return (
        <TokenPairImage
          variant="inverted"
          primaryToken={primaryToken}
          height={32}
          width={32}
          secondaryToken={secondaryToken}
          mr="16px"
        />
      )
    }

    return <TokenImage token={primaryToken} height={32} width={32} mr="16px" />
  }

  return (
    <Flex {...props}>
      {renderTokenComponent()}
      <div>{children}</div>
    </Flex>
  )
}

const Label = (props) => <Text bold fontSize="12px" color="secondary" textTransform="uppercase" {...props} />

const Value = (props) => <Text bold fontSize="20px" style={{ wordBreak: 'break-all' }} {...props} />

interface IfoCardTokensProps {
  poolId: PoolIds
  ifo: Ifo
  publicIfoData: PublicIfoData
  walletIfoData: WalletIfoData
  hasProfile: boolean
  isLoading: boolean
  onApprove: () => Promise<any>
  enableStatus: EnableStatus
  criterias?: any
  isEligible?: boolean
}

const OnSaleInfo = ({ token, saleAmount }) => {
  const { t } = useTranslation()
  return (
    <TokenSection primaryToken={token}>
      <Flex flexDirection="column">
        <Label textTransform="uppercase">{t('Auction')}</Label>
        <Value>{`${formatNumber(saleAmount, 2, 2)} USD`}</Value>
        <Text fontSize="14px" color="textSubtle">
          {t('%ratio%% increments', { ratio: 10 })}
        </Text>
      </Flex>
    </TokenSection>
  )
}

const IfoCardTokens: React.FC<any> = ({ data, refetch, isLoading, enableStatus, onApprove, status }) => {
  const { address: account } = useAccount()
  const { t } = useTranslation()
  const bid = data?.bid?.length ? data.bid : []
  const stakingTokenContract = useERC20(DEFAULT_TFIAT)
  const { isRequired: needsApproval, refetch: refetch2 } = useGetRequiresApproval(
    stakingTokenContract,
    account,
    getProfileHelperAddress(),
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(
    t(
      'Sorry, you didn’t contribute enough CAKE to meet the minimum threshold. You didn’t buy anything in this sale, but you can still reclaim your CAKE.',
    ),
    { placement: 'bottom' },
  )

  useEffect(() => {
    refetch2()
  }, [enableStatus])

  const token = useToken(DEFAULT_TFIAT)

  const renderTokenSection = () => {
    if (isLoading) {
      return <IfoSkeletonCardTokens />
    }
    if (!account) {
      console.log('bidbidbid================>', !parseInt(bid[0]))
      return <OnSaleInfo token={token} saleAmount={!parseInt(bid[0]) ? 1000 : getBalanceNumber(bid[0])} />
    }

    let message
    if (status === 'live') {
      return (
        <>
          <TokenSection primaryToken={token}>
            <Label>{t('Auction')}</Label>
            <Value>{`${formatNumber(!parseInt(bid[0]) ? 1000 : getBalanceNumber(bid[0]), 2, 2)} USD`}</Value>
          </TokenSection>
          <Text fontSize="14px" color="textSubtle" pl="48px">
            {t('%ratio%% increments', { ratio: 10 })}
          </Text>
          {message}
          {needsApproval && account ? (
            <Button
              width="100%"
              mt="16px"
              onClick={onApprove}
              isLoading={enableStatus === EnableStatus.IS_ENABLING}
              endIcon={enableStatus === EnableStatus.IS_ENABLING ? <AutoRenewIcon spin color="currentColor" /> : null}
            >
              {t('Enable')}
            </Button>
          ) : (
            <Flex flexDirection="column" alignItems="center">
              <BunnyPlaceholderIcon width={80} mb="16px" />
              <Text fontWeight={600}>{t('You can participate in this auction!')}</Text>
              <Text textAlign="center" fontSize="14px">
                {t('To win this unique Profile ID, you just have to bid higher than the current highest bidder!')}
              </Text>
              <StakeVaultButton refetch={refetch} profileId={data?.boughtProfileId} />
            </Flex>
          )}
        </>
      )
    }

    return (
      <Flex flexDirection="column" alignItems="center">
        <BunnyPlaceholderIcon width={80} mb="16px" />
        <Text fontWeight={600}>{t('This Profile ID has already been sold!')}</Text>
        <Text textAlign="center" fontSize="14px">
          {t('To take this Profile ID over, you need to wait for it to expire!')}
        </Text>
        <Flex alignItems="center" mb="3px">
          <Flex alignItems="center" mr="3px">
            <StakeVaultButton refetch={refetch} profileId={data?.boughtProfileId} updateBid />
          </Flex>
          <StakeVaultButton refetch={refetch} profileId={data?.boughtProfileId} />
        </Flex>
        <Flex alignItems="center">
          <StakeVaultButton refetch={refetch} profileId={data?.boughtProfileId} processAuction />
        </Flex>
      </Flex>
    )
  }
  return (
    <Box>
      {tooltipVisible && tooltip}
      {renderTokenSection()}
    </Box>
  )
}

export default IfoCardTokens
