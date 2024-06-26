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
  Box,
  FlexGap,
  IconButton,
  LanguageIcon,
  TwitterIcon,
  TelegramIcon,
  ProposalIcon,
  SmartContractIcon,
  ReactMarkdown,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { useCurrBribe, useCurrPool } from 'state/ramps/hooks'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { setCurrPoolData, setCurrBribeData } from 'state/ramps'
import { getRampHelperAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

import WebPagesModal from './WebPagesModal'
import WebPagesModal2 from './WebPagesModal2'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

export const Contacts: React.FC<any> = ({ contactChannels = [], contacts = [] }) => {
  return (
    <Flex>
      <FlexGap gap="16px" pt="24px" pl="4px">
        {contactChannels?.length > 0 && contactChannels[0] ? (
          <IconButton external as={Link} style={{ cursor: 'pointer' }} href={contacts[0]}>
            <LanguageIcon color="textSubtle" />
          </IconButton>
        ) : null}
        {contactChannels?.length > 1 && contactChannels[1] ? (
          <IconButton as={Link} external style={{ cursor: 'pointer' }} href={`mailto:${contacts[1]}`}>
            <ProposalIcon color="textSubtle" />
          </IconButton>
        ) : null}
        {contactChannels?.length > 2 && contactChannels[2] ? (
          <IconButton as={Link} style={{ cursor: 'pointer' }} onClick={contacts[2]}>
            <SmartContractIcon color="textSubtle" />
          </IconButton>
        ) : null}
        {contactChannels?.length > 3 && contactChannels[3] ? (
          <IconButton as={Link} style={{ cursor: 'pointer' }} onClick={contacts[3]}>
            <TwitterIcon color="textSubtle" />
          </IconButton>
        ) : null}
        {contactChannels?.length > 4 && contactChannels[4] ? (
          <IconButton as={Link} style={{ cursor: 'pointer' }} onClick={contacts[4]}>
            <TelegramIcon color="textSubtle" />
          </IconButton>
        ) : null}
      </FlexGap>
    </Flex>
  )
}

const PoolStatsInfo: React.FC<any> = ({ pool, account, alignLinksToRight = true }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  const { earningToken, rampAddress } = pool
  const tokenAddress = earningToken?.address || ''
  const dispatch = useAppDispatch()
  const currState = useCurrPool()
  const currState2 = useCurrBribe()
  const [onPresentNFTs] = useModal(<WebPagesModal height="500px" nfts={pool?.rampNotes} />)
  const [onPresentNFT] = useModal(<WebPagesModal2 height="500px" pool={pool} />)
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
  return (
    <>
      {pool?.description ? (
        <Box>
          <ReactMarkdown>{pool?.description}</ReactMarkdown>
        </Box>
      ) : null}
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
                  router.push(`/ramps/${rampAddress}`)
                }}
                color="primary"
              />
            )
          }
          isLoading={pendingTx}
          onClick={() => {
            setPendingTx(true)
            router.push(`/ramps/${rampAddress}`)
          }}
        >
          {t('View All Accounts')}
        </Button>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Profile')} {`->`} {pool?.profileId}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Likes')} {`->`} {pool?.likes}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Dislikes')} {`->`} {pool?.dislikes}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Mint Fee')} {`->`} {Number(pool?.mintFee ?? 0) / 100}%
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Burn Fee')} {`->`} {Number(pool?.burnFee ?? 0) / 100}%
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Channels')} {`->`} {pool?.channels}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Ramp Token ID')} {`->`} {pool?.rampTokenId}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Payment Processor Country (PPC)')} {`->`} {pool?.ppc ?? 'N/A'}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('PPC Symbol')} {`->`} {pool?.symbol ?? 'N/A'}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Price Per Attached Minutes')} {`->`} {getBalanceNumber(pool?.pricePerAttachMinutes ?? '0')} USD
        </Text>
      </Flex>
      {pool?.saleTokenSymbol && pool?.saleTokenSymbol?.length ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <Text color="primary" fontSize="14px">
            {t('Ramp Price')} {`->`} {getBalanceNumber(pool?.rampSalePrice ?? '0')} {pool?.saleTokenSymbol}
          </Text>
        </Flex>
      ) : null}
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
      {pool?.rampAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.rampAddress, 'address', chainId)} bold={false} small>
            {t('View Contract')}
          </ScanLink>
        </Flex>
      )}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <ScanLink href={getBlockExploreLink(getRampHelperAddress(), 'address', chainId)} bold={false} small>
          {t('View Ramp Helper Contract')}
        </ScanLink>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/cancan/collections/${pool?.collectionId}`} bold={false} small>
          {t('See Admin Channel')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNFTs} bold={false} small>
          {t('View NFTs')}
        </LinkExternal>
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
            tokenSymbol={earningToken.symbol}
            tokenDecimals={earningToken.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
        {pool?.accounts?.map((balance) => (
          <Button
            key={balance.token.address}
            onClick={() => {
              const newState = { ...currState, [pool.rampAddress]: balance.token.address }
              dispatch(setCurrPoolData(newState))
            }}
            mt="4px"
            mr={['2px', '2px', '4px', '4px']}
            scale="sm"
            variant={currState[pool.rampAddress] === balance.token.address ? 'subtle' : 'tertiary'}
          >
            {balance.token.symbol}
          </Button>
        ))}
      </Flex>
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
        {pool?.rampNotes?.length
          ? pool?.rampNotes
              .filter(
                (protocol) =>
                  account?.toLowerCase() === protocol?.owner?.toLowerCase() ||
                  account?.toLowerCase() === pool?.devaddr_?.toLowerCase(),
              )
              .map((balance) => (
                <Button
                  key={balance.id}
                  onClick={() => {
                    const newState = { ...currState2, [pool?.id]: balance.id }
                    dispatch(setCurrBribeData(newState))
                    onPresentNFT()
                  }}
                  mt="4px"
                  mr={['2px', '2px', '4px', '4px']}
                  scale="sm"
                  variant={currState2[pool?.id] === balance.id ? 'subtle' : 'tertiary'}
                >
                  {balance.id?.split('_')[0]}
                </Button>
              ))
          : null}
        {pool?.rampNotes?.length &&
        pool?.rampNotes.filter(
          (protocol) =>
            account?.toLowerCase() === protocol?.owner?.toLowerCase() ||
            account?.toLowerCase() === pool?.devaddr_?.toLowerCase(),
        )?.length ? (
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
