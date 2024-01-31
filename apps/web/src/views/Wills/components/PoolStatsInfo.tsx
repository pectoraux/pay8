import {
  Flex,
  LinkExternal,
  Pool,
  ScanLink,
  Link,
  Text,
  Button,
  AutoRenewIcon,
  ArrowForwardIcon,
  HelpIcon,
  useTooltip,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo, useMemo, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { useCurrBribe, useCurrPool } from 'state/wills/hooks'
import { useAppDispatch } from 'state'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { useRouter } from 'next/router'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'
import { setCurrPoolData, setCurrBribeData } from 'state/wills'
import { format } from 'date-fns'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<any> = ({ pool, account, hideAccounts = false, alignLinksToRight = true }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const currState = useCurrPool()
  const currState2 = useCurrBribe()
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  const earningToken = useMemo(
    () => pool?.tokens?.find((n) => n.tokenAddress === currState2[pool?.id]),
    [pool, currState2],
  )
  const tokenAddress = earningToken?.address || ''
  const {
    days: daysUpdate,
    hours: hoursUpdate,
    minutes: minutesUpdate,
  } = getTimePeriods(Number(pool?.updatePeriod ?? '0'))
  const {
    days: daysWithdrawal,
    hours: hoursWithdrawal,
    minutes: minutesWithdrawal,
  } = getTimePeriods(Number(pool?.willWithdrawalPeriod ?? '0'))
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
  const dispatch = useAppDispatch()

  const TooltipComponent = () => (
    <Text>
      {t(
        'This sets the minimum laps of time in minutes that must seperate each call to the update parameter function from the control panel menu. Calling that function before the update period time elapses will have no effect on any of the parameters except for the profile id.',
      )}
    </Text>
  )
  const TooltipComponent4 = () => (
    <Text>
      {t(
        'This sets the value in minutes of the Will withdrawal countdown period. The countdown can be launched by running the Claim Inheritance function.',
      )}
    </Text>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef4,
    tooltip: tooltip4,
    tooltipVisible: tooltipVisible4,
  } = useTooltip(<TooltipComponent4 />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
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
          {Number(pool?.activePeriod)
            ? format(new Date(parseInt(pool?.activePeriod || 0) * 1000), 'yyyy-MM-dd HH:mm')
            : '-'}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Parameters Updatable At')}
        </Text>
      </Flex>
      <Flex mb="2px" flexDirection="column" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="secondary" fontSize="14px">
          {daysUpdate} {t('days')} {hoursUpdate} {t('hours')} {minutesUpdate} {t('minutes')}
        </Text>
        <Flex ref={targetRef}>
          <Text color="primary" fontSize="14px">
            {t('Update Period')}
          </Text>
          {tooltipVisible && tooltip}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
      </Flex>
      <Flex mb="2px" flexDirection="column" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="secondary" fontSize="14px">
          {Number(pool?.willWithdrawalActivePeriod)
            ? format(new Date(parseInt(pool?.willWithdrawalActivePeriod || 0) * 1000), 'yyyy-MM-dd HH:mm')
            : '-'}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Will Withdrawable At')}
        </Text>
      </Flex>
      <Flex mb="2px" flexDirection="column" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="secondary" fontSize="14px">
          {daysWithdrawal} {t('days')} {hoursWithdrawal} {t('hours')} {minutesWithdrawal} {t('minutes')}
        </Text>
        <Flex ref={targetRef4}>
          <Text color="primary" fontSize="14px">
            {t('Will Withdrawal Period')}
          </Text>
          {tooltipVisible4 && tooltip4}
          <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
        </Flex>
      </Flex>
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
        {pool?.accounts?.length
          ? pool?.accounts.map((balance) => (
              <Button
                key={balance.id}
                onClick={() => {
                  const newState = { ...currState, [pool?.id]: balance.id }
                  dispatch(setCurrPoolData(newState))
                }}
                mt="4px"
                mr={['2px', '2px', '4px', '4px']}
                scale="sm"
                variant={currState[pool?.id] === balance.id ? 'subtle' : 'tertiary'}
              >
                {balance?.id?.split('_')[0]}
              </Button>
            ))
          : null}
        {pool?.accounts?.length ? (
          <Button
            key="clear-all"
            variant="text"
            scale="sm"
            onClick={() => dispatch(setCurrPoolData({}))}
            style={{ whiteSpace: 'nowrap' }}
          >
            {t('Clear')}
          </Button>
        ) : null}
      </Flex>
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
