import {
  Flex,
  LinkExternal,
  AutoRenewIcon,
  ArrowForwardIcon,
  Pool,
  ScanLink,
  Button,
  Link,
  useModal,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo, useState } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { useCurrBribe, useCurrPool } from 'state/lotteries/hooks'
import { useAppDispatch } from 'state'
import { useRouter } from 'next/router'
import { setCurrBribeData, setCurrPoolData } from 'state/lotteries'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'

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
  const { earningToken } = pool
  const tokenAddress = earningToken?.address || ''
  const dispatch = useAppDispatch()
  const currState = useCurrPool()
  const currState2 = useCurrBribe()
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
  const [onPresentNFT] = useModal(<WebPagesModal2 height="500px" pool={pool} />)
  console.log('PoolStatsInfo==========>', pool)
  return (
    <>
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
                  router.push(`/lotteries/${pool?.id}`)
                }}
                color="primary"
              />
            )
          }
          isLoading={pendingTx}
          onClick={() => {
            setPendingTx(true)
            router.push(`/lotteries/${pool?.id}`)
          }}
        >
          {t('View Lottery')}
        </Button>
      </Flex>
      {pool?.owner && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.owner, 'address', chainId)} bold={false} small>
            {t('View Owner Info')}
          </ScanLink>
        </Flex>
      )}
      {pool?.nftPrizes?.map((nftPrize, index) => (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(nftPrize?.tokenAddress, 'address', chainId)} bold={false} small>
            {t('View Prize %val% Contract', { val: index + 1 })}
          </ScanLink>
        </Flex>
      ))}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal href={`/cancan/collections/${pool?.collectionId}`} bold={false} small>
          {t('See Admin Channel')}
        </LinkExternal>
      </Flex>
      {parseInt(pool?.isNFT) ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNFT} bold={false} small>
            {t('View NFT Prize')}
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
        {pool?.tokenData?.length
          ? pool?.tokenData.map((balance) => (
              <Button
                key={balance.token.address}
                onClick={() => {
                  const newState = { ...currState, [pool?.id]: balance.token.address }
                  dispatch(setCurrPoolData(newState))
                }}
                mt="4px"
                mr={['2px', '2px', '4px', '4px']}
                scale="sm"
                variant={currState[pool?.id] === balance.token.address ? 'subtle' : 'tertiary'}
              >
                {balance.token?.symbol?.toUpperCase()}
              </Button>
            ))
          : null}
        {pool?.tokenData?.length ? (
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
        {pool?.users?.length
          ? pool?.users
              .filter((user) => user.account?.toLowerCase() === account?.toLowerCase())
              .map((balance) => (
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
                  {balance.id}
                </Button>
              ))
          : null}
        {pool?.users?.length &&
        pool?.users?.filter((user) => user.account?.toLowerCase() === account?.toLowerCase())?.length ? (
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
