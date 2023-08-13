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

import WebPagesModal from './WebPagesModal'
import ClearAllButton from './ClearAllButton'
import { useToken } from 'hooks/Tokens'

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
  const earningToken = useToken(currState[tokenAddress])
  console.log('currAccount=============>', currAccount)
  const [onPresentNFT] = useModal(<WebPagesModal height="500px" pool={pool} />)

  return (
    <>
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
      {pool?.collectionId ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={`/cancan/collections/${pool?.collectionId}`} bold={false} small>
            {t('See Admin Channel')}
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
