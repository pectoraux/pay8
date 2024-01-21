import { Flex, LinkExternal, Pool, ScanLink, useModal, Button } from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo } from 'react'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { useCurrPool } from 'state/cards/hooks'
import { useAppDispatch } from 'state'
import { setCurrPoolData } from 'state/cards'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { getCardAddress } from 'utils/addressHelpers'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<any> = ({ pool, account, alignLinksToRight = true }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const currState = useCurrPool()
  const currProtocol = pool?.balances?.find((acct) => acct?.id === currState[pool?.id])
  const earningToken = currProtocol
  const tokenAddress = currProtocol?.tokenAddress || ''
  const dispatch = useAppDispatch()
  return (
    <>
      {pool?.owner && (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <ScanLink href={getBlockExploreLink(pool?.owner, 'address', chainId)} bold={false} small>
            {t('View Owner Info')}
          </ScanLink>
        </Flex>
      )}
      {pool?.owner && pool?.owner !== ADDRESS_ZERO ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={`/profile/${pool?.owner}`} bold={false} small>
            {t('Open Profile Page')}
          </LinkExternal>
        </Flex>
      ) : null}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <ScanLink href={getBlockExploreLink(getCardAddress(), 'address', chainId)} bold={false} small>
          {t('View PayCard Contract')}
        </ScanLink>
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
        {pool?.balances?.map((balance) => (
          <Button
            key={balance.id}
            onClick={() => {
              const newState = { ...currState, [pool.id]: balance.id }
              dispatch(setCurrPoolData(newState))
            }}
            mt="4px"
            mr={['2px', '2px', '4px', '4px']}
            scale="sm"
            variant={currState[pool.id] === balance.id ? 'subtle' : 'tertiary'}
          >
            {balance.symbol}
          </Button>
        ))}
      </Flex>
    </>
  )
}

export default memo(PoolStatsInfo)
