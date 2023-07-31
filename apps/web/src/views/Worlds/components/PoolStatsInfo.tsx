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
  FlexGap,
  IconButton,
  LanguageIcon,
  TwitterIcon,
  TelegramIcon,
  ProposalIcon,
  SmartContractIcon,
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
import WebPagesModal from './WebPagesModal'

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
  const { worldAddress } = pool
  const currState = useCurrPool()
  const isBounty = router.pathname.includes('bounties')
  const earningToken = currState[pool?.id]
  const tokenAddress = earningToken?.address || ''
  const dispatch = useAppDispatch()
  const { chainId } = useActiveChainId()
  const [onPresentNFTs] = useModal(<WebPagesModal height="500px" worldNFTs={pool?.worldNFTs} />)
  const [onPresentNotes] = useModal(<WebPagesModal height="500px" worldNFTs={pool?.notes} />)

  return (
    <>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Box>
          <ReactMarkdown>{pool?.collection?.description}</ReactMarkdown>
        </Box>
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
          {t('World Id')} {`->`} {pool?.profileId}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Bounty Id')} {`->`} {pool?.bountyId}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('World Color')} {`->`} {pool?.color ?? ''}
        </Text>
        <Text color="primary" fontSize="14px">
          {t('Trading Fee')} {`->`} {parseInt(pool?.tradingFee) / 100}%
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
      {pool?.rampAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.rampAddress, 'address', chainId)} bold={false} small>
            {t('View Contract')}
          </ScanLink>
        </Flex>
      )}
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
      <Flex>
        <FlexGap gap="16px" pt="24px" pl="4px">
          <IconButton
            as={Link}
            style={{ cursor: 'pointer' }}
            // onClick={onPresentProject}
          >
            <LanguageIcon color="textSubtle" />
          </IconButton>
          <IconButton
            as={Link}
            style={{ cursor: 'pointer' }}
            // onClick={onPresentArticle}
          >
            <ProposalIcon color="textSubtle" />
          </IconButton>
          <IconButton
            as={Link}
            style={{ cursor: 'pointer' }}
            // onClick={onPresentPayChat}
          >
            <SmartContractIcon color="textSubtle" />
          </IconButton>
          {true && (
            <IconButton
              as={Link}
              style={{ cursor: 'pointer' }}
              // onClick={onPresentTwitter}
            >
              <TwitterIcon color="textSubtle" />
            </IconButton>
          )}
          {true && (
            <IconButton
              as={Link}
              style={{ cursor: 'pointer' }}
              // onClick={onPresentTelegram}
            >
              <TelegramIcon color="textSubtle" />
            </IconButton>
          )}
        </FlexGap>
      </Flex>
    </>
  )
}

export default memo(PoolStatsInfo)
