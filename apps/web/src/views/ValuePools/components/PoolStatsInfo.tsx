import {
  Flex,
  LinkExternal,
  AutoRenewIcon,
  ArrowForwardIcon,
  Pool,
  ScanLink,
  useModal,
  Button,
  Link,
  Text,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { useCurrPool } from 'state/valuepools/hooks'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { setCurrPoolData } from 'state/valuepools'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'
import { formatAmount } from '@pancakeswap/utils/formatInfoNumbers'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import WebPagesModal from './WebPagesModal'
import WebPagesModal2 from './WebPagesModal2'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<any> = ({ pool, account, alignLinksToRight = true }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  const tokenAddress = pool?.id || ''
  const dispatch = useAppDispatch()
  const currState = useCurrPool()
  const [onPresentNFTs] = useModal(<WebPagesModal height="500px" nfts={pool?.tokens} />)
  const [onPresentNFT] = useModal(<WebPagesModal2 height="500px" pool={pool} />)
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
  return (
    <>
      {/* {pool?.description ? <Box><ReactMarkdown>{pool?.description}</ReactMarkdown></Box>:null} */}
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
                  router.push(`/valuepools/${pool?.id}`)
                }}
                color="primary"
              />
            )
          }
          isLoading={pendingTx}
          onClick={() => {
            setPendingTx(true)
            router.push(`/valuepools/${pool?.id}`)
          }}
        >
          {t('View All Accounts')}
        </Button>
      </Flex>
      {pool?.devaddr_ && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.devaddr_, 'address', chainId)} bold={false} small>
            {t('View Admin Info')}
          </ScanLink>
        </Flex>
      )}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/cancan/collections/${pool?.collectionId}`} bold={false} small>
          {t('See Admin Channel')}
        </LinkExternal>
      </Flex>
      {pool?.valuepoolAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.valuepoolAddress, 'address', chainId)} bold={false} small>
            {t('View Valuepool Contract')}
          </ScanLink>
        </Flex>
      )}
      {pool?._va && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?._va, 'address', chainId)} bold={false} small>
            {t('View Valuepool NFT Token Contract')}
          </ScanLink>
        </Flex>
      )}
      {pool?.tokenAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.tokenAddress, 'address', chainId)} bold={false} small>
            {t('View Valuepool Token Contract')}
          </ScanLink>
        </Flex>
      )}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNFTs} bold={false} small>
          {t('View NFTs')}
        </LinkExternal>
      </Flex>
      <Flex flexDirection="column" overflowY="scroll" maxHeight="200px">
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <Text color="primary" fontSize="14px">
            {t('BNPL')} {`->`} {pool.bnpl ? t('Yes') : t('No')}
          </Text>
        </Flex>
        {pool?.lenderFactor ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Lender Factor')} {`->`} {pool.lenderFactor}
            </Text>
          </Flex>
        ) : null}
        {pool?.maxDueReceivable ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Max Due Receivable')} {`->`} {pool.maxDueReceivable}
            </Text>
          </Flex>
        ) : null}
        {pool?.maxWithdrawable ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Max Withdrawable')} {`->`} {pool.maxWithdrawable}
            </Text>
          </Flex>
        ) : null}
        {pool?.merchantMinIDBadgeColor ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Merchant Min ID Badge Color')} {`->`} {pool.merchantMinIDBadgeColor}
            </Text>
          </Flex>
        ) : null}
        {pool?.merchantValueName ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Merchant ValueName')} {`->`} {pool.merchantValueName}
            </Text>
          </Flex>
        ) : null}
        {pool?.requiredIndentity ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Required Indentity')} {`->`} {pool.requiredIndentity}
            </Text>
          </Flex>
        ) : null}
        {pool?.queueDuration ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Queue Duration')} {`->`} {pool.queueDuration}
            </Text>
          </Flex>
        ) : null}
        {pool?.minTicketPrice ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Min Ticket Price')} {`->`} {pool.minTicketPrice}
            </Text>
          </Flex>
        ) : null}
        {pool?.minToSwitch ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Min To Switch')} {`->`} {pool.minToSwitch}
            </Text>
          </Flex>
        ) : null}
        {pool?.vaName ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('NFT Name')} {`->`} {pool.vaName}
            </Text>
          </Flex>
        ) : null}
        {pool?.vaSymbol ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('NFT Symbol')} {`->`} {pool.vaSymbol}
            </Text>
          </Flex>
        ) : null}
        {pool?.vaDecimals ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('NFT Decimals')} {`->`} {pool.vaDecimals}
            </Text>
          </Flex>
        ) : null}
        {pool?.maxSupply ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Max Supply')} {`->`} {getBalanceNumber(pool.maxSupply, parseInt(pool.vaDecimals))}
            </Text>
          </Flex>
        ) : null}
        {pool?.supply ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Current Supply')} {`->`} {getBalanceNumber(pool.supply, parseInt(pool.vaDecimals))}
            </Text>
          </Flex>
        ) : null}
        {pool?.minBountyRequired ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Min Bounty Required')} {`->`} {pool.minBountyRequired}
            </Text>
          </Flex>
        ) : null}
        {pool?.minDifference ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Min Difference')} {`->`} {pool.minDifference}
            </Text>
          </Flex>
        ) : null}
        {pool?.minPeriod ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Min Period')} {`->`} {pool.minPeriod}
            </Text>
          </Flex>
        ) : null}
        {pool?.minReceivable ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Min Receivable')} {`->`} {pool.minReceivable}
            </Text>
          </Flex>
        ) : null}
        {pool?.minimumLockValue ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Min Lock Value')} {`->`} {pool.minimumLockValue}
            </Text>
          </Flex>
        ) : null}
        {pool?.minimumSponsorPercentile ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Min Sponsor Percentile')} {`->`} {pool.minimumSponsorPercentile}
            </Text>
          </Flex>
        ) : null}
        {pool?.period ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Period')} {`->`} {pool.period}
            </Text>
          </Flex>
        ) : null}
        {pool?.voteOption ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Vote Option')} {`->`} {pool.voteOption}
            </Text>
          </Flex>
        ) : null}
        {pool?.riskpool ? (
          <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
            <Text color="primary" fontSize="14px">
              {t('Is Riskpool?')} {`->`} {pool.riskpool ? t('Yes') : t('No')}
            </Text>
          </Flex>
        ) : null}
      </Flex>
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
            tokenSymbol={pool?.token?.symbol}
            tokenDecimals={pool?.token?.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
        {pool?.tokens?.length
          ? pool.tokens
              .filter(
                (token) =>
                  account?.toLowerCase() === pool?.devaddr_?.toLowerCase() ||
                  account?.toLowerCase() === token?.owner?.toLowerCase(),
              )
              .map((balance) => (
                <Button
                  key={balance.id}
                  onClick={() => {
                    const newState = { ...currState, [pool?.id]: balance.id }
                    dispatch(setCurrPoolData(newState))
                    onPresentNFT()
                  }}
                  mt="4px"
                  mr={['2px', '2px', '4px', '4px']}
                  scale="sm"
                  variant={currState[pool?.id] === balance.id ? 'subtle' : 'tertiary'}
                >
                  {balance.tokenId}
                </Button>
              ))
          : null}
        {pool?.tokens?.filter(
          (token) =>
            account?.toLowerCase() === pool?.devaddr_?.toLowerCase() ||
            account?.toLowerCase() === token?.owner?.toLowerCase(),
        )?.length ? (
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
      <Contacts contactChannels={contactChannels} contacts={contacts} />
    </>
  )
}

export default memo(PoolStatsInfo)
