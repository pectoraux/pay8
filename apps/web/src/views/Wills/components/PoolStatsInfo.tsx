import {
  Flex,
  LinkExternal,
  Pool,
  ScanLink,
  Link,
  Text,
  FlexGap,
  IconButton,
  LanguageIcon,
  TwitterIcon,
  TelegramIcon,
  ProposalIcon,
  SmartContractIcon,
  Button,
  AutoRenewIcon,
  ArrowForwardIcon,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo, useMemo, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { useCurrBribe } from 'state/wills/hooks'
import { useAppDispatch } from 'state'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useRouter } from 'next/router'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'
import { setCurrBribeData, setCurrPoolData } from 'state/wills'
import { useCurrPool } from 'state/wills/hooks'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<any> = ({
  pool,
  account,
  currAccount,
  hideAccounts = false,
  alignLinksToRight = true,
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const currState2 = useCurrBribe()
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  const earningToken = useMemo(
    () => pool?.tokens?.find((n) => n.tokenAddress === currState2[pool?.id]),
    [pool, currState2],
  )
  const tokenAddress = earningToken?.address || ''
  const {
    days: daysActive,
    hours: hoursActive,
    minutes: minutesActive,
  } = getTimePeriods(Number(pool?.activePeriod ?? '0'))
  const {
    days: daysUpdate,
    hours: hoursUpdate,
    minutes: minutesUpdate,
  } = getTimePeriods(Number(pool?.updatePeriod ?? '0'))
  const {
    days: daysWithdrawalActive,
    hours: hoursWithdrawalActive,
    minutes: minutesWithdrawalActive,
  } = getTimePeriods(Number(pool?.willWithdrawalActivePeriod ?? '0'))
  const {
    days: daysWithdrawal,
    hours: hoursWithdrawal,
    minutes: minutesWithdrawal,
  } = getTimePeriods(Number(pool?.willWithdrawalPeriod ?? '0'))
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
  const currState = useCurrPool()
  const dispatch = useAppDispatch()
  return (
    <>
      {!hideAccounts ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <Button
            as={Link}
            variant="text"
            p="0"
            height="auto"
            color="primary"
            endIcon={
              pendingTx ? (
                <AutoRenewIcon spin color="currentColor" />
              ) : (
                <ArrowForwardIcon
                  onClick={() => {
                    setPendingTx(true)
                    router.push(`/wills/${pool?.id}`)
                  }}
                  color="primary"
                />
              )
            }
            isLoading={pendingTx}
            onClick={() => {
              setPendingTx(true)
              router.push(`/wills/${pool?.id}`)
            }}
          >
            {t('View All Accounts')}
          </Button>
        </Flex>
      ) : null}
      <Flex mb="2px" flexDirection="column" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="secondary" fontSize="14px">
          {daysActive} {t('days')} {hoursActive} {t('hours')} {minutesActive} {t('minutes')}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Active Period')}
        </Text>
      </Flex>
      <Flex mb="2px" flexDirection="column" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="secondary" fontSize="14px">
          {daysUpdate} {t('days')} {hoursUpdate} {t('hours')} {minutesUpdate} {t('minutes')}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Update Period')}
        </Text>
      </Flex>
      <Flex mb="2px" flexDirection="column" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="secondary" fontSize="14px">
          {daysWithdrawalActive} {t('days')} {hoursWithdrawalActive} {t('hours')} {minutesWithdrawalActive}{' '}
          {t('minutes')}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Will Withdrawal Active Period')}
        </Text>
      </Flex>
      <Flex mb="2px" flexDirection="column" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="secondary" fontSize="14px">
          {daysWithdrawal} {t('days')} {hoursWithdrawal} {t('hours')} {minutesWithdrawal} {t('minutes')}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Will Withdrawal Period')}
        </Text>
      </Flex>
      {pool?.contractMedia ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <Text color="primary" fontSize="14px">
            {t('Contract Media')} {`->`} {pool.contractMedia}
          </Text>
        </Flex>
      ) : null}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Unlocked')} {`->`} {pool.unlocked ? t('Yes') : t('No')}
        </Text>
      </Flex>
      {pool?.collection?.owner && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.collection?.owner, 'address', chainId)} bold={false} small>
            {t('View Owner Info')}
          </ScanLink>
        </Flex>
      )}
      {pool?.willAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.willAddress, 'address', chainId)} bold={false} small>
            {t('View Contract')}
          </ScanLink>
        </Flex>
      )}
      {pool?.collection ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={`/cancan/collections/${pool?.collection?.id}`} bold={false} small>
            {t('See Admin Channel')}
          </LinkExternal>
        </Flex>
      ) : null}
      {account && tokenAddress && (
        <Flex justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <AddToWalletButton
            variant="text"
            p="0"
            height="auto"
            style={{ fontSize: '14px', fontWeight: '400', lineHeight: 'normal' }}
            marginTextBetweenLogo="4px"
            textOptions={AddToWalletTextOptions.TEXT}
            tokenAddress={tokenAddress}
            tokenSymbol={earningToken.symbol}
            tokenDecimals={earningToken.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
        {pool?.tokens?.length
          ? pool?.tokens.map((balance) => (
              <Button
                key={balance.id}
                onClick={() => {
                  const newState = { ...currState2, [pool?.id]: balance.id }
                  dispatch(setCurrBribeData(newState))
                }}
                mt="4px"
                mr={['2px', '2px', '4px', '4px']}
                scale="sm"
                variant={currState2[pool?.id] === balance.id ? 'subtle' : 'tertiary'}
              >
                {balance.symbol}
              </Button>
            ))
          : null}
        {pool?.tokens?.length ? (
          <Button
            key="clear-all"
            variant="text"
            scale="sm"
            onClick={() => dispatch(setCurrBribeData({}))}
            style={{ whiteSpace: 'nowrap' }}
          >
            {t('Clear')}
          </Button>
        ) : null}
      </Flex>
      <Contacts contactChannels={contactChannels} contacts={contacts} />
    </>
  )
}

export default memo(PoolStatsInfo)
