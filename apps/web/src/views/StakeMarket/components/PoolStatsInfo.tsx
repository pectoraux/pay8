import {
  Flex,
  LinkExternal,
  Pool,
  ScanLink,
  useModal,
  Link,
  FlexGap,
  IconButton,
  LanguageIcon,
  TwitterIcon,
  TelegramIcon,
  ProposalIcon,
  SmartContractIcon,
  Text,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo, useMemo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'
import { getStakeMarketAddress, getStakeMarketHeperAddress } from 'utils/addressHelpers'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

import WebPagesModal from './WebPagesModal'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<any> = ({ pool, account, alignLinksToRight = true }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { earningToken } = useMemo(() => {
    return {
      earningToken: pool.earningToken,
      arpAddress: pool.arpAddress,
    }
  }, [pool])
  const tokenAddress = earningToken?.address || ''
  const [onPresentNFTs] = useModal(<WebPagesModal height="500px" nfts={pool?.tokenIds} />)
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
  return (
    <>
      {pool?.owner && pool?.owner !== ADDRESS_ZERO ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.owner, 'address', chainId)} bold={false} small>
            {t('View Owner Info')}
          </ScanLink>
        </Flex>
      ) : null}
      {pool?.owner && pool?.owner !== ADDRESS_ZERO ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={`/profile/${pool?.owner}`} bold={false} small>
            {t('Open Profile Page')}
          </LinkExternal>
        </Flex>
      ) : null}
      {pool?.collection && pool?.collection !== ADDRESS_ZERO ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.collection, 'address', chainId)} bold={false} small>
            {t('View Collection Info')}
          </ScanLink>
        </Flex>
      ) : null}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <ScanLink href={getBlockExploreLink(getStakeMarketAddress(), 'address', chainId)} bold={false} small>
          {t('View StakeMarket Contract')}
        </ScanLink>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <ScanLink href={getBlockExploreLink(getStakeMarketHeperAddress(), 'address', chainId)} bold={false} small>
          {t('View StakeMarketHelper')}
        </ScanLink>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <ScanLink href={getBlockExploreLink(pool?.ve, 'address', chainId)} bold={false} small>
          {t('View Leviathan NFT contract')}
        </ScanLink>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNFTs} bold={false} small>
          {t('View NFTs')}
        </LinkExternal>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Waiting Period')} {`->`} {pool?.waitingPeriod}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Gas Percent')} {`->`} {parseInt(pool?.gasPercent) / 100}%
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Bounty Required')} {`->`} {pool?.bountyRequired ? t('Yes') : t('No')}
        </Text>
      </Flex>
      {pool?.countries ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <Text color="primary" fontSize="14px">
            {t('Country Tags')} {`->`} {pool?.pool?.countries}
          </Text>
        </Flex>
      ) : null}
      {pool?.cities ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <Text color="primary" fontSize="14px">
            {t('City Tags')} {`->`} {pool?.pool?.cities}
          </Text>
        </Flex>
      ) : null}
      {pool?.products ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <Text color="primary" fontSize="14px">
            {t('Stake Tags')} {`->`} {pool?.pool?.products}
          </Text>
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
      {/* <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
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
      </Flex> */}
      <Flex>
        <Contacts contactChannels={contactChannels} contacts={contacts} />
      </Flex>
    </>
  )
}

export default memo(PoolStatsInfo)
