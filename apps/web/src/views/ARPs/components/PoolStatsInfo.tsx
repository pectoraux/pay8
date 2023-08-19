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
  FlexGap,
  IconButton,
  LanguageIcon,
  TwitterIcon,
  TelegramIcon,
  ProposalIcon,
  SmartContractIcon,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { useCurrPool } from 'state/arps/hooks'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { setCurrPoolData } from 'state/arps'
import WebPagesModal from './WebPagesModal'
import WebPagesModal2 from './WebPagesModal2'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<any> = ({ pool, account, hideAccounts = false, alignLinksToRight = true }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  const currState = useCurrPool()
  const earningToken = currState[pool?.id]
  const tokenAddress = earningToken?.address || ''
  const dispatch = useAppDispatch()
  const [onPresentNFTs] = useModal(<WebPagesModal height="500px" nfts={pool?.accounts} />)
  const [onPresentNotes] = useModal(<WebPagesModal height="500px" nfts={pool?.notes} notes />)
  const [onPresentNFT] = useModal(<WebPagesModal2 height="500px" pool={pool} />)

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
                    router.push(`/arps/${pool?.id}`)
                  }}
                  color="primary"
                />
              )
            }
            isLoading={pendingTx}
            onClick={() => {
              setPendingTx(true)
              router.push(`/arps/${pool?.id}`)
            }}
          >
            {t('View All Accounts')}
          </Button>
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
        <LinkExternal href={`/cancan/collections/${pool?.collectionId}`} bold={false} small>
          {t('See Admin Channel')}
        </LinkExternal>
      </Flex>
      {pool?.accounts?.length ? (
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
            tokenSymbol={earningToken?.symbol}
            tokenDecimals={earningToken?.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
        {pool?.accounts?.length && !hideAccounts
          ? pool?.accounts
              .filter((protocol) => account?.toLowerCase() === protocol?.owner?.toLowerCase())
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
                  {balance.id?.split('_')[0]}
                </Button>
              ))
          : null}
        {pool?.accounts?.length && !hideAccounts ? (
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
