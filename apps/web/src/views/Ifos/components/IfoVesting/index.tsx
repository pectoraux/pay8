import { useMemo, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import Trans from 'components/Trans'
import { Box, Card, CardBody, CardHeader, Flex, Text, Image, Pool } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import { Token } from '@pancakeswap/sdk'
import { PrizesIcon } from 'views/TradingCompetition/svgs'
import { useGetProfileAuctionData } from 'state/profile/hooks'
import { VestingStatus } from './types'
import useFetchVestingData from '../../hooks/vesting/useFetchVestingData'
import StakeVaultButton from '../IfoFoldableCard/StakeVaultButton'

const StyleVestingCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin: 24px 0 0 0;
  align-self: baseline;
  ${({ theme }) => theme.mediaQueries.xl} {
    max-width: 350px;
    margin: -22px 12px 0 12px;
  }
`

const VestingCardBody = styled(CardBody)`
  position: relative;
  z-index: 2;
  overflow-y: auto;
  max-height: 570px;
  padding-bottom: 0;
  border-radius: 0 0 24px 24px;
`

const IfoVestingStatus = {
  [VestingStatus.NOT_TOKENS_CLAIM]: {
    status: VestingStatus.NOT_TOKENS_CLAIM,
    text: <Trans>You have no tokens available for claiming</Trans>,
    imgUrl: '/images/ifos/vesting/not-tokens.svg',
  },
  [VestingStatus.HAS_TOKENS_CLAIM]: {
    status: VestingStatus.HAS_TOKENS_CLAIM,
    text: <Trans>You have tokens available for claiming now!</Trans>,
    imgUrl: '/images/ifos/vesting/in-vesting-period.svg',
  },
  [VestingStatus.ENDED]: {
    status: VestingStatus.ENDED,
    text: <Trans>No vesting token to claim.</Trans>,
    imgUrl: '/images/ifos/vesting/in-vesting-end.svg',
  },
}

interface IfoVestingProps {
  pool: Pool.DeserializedPool<Token>
}

const IfoVesting: React.FC<any> = () => {
  const { t } = useTranslation()
  const { address: account } = useAccount()
  const [isFirstTime, setIsFirstTime] = useState(true)
  const { data, fetchUserVestingData } = useFetchVestingData()

  const { data: auctionData, refetch } = useGetProfileAuctionData()

  useEffect(() => {
    // When switch account need init
    if (account) {
      setIsFirstTime(true)
      fetchUserVestingData()
    }
  }, [account, fetchUserVestingData, setIsFirstTime])

  const cardStatus = useMemo(() => {
    if (account) {
      if (data.length > 0) return IfoVestingStatus[VestingStatus.HAS_TOKENS_CLAIM]
      if (data.length === 0 && !isFirstTime) return IfoVestingStatus[VestingStatus.ENDED]
    }
    return IfoVestingStatus[VestingStatus.NOT_TOKENS_CLAIM]
  }, [data, account, isFirstTime])

  return (
    <StyleVestingCard isActive>
      <CardHeader p="16px">
        <Flex justifyContent="space-between" alignItems="center">
          <Box ml="8px">
            <Text fontSize="24px" color="secondary" bold>
              {t('Unique Profile IDs')}
            </Text>
          </Box>
          <Image
            ml="8px"
            width={64}
            height={64}
            alt="ifo-vesting-status"
            style={{ minWidth: '64px' }}
            src={cardStatus.imgUrl}
          />
        </Flex>
      </CardHeader>
      <VestingCardBody>
        <Flex flexDirection="column">
          <StakeVaultButton refetch={refetch} profileId={auctionData?.boughtProfileId} processAuction />
          <PrizesIcon width={80} height={80} margin="auto" />
          <StakeVaultButton refetch={refetch} profileId={auctionData?.boughtProfileId} create />
          <Text fontSize="14px" color="textSubtle" textAlign="center">
            {t('Participate in an auction to win a Unique Profile ID')}
          </Text>
        </Flex>
      </VestingCardBody>
    </StyleVestingCard>
  )
}

export default IfoVesting
