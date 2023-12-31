import {
  Flex,
  Box,
  LinkExternal,
  AutoRenewIcon,
  ArrowForwardIcon,
  Pool,
  ScanLink,
  useModal,
  Button,
  Link,
  ReactMarkdown,
  Text,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { useCurrPool } from 'state/worlds/hooks'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { setCurrPoolData } from 'state/worlds'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'
import WebPagesModal from './WebPagesModal'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<any> = ({ pool, account, alignLinksToRight = true }) => {
  const { t } = useTranslation()
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  const currState = useCurrPool()
  const earningToken = currState[pool?.id]
  const tokenAddress = earningToken?.address || ''
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const [onPresentNFTs] = useModal(<WebPagesModal height="500px" nfts={pool?.worldNFTs} />)
  const [onPresentNotes] = useModal(<WebPagesModal height="500px" nfts={pool?.worldNotes} />)
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
  return (
    <>
      <Box>
        <ReactMarkdown>{pool?.collection?.description}</ReactMarkdown>
      </Box>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
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
                    router.push(`/worlds/${pool?.worldAddress}`)
                  }}
                  color="primary"
                />
              )
            }
            isLoading={pendingTx}
            onClick={() => {
              setPendingTx(true)
              router.push(`/worlds/${pool?.worldAddress}`)
            }}
          >
            {t('View All Accounts')}
          </Button>
        </Flex>
      </Flex>
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text color="primary" fontSize="14px">
          {t('Bounty Required')} {`->`} {pool?.bountyRequired ? t('True') : t('False')}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('World ID')} {`->`} {pool?.profileId}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Bounty ID')} {`->`} {pool?.bountyId}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Total Code Supply')} {`->`} {pool?.totalSupply}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('World Color')} {`->`} {pool?.color ?? ''}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Trading Fee')} {`->`} {parseInt(pool?.tradingFee) / 100}%
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Price Per Minutes')} {`->`} {getBalanceNumber(pool?.pricePerAttachMinutes)} USD
        </Text>
        {pool?.collection?.countries ? (
          <Text color="primary" fontSize="14px">
            {t('Countries')} {`->`} {pool.collection.countries}
          </Text>
        ) : null}
        {pool?.collection?.cities ? (
          <Text color="primary" fontSize="14px">
            {t('Cities')} {`->`} {pool.collection.cities}
          </Text>
        ) : null}
      </Flex>
      {pool?.owner && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.owner, 'address', chainId)} bold={false} small>
            {t('View Owner Info')}
          </ScanLink>
        </Flex>
      )}
      {pool?.devaddr_ && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.devaddr_, 'address', chainId)} bold={false} small>
            {t('View Admin Info')}
          </ScanLink>
        </Flex>
      )}
      {pool?.id && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.id, 'address', chainId)} bold={false} small>
            {t('View Contract')}
          </ScanLink>
        </Flex>
      )}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/cancan/collections/${pool?.collectionId}`} bold={false} small>
          {t('See Admin Channel')}
        </LinkExternal>
      </Flex>
      {pool?.worldNFTs?.length ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNFTs} bold={false} small>
            {t('View NFTs')}
          </LinkExternal>
        </Flex>
      ) : null}
      {pool?.notes?.length ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNotes} bold={false} small>
            {t('View Notes')}
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
          ? pool?.accounts
              .filter((protocol) => account?.toLowerCase() === protocol?.owner?.toLowerCase())
              .map((balance) => (
                <Button
                  key={balance.id}
                  onClick={() => {
                    const newState = { ...currState, [pool?.id]: balance.protocolId }
                    dispatch(setCurrPoolData(newState))
                  }}
                  mt="4px"
                  mr={['2px', '2px', '4px', '4px']}
                  scale="sm"
                  variant={currState[pool?.id] === balance.protocolId ? 'subtle' : 'tertiary'}
                >
                  {balance.protocolId}
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
      <Contacts contactChannels={contactChannels} contacts={contacts} />
    </>
  )
}

export default memo(PoolStatsInfo)
