import {
  Flex,
  LinkExternal,
  Text,
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
import { useCurrPool } from 'state/trustbounties/hooks'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { setCurrPoolData } from 'state/trustbounties'
import WebPagesModal from './WebPagesModal'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'

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
  const { earningToken, rampAddress } = pool
  const isBounty = router.pathname.includes('bounties')
  const tokenAddress = earningToken?.address || ''
  const dispatch = useAppDispatch()
  const currState = useCurrPool()
  const [onPresentNFTs] = useModal(<WebPagesModal height="500px" nfts={pool?.nfts} />)
  console.log('onPresentNFTs====================>', pool)
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
  return (
    <>
      <Flex flex="1" flexDirection="column" alignSelf="flex-center">
        <Text color="primary" fontSize="14px">
          {t('Minimum Badge Color')} {`->`} {pool?.minIDBadgeColor}
        </Text>
        {pool?.valueName ? (
          <Text color="primary" fontSize="14px">
            {t('Testimony value')} {`->`} {pool.valueName}
          </Text>
        ) : null}
        {pool?.collection?.workspace ? (
          <Text color="primary" fontSize="14px">
            {t('Workspace')} {`->`} {pool.workspace}
          </Text>
        ) : null}
        {pool?.collection?.countries ? (
          <Text color="primary" fontSize="14px">
            {t('Countries')} {`->`} {pool.collection.countries}
          </Text>
        ) : null}
        {pool?.collection?.cities ? (
          <Text color="primary" fontSize="14px">
            {t('Cities')} {`->`} {pool.collection?.cities}
          </Text>
        ) : null}
        {pool?.collection?.products ? (
          <Text color="primary" fontSize="14px">
            {t('Tags')} {`->`} {pool.collection?.products}
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
      <Contacts contactChannels={contactChannels} contacts={contacts} />
    </>
  )
}

export default memo(PoolStatsInfo)
