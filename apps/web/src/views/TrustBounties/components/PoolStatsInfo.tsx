import { Flex, LinkExternal, Text, Pool, ScanLink, useModal, Button } from '@pancakeswap/uikit'
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
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'

import WebPagesModal from './WebPagesModal'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { getTrustBountiesAddress } from 'utils/addressHelpers'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'

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
          {pool?.isNFT?.toString() === '0' ? t('FT Bounty') : t('NFT Bounty')}
        </Text>
        {pool?.claims?.length ? (
          <Text color="primary" fontSize="14px">
            {t('Number of claims')} {`->`} {pool?.claims?.length}
          </Text>
        ) : null}
        {pool?.friendlyClaims?.length ? (
          <Text color="primary" fontSize="14px">
            {t('Number of friendly claims')} {`->`} {pool?.friendlyClaims?.length}
          </Text>
        ) : null}
        {pool?.minToClaim ? (
          <Text color="primary" fontSize="14px">
            {t('Claim Fee')} {`->`} {parseInt(pool?.minToClaim) / 100}%
          </Text>
        ) : null}
        {parseInt(pool?.parentBountyId) ? (
          <Text color="primary" fontSize="14px">
            {t('Parent Bounty ID')} {`->`} {pool?.parentBountyId}
          </Text>
        ) : null}
        {pool?.receivedApprovals?.length ? (
          <Text color="primary" fontSize="14px">
            {t('Received Approvals')} {`->`} {pool?.receivedApprovals?.length}
          </Text>
        ) : null}
        {pool?.sentApprovals?.length ? (
          <Text color="primary" fontSize="14px">
            {t('Sent Approvals')} {`->`} {pool?.sentApprovals?.length}
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
      {pool?.tokenAddress && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.tokenAddress, 'address', chainId)} bold={false} small>
            {t('View Collateral Info')}
          </ScanLink>
        </Flex>
      )}
      {pool?.claimableBy && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.claimableBy, 'address', chainId)} bold={false} small>
            {t('Claimable By')} {pool?.claimableBy === ADDRESS_ZERO ? 'Anyone' : ''}
          </ScanLink>
        </Flex>
      )}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <ScanLink href={getBlockExploreLink(getTrustBountiesAddress(), 'address', chainId)} bold={false} small>
          {t('View TrustBounties Contract')}
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
      {pool?.workspaces && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.workspaces, 'address', chainId)} bold={false} small>
            {t('View Workspace Info')}
          </ScanLink>
        </Flex>
      )}
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
