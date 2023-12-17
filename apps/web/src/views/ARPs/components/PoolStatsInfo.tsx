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
import { useCurrPool } from 'state/arps/hooks'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { setCurrPoolData } from 'state/arps'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

import WebPagesModal from './WebPagesModal'
import WebPagesModal2 from './WebPagesModal2'

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
  const router = useRouter()
  const [pendingTx, setPendingTx] = useState(false)
  const currState = useCurrPool()
  const earningToken = currState[pool?.id]
  const tokenAddress = earningToken?.address || ''
  const payableNotes = pool?.payableNotes?.filter((note) => note?.owner?.toLowerCase() === account?.toLowerCase())
  const receivableNotes = pool?.receivableNotes?.filter((note) => note?.owner?.toLowerCase() === account?.toLowerCase())
  const dispatch = useAppDispatch()
  const [onPresentNFTs] = useModal(<WebPagesModal height="500px" nfts={pool?.accounts} />)
  // const [onPresentNotes] = useModal(<WebPagesModal height="500px" nfts={pool?.notes} notes />)
  const [onPresentNotes2] = useModal(<WebPagesModal height="500px" nfts={payableNotes} notes />)
  const [onPresentNotes3] = useModal(<WebPagesModal height="500px" nfts={receivableNotes} notes />)
  const [onPresentNFT] = useModal(<WebPagesModal2 height="500px" pool={pool} />)
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
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
      {pool?.id && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.id, 'address', chainId)} bold={false} small>
            {t('View Contract')}
          </ScanLink>
        </Flex>
      )}
      {pool?._ve !== ADDRESS_ZERO && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?._ve, 'address', chainId)} bold={false} small>
            {t('View Leviathan')}
          </ScanLink>
        </Flex>
      )}
      {pool?.valuepool !== ADDRESS_ZERO && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.valuepool, 'address', chainId)} bold={false} small>
            {t('View Valuepool')}
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
      {/* {pool?.notes?.length ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNotes} bold={false} small>
            {t('View Notes')}
          </LinkExternal>
        </Flex>
      ) : null} */}
      {payableNotes?.length ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNotes2} bold={false} small>
            {t('View Payable Notes')}
          </LinkExternal>
        </Flex>
      ) : null}
      {receivableNotes?.length ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNotes3} bold={false} small>
            {t('View Receivable Notes')}
          </LinkExternal>
        </Flex>
      ) : null}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Admin Bounty Required')} {`->`} {parseInt(pool?.adminBountyRequired ?? '0') / 100}%
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Admin Credit Share')} {`->`} {parseInt(pool?.adminCreditShare ?? '0') / 100}%
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Admin Debit Share')} {`->`} {parseInt(pool?.adminDebitShare ?? '0') / 100}%
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Automatic')} {`->`} {pool?.automatic ? t('Yes') : t('No')}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('User Min Bounty Required')} {`->`} {parseInt(pool?.bountyRequired ?? '0') / 100}%
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Buffer Time (minutes)')} {`->`} {parseInt(pool?.bufferTime ?? '0') / 60}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Immutable Contract')} {`->`} {pool?.immutableContract ? t('Yes') : t('No')}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Max Notes Per Protocol')} {`->`} {pool?.maxNotesPerProtocol}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Percentage Based')} {`->`} {pool?.percentages ? t('Yes') : t('No')}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Period (minutes)')} {`->`} {parseInt(pool?.period ?? '0') / 60}
        </Text>
      </Flex>
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <Text color="primary" fontSize="14px">
          {t('Profile Required')} {`->`} {pool?.profileRequired ? t('Yes') : t('No')}
        </Text>
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
            tokenSymbol={earningToken?.symbol}
            tokenDecimals={earningToken?.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
        {pool?.accounts?.length && !hideAccounts
          ? pool?.accounts
              .filter(
                (protocol) =>
                  account?.toLowerCase() === protocol?.owner?.toLowerCase() ||
                  account?.toLowerCase() === pool?.devaddr_?.toLowerCase(),
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
                  {balance.id?.split('_')[0]}
                </Button>
              ))
          : null}
        {pool?.accounts?.length &&
        !hideAccounts &&
        pool?.accounts.filter(
          (protocol) =>
            account?.toLowerCase() === protocol?.owner?.toLowerCase() ||
            account?.toLowerCase() === pool?.devaddr_?.toLowerCase(),
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
