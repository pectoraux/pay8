import {
  Flex,
  LinkExternal,
  Pool,
  ScanLink,
  Link,
  FlexGap,
  IconButton,
  LanguageIcon,
  TwitterIcon,
  TelegramIcon,
  ProposalIcon,
  SmartContractIcon,
  useModal,
  Text,
  Button,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { Token } from '@pancakeswap/sdk'
import { memo } from 'react'
import { useDispatch } from 'react-redux'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { getBlockExploreLink } from 'utils'
import { setCurrPoolData } from 'state/profile'
import { useCurrPool } from 'state/profile/hooks'
import { useToken } from 'hooks/Tokens'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'

import WebPagesModal from './WebPagesModal'
import ClearAllButton from './ClearAllButton'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'

interface ExpandedFooterProps {
  pool: Pool.DeserializedPool<Token>
  account: string
  showTotalStaked?: boolean
  alignLinksToRight?: boolean
}

const PoolStatsInfo: React.FC<any> = ({ pool, account, currAccount, alignLinksToRight = true }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const dispatch = useDispatch()
  const currState = useCurrPool()
  const tokenAddress = pool?.id || ''
  const firstAccount = pool?.accounts?.length && pool?.accounts[0]?.ownerAddress?.toLowerCase()
  const [onPresentNFT] = useModal(<WebPagesModal height="500px" pool={pool} />)
  const contactChannels = pool?.collection?.contactChannels?.split(',') ?? []
  const contacts = pool?.collection?.contacts?.split(',') ?? []
  console.log('firstAccount============>', firstAccount, pool?.accounts[0]?.ownerAddress)
  return (
    <>
      {/* {pool?.owner && (
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
      )} */}
      {parseInt(pool?.collectionId) ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={`/cancan/collections/${pool?.collectionId}`} bold={false} small>
            {t('See Admin Channel')}
          </LinkExternal>
        </Flex>
      ) : null}
      {firstAccount && firstAccount !== ADDRESS_ZERO ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={`/profile/${firstAccount}`} bold={false} small>
            {t('Open Profile Page')}
          </LinkExternal>
        </Flex>
      ) : null}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNFT} bold={false} small>
          {t('View Profile NFT')}
        </LinkExternal>
      </Flex>
      {account && currAccount?.tokenAddress && (
        <Flex justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <AddToWalletButton
            variant="text"
            p="0"
            height="auto"
            style={{ fontSize: '14px', fontWeight: '400', lineHeight: 'normal' }}
            marginTextBetweenLogo="4px"
            textOptions={AddToWalletTextOptions.TEXT}
            tokenAddress={tokenAddress}
            tokenSymbol={currAccount?.symbol}
            tokenDecimals={currAccount?.decimals}
            tokenLogo={`https://tokens.pancakeswap.finance/images/${tokenAddress}.png`}
          />
        </Flex>
      )}
      {pool.tokens?.length ? (
        <Flex mt="8px" mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <Text color="textSubtle" textTransform="uppercase" bold fontSize="12px">
            {t('Pick a token')}
            <ClearAllButton tokens={false} />
          </Text>
        </Flex>
      ) : null}
      <Flex flexWrap="wrap" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'} alignItems="center">
        {pool.tokens?.map((token) => (
          <Button
            key={token.tokenAddress}
            onClick={() => {
              const newState = { ...currState, [tokenAddress]: token.tokenAddress }
              dispatch(setCurrPoolData(newState))
            }}
            mt="4px"
            mr={['2px', '2px', '4px', '4px']}
            scale="sm"
            variant={currState[tokenAddress] === token.tokenAddress ? 'subtle' : 'tertiary'}
          >
            {token.symbol}
          </Button>
        ))}
      </Flex>
      <Contacts contactChannels={contactChannels} contacts={contacts} />
    </>
  )
}

export default memo(PoolStatsInfo)
