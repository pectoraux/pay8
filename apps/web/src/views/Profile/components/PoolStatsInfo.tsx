import { memo } from 'react'
import {
  Flex,
  Link,
  LinkExternal,
  Button,
  Text,
  ReactMarkdown,
  Svg,
  Pool,
  Box,
  TwitterIcon,
  TelegramIcon,
  LanguageIcon,
  IconButton,
  FlexGap,
  ProposalIcon,
  SmartContractIcon,
  useModal,
} from '@pancakeswap/uikit'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useTranslation } from '@pancakeswap/localization'
import { useToken } from 'hooks/Tokens'
import { useAppDispatch } from 'state'
import { setCurrPoolData } from 'state/profile'
import { useCurrPool } from 'state/profile/hooks'

import ClearAllButton from './ClearAllButton'
import WebPagesModal from './WebPagesModal'

interface ExpandedFooterProps {
  pool?: any
  account: string
  alignLinksToRight?: boolean
  showTotalStaked?: any
}

const PoolStatsInfo: React.FC<any> = ({ pool, account, alignLinksToRight = true }) => {
  const { t } = useTranslation()
  const tokenAddress = pool?.id || ''
  const dispatch = useAppDispatch()
  const currState = useCurrPool()
  const earningToken = useToken(currState[tokenAddress])
  const [onPresentNFT] = useModal(<WebPagesModal height="500px" pool={pool} />)

  // const [onPresentPayChat] = useModal(<QuizModal title="PayChat" link="https://matrix.to/#/!aGnoPysxAyEOUwXcJW:matrix.org?via=matrix.org" />)

  return (
    <Flex flexDirection="column" maxHeight="200px" overflow="auto">
      <Box>
        <ReactMarkdown>{pool?.collection?.description}</ReactMarkdown>
      </Box>
      {pool?.collection ? (
        <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
          <LinkExternal href={`/cancan/collections/${pool?.collectionId}`} bold={false} small>
            {t('View Admin Channel')}
          </LinkExternal>
        </Flex>
      ) : null}
      <Flex mb="2px" justifyContent={alignLinksToRight ? 'flex-end' : 'flex-start'}>
        <LinkExternal style={{ cursor: 'pointer' }} onClick={onPresentNFT} bold={false} small>
          {t('View Profile NFT')}
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
            tokenSymbol={earningToken?.symbol}
            tokenDecimals={earningToken?.decimals}
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
    </Flex>
  )
}

export default memo(PoolStatsInfo)
