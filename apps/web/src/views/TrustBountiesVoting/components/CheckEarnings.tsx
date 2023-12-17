import { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import {
  Button,
  Heading,
  Text,
  Flex,
  useModal,
  AutoRenewIcon,
  ButtonMenu,
  ButtonMenuItem,
  Input,
  Grid,
  ErrorIcon,
} from '@pancakeswap/uikit'
import { useWeb3React } from '@pancakeswap/wagmi'
import { FetchStatus, LotteryStatus } from 'config/constants/types'
import { useTranslation } from '@pancakeswap/localization'
import { useLottery } from 'state/lottery/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { StyledItemRow } from 'views/Nft/market/components/Filters/ListFilter/styles'
import { useGetEarned } from 'state/trustbounties/hooks'
import ClaimPrizesModal from './ClaimPrizesModal'
import Divider from 'components/Divider'
// import useGetUnclaimedRewards from '../hooks/useGetUnclaimedRewards'

const TicketImage = styled.img`
  height: 60px;
  ${({ theme }) => theme.mediaQueries.sm} {
    height: 100px;
  }
`

const TornTicketImage = styled.img`
  height: 54px;
  ${({ theme }) => theme.mediaQueries.sm} {
    height: 84px;
  }
`

const CheckEarnings = ({ fromStake = false }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  // const {
  //   lotteryData: { status },
  // } = useLottery()
  const [hasCheckedForRewards, setHasCheckedForRewards] = useState(false)
  const [hasRewardsToClaim, setHasRewardsToClaim] = useState(false)
  const [veAddress, setVeAddress] = useState('')
  const [tokenId, setTokenId] = useState('')
  const { earned, tokenAddress, status: fetchStatus, refetch } = useGetEarned(veAddress, tokenId)
  const [onPresentClaimModal] = useModal(
    <ClaimPrizesModal earned={earned} veAddress={veAddress} tokenAddress={tokenAddress} tokenId={tokenId} />,
    false,
  )
  const isFetchingRewards = fetchStatus === FetchStatus.Fetching
  const isCheckNowDisabled = earned?.toString() === '0'

  const fetchAllRewards = () => {
    setHasCheckedForRewards(true)
    refetch()
  }
  console.log('isCheckNowDisabled================>', earned, veAddress, tokenAddress, tokenId, isCheckNowDisabled)
  useEffect(() => {
    if (fetchStatus === FetchStatus.Fetched) {
      // Manage showing unclaimed rewards modal once per page load / once per lottery state change
      if (!hasCheckedForRewards && veAddress && tokenId) {
        setHasRewardsToClaim(parseInt(earned?.toString()) > 0)
      }
      if (hasCheckedForRewards && veAddress && tokenId) {
        if (parseInt(earned?.toString()) > 0) onPresentClaimModal()
      }
    }
  }, [earned, veAddress, tokenId, hasCheckedForRewards, fetchStatus, onPresentClaimModal])

  useEffect(() => {
    // Clear local state on account change, or when lottery isTransitioning state changes
    setHasRewardsToClaim(false)
    setHasCheckedForRewards(false)
  }, [account])

  const getBody = () => {
    if (!account) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <TicketImage src="/images/lottery/ticket-l.png" alt="vote ticket" />
          <Flex mx={['4px', null, '16px']} flexDirection="column" alignItems="center">
            <Heading textAlign="center" color="#F4EEFF">
              {t('Connect your wallet')}
            </Heading>
            <Heading textAlign="center" color="#F4EEFF" mb="24px">
              {t("to check if you've won something!")}
            </Heading>
            <ConnectWalletButton width="190px" />
          </Flex>
          <TicketImage src="/images/lottery/ticket-r.png" alt="vote ticket" />
        </Flex>
      )
    }
    if (hasCheckedForRewards && !hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <TornTicketImage src="/images/lottery/torn-ticket-l.png" alt="torn vote ticket" />
          <Flex mx={['4px', null, '16px']} flexDirection="column">
            <Heading textAlign="center" color="#F4EEFF">
              {t('No winnings to collect')}...
            </Heading>
            <Heading textAlign="center" color="#F4EEFF">
              {t('Use your NFT token to vote on more litigations!')}
            </Heading>
          </Flex>
          <TornTicketImage src="/images/lottery/torn-ticket-r.png" alt="torn vote ticket" />
        </Flex>
      )
    }
    if (hasCheckedForRewards && hasRewardsToClaim) {
      return (
        <Flex alignItems="center" justifyContent="center">
          <TicketImage src="/images/lottery/ticket-l.png" alt="vote ticket" />
          <Flex mx={['4px', null, '16px']} flexDirection="column">
            <Heading textAlign="center" color="#F4EEFF">
              {t('Congratulations!')}
            </Heading>
            <Heading textAlign="center" color="#F4EEFF">
              {t('Why not vote again')}
            </Heading>
          </Flex>
          <TicketImage src="/images/lottery/ticket-r.png" alt="vote ticket" />
        </Flex>
      )
    }
    const checkNowText = () => {
      // if (lotteryIsNotClaimable) {
      //   return `${t('Calculating rewards')}...`
      // }
      if (isFetchingRewards) {
        return t('Checking')
      }
      return t('Check Winnings')
    }
    return (
      <Flex alignItems="center" justifyContent="center">
        <TicketImage src="/images/lottery/ticket-l.png" alt="vote ticket" />
        <Flex mx={['4px', null, '16px']} flexDirection="column">
          <Heading textAlign="center" color="#F4EEFF" mb="24px">
            {t('Did your votes win you any tokens ?')}
          </Heading>
          <Flex mb="24px">
            <Input
              type="text"
              scale="sm"
              value={veAddress}
              placeholder={t('input a Leviathan NFT address')}
              onChange={(e) => setVeAddress(e.target.value)}
            />
          </Flex>
          <Flex mb="24px">
            <Input
              type="text"
              scale="sm"
              value={tokenId}
              placeholder={t('input your Leviathan token id')}
              onChange={(e) => setTokenId(e.target.value)}
            />
          </Flex>
          <Button
            // disabled={isCheckNowDisabled}
            onClick={fetchAllRewards}
            isLoading={isFetchingRewards}
            endIcon={isFetchingRewards ? <AutoRenewIcon color="currentColor" spin /> : null}
          >
            {checkNowText()}
          </Button>
          <Grid gridTemplateColumns="32px 1fr" p="16px" maxWidth="560px">
            <Flex alignSelf="flex-start">
              <ErrorIcon width={24} height={24} color="textSubtle" />
            </Flex>
            <Text small color="#F4EEFF">
              {fromStake
                ? t(
                    "You can win tokens by voting on various litigations. Each litigation is associated with a stake and voting on it will earn you a few of the tokens used in the stake. The amount of tokens you earn depends on the number and type of litigations you vote on. Each litigation has a weight factor associated to it and the more weight a litigation has, the more voting on it either for/against the attacker, earns you. Litigations' weights are displayed on their panels next to the black hammer icon.",
                  )
                : t(
                    "You can win tokens by voting on various litigations. Each litigation is associated with a trustBounty and voting on it will earn you a few of the tokens used as collateral in the trustBounty. In case the collateral is an NFT, you will be earning USD tFIAT tokens. The amount of tokens you earn depends on the number and type of litigations you vote on. Each litigation has a weight factor associated to it and the more weight a litigation has, the more voting on it either for/against the attacker, earns you. Litigations' weights are displayed on their panels next to the black hammer icon.",
                  )}
            </Text>
          </Grid>
        </Flex>
        <TicketImage src="/images/lottery/ticket-r.png" alt="vote ticket" />
      </Flex>
    )
  }

  return <Flex>{getBody()}</Flex>
}

export default CheckEarnings
