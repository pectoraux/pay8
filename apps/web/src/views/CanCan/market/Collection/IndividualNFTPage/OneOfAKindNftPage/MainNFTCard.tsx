import {
  useMatchBreakpoints,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Skeleton,
  Text,
  useModal,
  TabMenu,
  ChevronLeftIcon,
  NextLinkFromReactRouter,
  LinkExternal,
  Heading,
} from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'

import { useRouter } from 'next/router'
import styled from 'styled-components'
import { useColor } from 'hooks/useColor'
import { NftToken } from 'state/cancan/types'
import { CurrencyLogo } from 'components/Logo'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useWorkspaceCurrency } from 'hooks/Tokens'
import { formatNumber, getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import Countdown from 'views/Lottery/components/Countdown'
import ConnectWalletButton from 'components/ConnectWalletButton'
import NFTMedia from 'views/CanCan/market/components/NFTMedia'
import RichTextEditor from 'components/RichText'
import { useState } from 'react'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'
import { useGetOrder } from 'state/cancan/hooks'

import MarketPageTitle from '../../../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../../../components/StatBox'
import BuyModal from '../../../components/BuySellModals/BuyModal'
import SellModal from '../../../components/BuySellModals/SellModal'
import { cancanBaseUrl } from '../../../constants'
import { Container } from '../shared/styles'
import OptionFilters from '../../../components/BuySellModals/BuyModal/OptionFilters'
import { getThumbnailNContent } from 'utils/cancan'
import Timer from './Timer'
import getTimePeriods from '@pancakeswap/utils/getTimePeriods'
import { differenceInSeconds } from 'date-fns'

interface MainNFTCardProps {
  nft: NftToken
  isOwnNft: boolean
  nftIsProfilePic: boolean
  onSuccess: () => void
}

const BackLink = styled(NextLinkFromReactRouter)`
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  display: inline-flex;
  font-weight: 600;
`

const StyledTimerText = styled(Heading)`
  background: ${({ theme }) => theme.colors.gradientGold};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`

const MainNFTCard: React.FC<any> = ({ collection, nft, isOwnNft, nftIsProfilePic, onSuccess }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const isAuction = Number(nft?.bidDuration) > 0
  const collectionId = useRouter().query.collectionAddress as string
  const isPaywall = useRouter().pathname.includes('[collectionAddress]/paywall')
  // const currentAskPriceAsNumber = nft?.currentAskPrice ? parseFloat(nft?.currentAskPrice) : 0
  const {
    mainCurrency,
    secondaryCurrency,
    currentAskPriceAsNumber,
    mainToSecondaryCurrencyFactor,
    priceInSecondaryCurrency,
  } = useWorkspaceCurrency(nft?.ve?.toLowerCase(), nft?.tFIAT, nft?.usetFIAT, nft?.currentAskPrice)
  const { isMobile } = useMatchBreakpoints()
  let { mp4, isArticle } = getThumbnailNContent(nft)
  const [bought, setBought] = useState(false)
  const contactChannels = collection?.contactChannels?.split(',') ?? []
  const contacts = collection?.contacts?.split(',') ?? []
  const { itemColor, textColor } = useColor(nft?.superLikes ?? '0', nft?.superDisLikes ?? '0')
  const askOrder = useGetOrder(nft?.collection?.id, nft?.tokenId)?.data as any
  const bidEndTime = parseInt(askOrder?.lastBidTime?.toString() ?? 0) + parseInt(askOrder?.bidDuration?.toString() ?? 0)
  const bidPrice = !parseInt(askOrder?.lastBidTime?.toString() ?? 0)
    ? currentAskPriceAsNumber
    : currentAskPriceAsNumber +
      (parseInt(askOrder?.minBidIncrementPercentage?.toString()) * currentAskPriceAsNumber) / 10000
  const diff = Math.max(
    differenceInSeconds(new Date(bidEndTime * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days, hours, minutes } = getTimePeriods(diff)

  const isDrop = parseInt(askOrder?.dropinTimer ?? '0')
  const diff2 = Math.max(
    differenceInSeconds(new Date(isDrop * 1000 ?? 0), new Date(), {
      roundingMethod: 'ceil',
    }),
    0,
  )
  const { days: days2, hours: hours2, minutes: minutes2 } = getTimePeriods(diff2)
  const dropInDatePassed = !(days2 || hours2 || minutes2)

  const [onPresentBuyModal] = useModal(
    <BuyModal
      setBought={setBought}
      bidPrice={isAuction ? bidPrice : 0}
      variant={isPaywall ? 'paywall' : 'item'}
      nftToBuy={nft}
    />,
  )
  const [onPresentSellModal] = useModal(
    <SellModal variant={isPaywall ? 'paywall' : 'item'} nftToSell={nft} onSuccessSale={onSuccess} />,
  )
  const ownerButtons = (
    <Flex flexDirection={['column', 'column', 'row']}>
      <Button
        disabled={nftIsProfilePic}
        minWidth="168px"
        mr="16px"
        width={['100%', null, 'max-content']}
        mt="24px"
        onClick={onPresentSellModal}
      >
        {nft?.isTradable ? t('Adjust settings') : t('List for sale')}
      </Button>
    </Flex>
  )
  const options = nft?.options?.map((option, index) => {
    return {
      id: index,
      ...option,
    }
  })
  return (
    <Card mb="40px">
      <CardBody>
        <Container flexDirection={['column-reverse', null, 'row']}>
          <Flex flex="2">
            <Box>
              <BackLink to={`${cancanBaseUrl}/collections/${collectionId}`}>
                <ChevronLeftIcon color="primary" width="24px" />
                {t('All Items')}
              </BackLink>
              <Text fontSize="40px" bold mt="12px">
                {isMobile ? '' : nft.tokenId}
              </Text>
              {isArticle ? (
                <Flex
                  flex="2"
                  justifyContent={['center', null, 'flex-end']}
                  alignItems="center"
                  overflow="auto"
                  maxWidth={isMobile ? 250 : 1000}
                >
                  <RichTextEditor value={mp4} readOnly style={{ width: '120%' }} id="rte" />
                </Flex>
              ) : null}
              <Flex flexDirection="row">
                <Flex flexDirection="column">
                  {nft.description && <Text mt={['16px', '16px', '48px']}>{t(nft.description)}</Text>}
                  {!account ? (
                    <ConnectWalletButton mt={['16px', '16px', '48px']} />
                  ) : nft?.options?.length ? (
                    <Text
                      textTransform="uppercase"
                      mt={['16px', '16px', '48px']}
                      textAlign="center"
                      color="textSubtle"
                      fontSize="12px"
                      bold
                    >
                      {t('Customize your order')}
                    </Text>
                  ) : null}
                  <Flex justifyContent="center" alignItems="center">
                    {account && <OptionFilters address={account} options={options} />}
                  </Flex>
                  {nft?.isTradable ? (
                    <>
                      <Text color="textSubtle" mt={['16px', '16px', '48px']}>
                        {t('Price')}
                      </Text>
                      <Flex alignItems="center" mt="8px">
                        <CurrencyLogo currency={mainCurrency} size="24px" style={{ marginRight: '8px' }} />
                        <Text fontSize="24px" bold mr="4px">
                          {formatNumber(currentAskPriceAsNumber, 0, 18)}
                        </Text>
                        {mainToSecondaryCurrencyFactor && secondaryCurrency ? (
                          <Text color="textSubtle">{`(~${priceInSecondaryCurrency.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })} ${secondaryCurrency?.symbol})`}</Text>
                        ) : (
                          <Skeleton width="64px" />
                        )}
                      </Flex>
                    </>
                  ) : null}

                  {isOwnNft && ownerButtons}
                  {nft?.isTradable && (
                    // {!isOwnNft && nft?.isTradable && (
                    <Flex flexDirection="row" mt="24px">
                      <Button
                        minWidth="168px"
                        disabled={!dropInDatePassed || !account}
                        mr="16px"
                        width={['100%', null, 'max-content']}
                        onClick={onPresentBuyModal}
                      >
                        {isAuction
                          ? t('Bid %bidPrice%', { bidPrice })
                          : !dropInDatePassed
                          ? t('Drop Pending')
                          : isArticle
                          ? t('Tip Writer')
                          : t('Buy')}
                      </Button>
                      {isAuction && parseInt(askOrder?.lastBidTime?.toString() ?? 0) && diff ? (
                        <>
                          <Timer minutes={minutes} hours={hours} days={days} />{' '}
                          <StyledTimerText pt="30px">{t('until last bidder wins')}</StyledTimerText>
                        </>
                      ) : null}
                      {isDrop && (days2 || hours2 || minutes2) ? (
                        <>
                          <StyledTimerText pt="20px" pr="10px">
                            {t('Drops in ')}
                          </StyledTimerText>
                          <Timer minutes={minutes2} hours={hours2} days={days2} />
                        </>
                      ) : null}
                    </Flex>
                  )}
                </Flex>
                {isArticle ? (
                  <NFTMedia
                    key={nft.tokenId}
                    ml={500}
                    style={{ paddingTop: '40%' }}
                    nft={nft}
                    width={240}
                    height={240}
                  />
                ) : null}
              </Flex>
              {bought && !isAuction ? (
                <Flex flexDirection="column" mt="50px">
                  <LinkExternal href="https://paychat.payswap.org" bold textTransform="uppercase">
                    {t('Notify Seller On PayChat or elsewhere!')}
                  </LinkExternal>
                  <Contacts contactChannels={contactChannels} contacts={contacts} />
                </Flex>
              ) : null}
            </Box>
          </Flex>
          {!isArticle ? (
            <Flex flex="2" justifyContent={['center', null, 'flex-end']} alignItems="center" maxWidth={440}>
              <NFTMedia key={nft.tokenId} nft={nft} width={440} height={440} />
            </Flex>
          ) : null}

          {/* <Flex flex="2" ml="50%" style={{ position: 'relative', bottom: '40%'}} justifyContent='flex-end' alignItems="flex-end"  maxWidth={440}> */}
          {/* </Flex> */}
        </Container>
        <MarketPageTitle>
          <StatBox style={{ backgroundColor: itemColor }}>
            <StatBoxItem
              variant={textColor}
              statType="super"
              title={t('SuperLikes')}
              stat={nft?.superLikes ? formatNumber(getBalanceNumber(nft?.superLikes, 18), 0, 5) : '0'}
            />
            <StatBoxItem
              variant={textColor}
              statType="super"
              title={t('SuperDislikes')}
              stat={nft?.superDisLikes ? formatNumber(getBalanceNumber(nft?.superDisLikes, 18), 0, 5) : '0'}
            />
            {!isMobile && (
              <StatBoxItem
                variant={textColor}
                title={t('Likes')}
                stat={nft?.likes ? formatNumber(Number(nft?.likes), 0, 0) : '0'}
              />
            )}
            {!isMobile && (
              <StatBoxItem
                variant={textColor}
                title={t('Dislikes')}
                stat={nft?.dislikes ? formatNumber(Number(nft?.dislikes), 0, 0) : '0'}
              />
            )}
            {/* <StatBoxItem
                variant={textColor}
                title={t('View Count')}
                statType="viewCount"
                stat={nft?.viewCount ? formatNumber(Number(nft?.viewCount), 0, 0) : '0'}
              /> */}
          </StatBox>
        </MarketPageTitle>
      </CardBody>
    </Card>
  )
}

export default MainNFTCard
