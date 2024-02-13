import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  BunnyPlaceholderIcon,
  Spinner,
  LinkExternal,
  Input,
  Link,
  AutoRenewIcon,
  Button,
  Flex,
  Grid,
  Text,
  useModal,
  Dots,
  HelpIcon,
  useTooltip,
  Balance,
  TabMenu,
  CardBody,
  NextLinkFromReactRouter,
  Box,
} from '@pancakeswap/uikit'
// eslint-disable-next-line lodash/import-scope
import { orderBy } from 'lodash'
import { Collection } from 'state/cancan/types'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import {
  useGetPaywallARP,
  useGetSubscriptionStatus,
  useGetNftShowOnlyUsers,
  useGetNftShowOnlyOnSale,
  useGetNftShowSearch,
  useGetProtocolInfo,
  useGetNftFilters,
} from 'state/cancan/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CollapsibleCard from 'components/CollapsibleCard'
import { FetchStatus } from 'config/constants/types'
import NFTMedia from 'views/CanCan/market/components/NFTMedia'
import Divider from 'components/Divider'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import latinise from '@pancakeswap/utils/latinise'
import { selectFilteredData } from 'state/cancan/selectors'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import { useCurrency } from 'hooks/Tokens'
import { convertTimeToSeconds } from 'utils/timeHelper'
import { format } from 'date-fns'
import { getBalanceNumber } from '@pancakeswap/utils/formatBalance'
import CopyAddress from 'views/FutureCollaterals/components/PoolsTable/ActionPanel/CopyAddress'
import truncateHash from '@pancakeswap/utils/truncateHash'

import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard, CollectionCard } from '../../components/CollectibleCard'
import { useCollectionNfts } from '../../hooks/useCollectionNfts'
import { BNBAmountLabel, CostLabel, MetaRow, StyledCollectibleCard } from '../../components/CollectibleCard/styles'
import BuyModal from '../../components/BuySellModals/BuyModal'
import ShipStage from '../../components/BuySellModals/SellModal/ShipStage'

import OptionFilters from '../../components/BuySellModals/BuyModal/OptionFilters'
import { cancanBaseUrl } from '../../constants'
import AddReferralModal from '../AddReferralModal'
import CloseReferralModal from '../CloseReferralModal'
import AddItemModal from '../AddItemModal'
import AddPartnerModal from '../AddPartnerModal'
import RemoveItemModal from '../RemoveItemModal'
import SubscribeModal from '../SubscribeModal'
import UnregisterModal from '../UnregisterModal'
import Partners from './Partners'
import CreateGaugeModal from './CreateGaugeModal'
import { RoundedImage } from '../IndividualNFTPage/shared/styles'
import PreviewImage from '../../components/CollectibleCard/PreviewImage'
import ProductDetailsSection from '../../components/CollectibleCard/ProductDetailsSection'

interface CollectionNftsProps {
  collection: Collection
  displayText: string
}

const CollectionNfts: React.FC<any> = ({ collection, displayText }) => {
  const { owner, id } = collection || {}
  const { t } = useTranslation()
  const { nfts: __nfts, isFetchingNfts, page, setPage, resultSize, isLastPage } = useCollectionNfts(id)
  const showSearch = useGetNftShowSearch(id)
  const showOnlyNftsUsers = useGetNftShowOnlyUsers(id)
  const showOnlyNftsOnSale = useGetNftShowOnlyOnSale(id)
  const [currentPartner, setCurrentPartner] = useState(null)
  const [userCollectionId, setUserCollectionId] = useState(null)
  const [userBountyId, setUserBountyId] = useState(null)
  const [onPresentUnregister] = useModal(
    <UnregisterModal collectionId={id} userBountyId={userBountyId} userCollectionId={userCollectionId} />,
  )
  const handleLoadMore = useCallback(() => {
    setPage(page + 1)
  }, [setPage, page])
  const filters = useGetNftFilters(id ?? '') as any
  const _nfts = selectFilteredData(__nfts, filters)
  const nfts = useMemo(() => {
    const newests = orderBy(_nfts, (nft) => (nft?.updatedAt ? Date.parse(nft.updatedAt) : 0), 'desc')
    const newData = newests.filter((newest: any) => {
      if (showSearch) {
        const lowercaseQuery = latinise(showSearch.toLowerCase())
        return (
          latinise(newest?.id?.toLowerCase()).includes(lowercaseQuery) ||
          latinise(newest?.description?.toLowerCase()).includes(lowercaseQuery)
        )
      }
      return newest
    })
    return newData
  }, [_nfts, showSearch])

  if (isFetchingNfts) {
    return <GridPlaceholder />
  }

  return (
    <>
      <Flex p="16px">
        <Text bold>
          {!Number.isNaN(resultSize) ? (
            <>
              {displayText}
              {' -> '}
              {showOnlyNftsUsers
                ? collection.registrations?.filter((registration) => registration.active)?.length
                : resultSize}{' '}
              {t('Result(s)')}
            </>
          ) : (
            <Dots>{t('Loading')}</Dots>
          )}
        </Text>
      </Flex>
      {!showOnlyNftsOnSale && // not partners
        !showOnlyNftsUsers && // not users
        collection?.paywalls?.map((paywall) => {
          const mirrors = paywall?.mirrors.filter(
            (mirror) =>
              !!mirror.sharedPaywall &&
              Number(mirror.endTime) * 1000 > Date.now() &&
              mirror?.sharedPaywall?.id !== paywall?.id,
          )
          return (
            <>
              <CollapsibleCard
                key={paywall.id}
                paywall={paywall}
                collection={collection}
                title={`${paywall?.tokenId} -> ${paywall?.mirrors?.length} ${t('Result(s)')}`}
                mb="32px"
              >
                <Paywall collection={collection} paywall={paywall} />
                {mirrors?.length ? <Partners mirrors={mirrors} /> : null}
              </CollapsibleCard>
            </>
          )
        })}
      {nfts.length > 0 && !showOnlyNftsOnSale && !showOnlyNftsUsers ? (
        <>
          <Grid
            gridGap="16px"
            gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
            alignItems="start"
          >
            {nfts.map((nft: any) => {
              const currentAskPriceAsNumber = nft && parseFloat(nft?.currentAskPrice)

              return (
                <CollectibleLinkCard
                  key={nft?.tokenId}
                  nft={nft}
                  referrer={owner?.toLowerCase() !== nft?.currentSeller?.toLowerCase() && nft?.currentSeller}
                  currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
                />
              )
            })}
          </Grid>
          <Flex mt="60px" mb="12px" justifyContent="center">
            {!isLastPage && (
              <Button
                onClick={handleLoadMore}
                scale="sm"
                disabled={isFetchingNfts}
                endIcon={isFetchingNfts ? <AutoRenewIcon spin color="currentColor" /> : undefined}
              >
                {isFetchingNfts ? t('Loading') : t('Load more')}
              </Button>
            )}
          </Flex>
        </>
      ) : showOnlyNftsOnSale && collection.partnerRegistrations?.length > 0 ? (
        <>
          {showOnlyNftsOnSale && currentPartner ? (
            <CollapsibleCard
              key={currentPartner.id}
              title={`${currentPartner.partnerCollection.name} -> ${
                currentPartner.mirrors?.filter((mirror) => !mirror.partner)?.length ?? 0
              } ${t('Result(s)')}`}
              mb="32px"
            >
              <Content owner={collection.owner} referrerFee={collection?.referrerFee} registration={currentPartner} />
            </CollapsibleCard>
          ) : null}
          <Grid mb="64px" gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}>
            {collection.partnerRegistrations
              .filter((registration) => registration.active && registration.partnerCollection?.id)
              .map((registration) => {
                return (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                  <div
                    onClick={() => {
                      if (currentPartner && currentPartner.id === registration.id) {
                        setCurrentPartner(null)
                      } else {
                        setCurrentPartner(registration)
                      }
                    }}
                  >
                    <CollectionCard
                      key={registration.partnerCollection?.id}
                      bgSrc={registration.partnerCollection?.small}
                      avatarSrc={registration.partnerCollection?.avatar}
                      collectionName={registration.partnerCollection?.name}
                    >
                      <Flex alignItems="center">
                        <Text fontSize="12px" color="textSubtle">
                          {t('Volume')}
                        </Text>
                        <BNBAmountLabel
                          amount={
                            registration.partnerCollection.totalVolumeBNB
                              ? parseFloat(registration.partnerCollection.totalVolumeBNB)
                              : 0
                          }
                        />
                      </Flex>
                      <Flex mb="2px" justifyContent="flex-end">
                        <LinkExternal href={`${cancanBaseUrl}/collections/${registration.partnerCollection.id}`} small>
                          {t('See Channel')}
                        </LinkExternal>
                      </Flex>
                    </CollectionCard>
                  </div>
                )
              })}
          </Grid>
        </>
      ) : showOnlyNftsUsers && collection.registrations?.filter((registration) => registration.active)?.length > 0 ? (
        <Grid
          gridGap="16px"
          gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
          alignItems="start"
        >
          {collection.registrations
            .filter((registration) => registration.active)
            .map((registration) => {
              return (
                <StyledCollectibleCard>
                  <CardBody p="8px" style={{ background: 'white' }}>
                    <RoundedImage
                      width={320}
                      height={320}
                      src={registration.userCollection?.avatar}
                      as={PreviewImage}
                    />
                    <Flex flexDirection="row" justifyContent="space-evenly">
                      <CopyAddress account={registration.userCollection?.owner} title={t('User Address')} mb="24px" />
                      <Button
                        onClick={() => {
                          setUserCollectionId(registration.userCollection?.id)
                          setUserBountyId(registration.bountyId)
                          onPresentUnregister()
                        }}
                        mt="10px"
                        scale="xs"
                        style={{ cursor: 'pointer', backgroundColor: 'red' }}
                      >
                        {t('Unregister')}
                      </Button>
                    </Flex>
                    <NextLinkFromReactRouter to={`/cancan/collections/${registration.userCollection?.id}`}>
                      <Text as="h4" fontWeight="600">
                        {registration.userCollection?.name}
                      </Text>
                      <Box borderTop="1px solid" borderTopColor="cardBorder" pt="8px">
                        {registration.userCollection?.totalVolumeBNB && (
                          <MetaRow title={t('Volume')}>
                            <Flex alignItems="center">
                              <Text fontSize="12px" color="textSubtle">
                                {registration.userCollection?.totalVolumeBNB.toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </Text>
                            </Flex>
                          </MetaRow>
                        )}
                      </Box>
                    </NextLinkFromReactRouter>
                  </CardBody>
                  <ProductDetailsSection
                    key={registration.userCollection?.id}
                    paywall={registration.userCollection}
                    isUser
                  />
                </StyledCollectibleCard>
              )
            })}{' '}
        </Grid>
      ) : (
        <Flex alignItems="center" py="48px" flexDirection="column">
          <BunnyPlaceholderIcon width="96px" mb="24px" />
          <Text fontWeight={600}>{t('No items found')}</Text>
        </Flex>
      )}
    </>
  )
}

const Content: React.FC<any> = ({ owner, referrerFee, registration }) => {
  const { t } = useTranslation()
  const [onPresentAddReferral] = useModal(<AddReferralModal referrerFee={referrerFee} registration={registration} />)
  const [onPresentCloseReferral] = useModal(<CloseReferralModal registration={registration} />)

  return registration.mirrors?.length > 0 ? (
    <Flex flexDirection="column">
      <Flex flexDirection="row" justifyContent="center">
        <Button mt="5px" onClick={onPresentAddReferral}>
          {t('Add')}
        </Button>
        <Button mt="5px" variant="danger" ml="18px" onClick={onPresentCloseReferral}>
          {t('Remove')}
        </Button>
      </Flex>
      <Grid
        style={{ padding: '20px' }}
        gridGap="16px"
        gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
        alignItems="start"
      >
        {registration.mirrors?.map((reg) => {
          const nft = reg.item || reg.paywall
          const currentAskPriceAsNumber = nft && parseFloat(nft?.currentAskPrice)
          return (
            <CollectibleLinkCard
              key={nft?.tokenId}
              nft={nft}
              isPaywall={!!reg.paywall}
              referrer={owner}
              currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
            />
          )
        })}
      </Grid>
    </Flex>
  ) : (
    <Flex alignItems="center" py="48px" flexDirection="column">
      <BunnyPlaceholderIcon width="96px" mb="24px" />
      <Button onClick={onPresentAddReferral}>{t('Add')}</Button>
      <Text fontWeight={600}>{t('This wall is empty')}</Text>
    </Flex>
  )
}

const Paywall: React.FC<any> = ({ collection, paywall }) => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const paywallARP = useGetPaywallARP(paywall?.collection?.id ?? '', paywall?.tokenId ?? '') as any
  const [nfticketId, setNfticketId] = useState('')
  const defaultCurrency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(defaultCurrency)
  const handleInputSelect = useCallback((currencyInput) => {
    setCurrency(currencyInput)
  }, [])
  const { ongoingSubscription, status, refetch } = useGetSubscriptionStatus(
    paywallARP?.paywallAddress ?? '',
    account ?? '',
    nfticketId ?? '0',
    paywall?.tokenId ?? '',
  )
  const {
    protocolInfo,
    dueReceivables,
    profileIdRequired,
    paused,
    pricePerSecond,
    bufferTime,
    protocolId,
    subscription,
  } = useGetProtocolInfo(paywallARP?.paywallAddress ?? '', account, paywall?.tokenId ?? '')
  const isAdmin = paywall?.currentSeller?.toLowerCase() === account?.toLowerCase()
  const [onPresentAddItem] = useModal(<AddItemModal collection={collection} paywall={paywall} />)
  const [onPresentAddItem2] = useModal(<AddItemModal partner collection={collection} paywall={paywall} />)
  const [onPresentShip] = useModal(
    <ShipStage variant="product" collection={collection} currency={currency} paywallId={paywall?.id} />,
  )
  const [openPresentControlPanel] = useModal(
    <CreateGaugeModal
      isAdmin={isAdmin}
      pool={paywall}
      paywallARP={paywallARP}
      currency={currency}
      paused={paused}
      protocolId={protocolId}
      subscription={subscription}
      profileRequired={profileIdRequired}
      pricePerSecond={pricePerSecond}
      bufferTime={bufferTime}
    />,
  )
  const [onPresentPartner] = useModal(
    <AddPartnerModal partner collection={collection} paywall={paywall} paywallARP={paywallARP} />,
  )
  const [onPresentRemoveItem] = useModal(<RemoveItemModal collection={collection} paywall={paywall} />)
  const [onPresentSubscribe] = useModal(<SubscribeModal collection={collection} paywall={paywall} />)
  const [onPresentBuySubscription] = useModal(<BuyModal variant="paywall" nftToBuy={paywall} />)

  const options = paywall?.options?.map((option, index) => {
    return {
      id: index,
      ...option,
    }
  })

  useEffect(() => {
    refetch()
  }, [paywallARP, nfticketId, account, paywall, refetch])

  const TooltipComponent = () => (
    <Text>
      {t(
        'You need to input the id of the NFTicket you got after buying this subscription, so the paywall can check if you have an ongoing subscription or not. In the case you do, it will load the content behind the paywall.',
      )}
    </Text>
  )
  const TooltipComponent2 = () => (
    <Text>
      {t(
        "This is the paywall's media and it can be either an image or a video. Its purpose is to convince users to subscribe to the paywall.",
      )}
    </Text>
  )
  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })
  const {
    targetRef: targetRef2,
    tooltip: tooltip2,
    tooltipVisible: tooltipVisible2,
  } = useTooltip(<TooltipComponent2 />, {
    placement: 'right-end',
    tooltipOffset: [10, 10],
  })

  if (!account) {
    return (
      <Flex justifyContent="center" alignItems="center" mt="18px" mb="18px">
        <ConnectWalletButton scale="sm" />
      </Flex>
    )
  }

  if (status === FetchStatus.Fetching) {
    return (
      <Flex justifyContent="center" alignItems="center" mt="18px" mb="18px">
        <Spinner size={50} />
      </Flex>
    )
  }

  const getDate = (nextDue) => {
    try {
      return Number(nextDue) ? format(convertTimeToSeconds(nextDue), 'MMM do, yyyy HH:mm') : '-'
    } catch (err) {
      return '-'
    }
  }

  const tabs = (
    <>
      {parseInt(protocolId?.toString() ?? '0') ? (
        <>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Protocol ID')}
          </Text>
          <Text mr="10px" fontSize="14px" color="primary" bold>
            {parseInt(protocolId?.toString() ?? '0')}
          </Text>
        </>
      ) : null}
      {dueReceivables?.length ? (
        <>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Amount Due Receivable')}
          </Text>
          <Flex height="20px" mt="10px" mr="10px" alignItems="center">
            <Balance
              fontSize="16px"
              value={getBalanceNumber(dueReceivables[0])}
              decimals={3}
              unit={` ${currency?.symbol}`}
            />
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Next Due Receivable')}
          </Text>
          <Text fontSize="14px" color="primary" bold>
            {getDate(dueReceivables[1])}
          </Text>
        </>
      ) : null}
      {protocolInfo?.length ? (
        <>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Subscription Start')}
          </Text>
          <Text fontSize="14px" color="primary" bold>
            {getDate(protocolInfo[1])}
          </Text>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Free Trial (minutes)')}
          </Text>
          <Flex height="20px" mr="10px" alignItems="center">
            <Balance fontSize="16px" value={parseInt(protocolInfo[5]?.toString()) / 60} decimals={0} />
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Amount Receivable')}
          </Text>
          <Flex height="20px" mt="10px" mr="10px" alignItems="center">
            <Balance
              fontSize="16px"
              value={getBalanceNumber(protocolInfo[2])}
              decimals={3}
              unit={` ${currency?.symbol}`}
            />
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Period Receivable (minutes)')}
          </Text>
          <Flex height="20px" mr="10px" alignItems="center">
            <Balance fontSize="16px" value={parseInt(protocolInfo[3]?.toString()) / 60} decimals={0} />
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Paid Receivable')}
          </Text>
          <Flex height="20px" mt="10px" mr="10px" alignItems="center">
            <Balance
              fontSize="16px"
              value={getBalanceNumber(protocolInfo[4])}
              decimals={3}
              unit={` ${currency?.symbol}`}
            />
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('AutoCharge')}
          </Text>
          <Flex height="20px" mr="10px" alignItems="center">
            {protocolInfo[10] ? t('Yes') : t('No')}
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Profile ID Required')}
          </Text>
          <Flex height="20px" mr="10px" alignItems="center">
            {profileIdRequired ? t('Yes') : t('No')}
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Subscription Paywall')}
          </Text>
          <Flex height="20px" mr="10px" alignItems="center">
            {subscription ? t('Yes') : t('No')}
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Paused')}
          </Text>
          <Flex height="20px" mr="10px" alignItems="center">
            {paused ? t('Yes') : t('No')}
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Price Per Second')}
          </Text>
          <Flex height="20px" mt="10px" mr="10px" alignItems="center">
            <Balance
              fontSize="16px"
              value={getBalanceNumber(pricePerSecond)}
              decimals={3}
              unit={` ${currency?.symbol}`}
            />
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Buffer Time (minutes)')}
          </Text>
          <Flex height="20px" mr="10px" alignItems="center">
            <Balance fontSize="16px" value={parseInt(bufferTime?.toString()) / 60} decimals={0} />
          </Flex>
          <Text fontSize="12px" mr="5px" color="textSubtle" textAlign="left">
            {t('Owner Address')}
          </Text>
          <Flex height="20px" mr="10px" alignItems="center">
            <CopyAddress title={truncateHash(paywall?.devaddr_)} account={paywall?.devaddr_} />
          </Flex>
        </>
      ) : null}
    </>
  )
  return (
    <Flex flexDirection="column">
      {isAdmin ? (
        <Flex flexDirection="row" justifyContent="center">
          <Flex justifyContent="center" mr="5px" alignItems="center">
            <CurrencyInputPanel
              showInput={false}
              currency={currency ?? defaultCurrency}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currency ?? defaultCurrency}
              id={collection?.id}
            />
          </Flex>
          <Button mt="5px" onClick={onPresentAddItem}>
            {t('Add Existing Item')}
          </Button>
          <Button mt="5px" ml="5px" onClick={onPresentShip}>
            {t('Add New Item')}
          </Button>
          <Button mt="5px" ml="5px" variant="success" onClick={onPresentPartner}>
            {t('Add Partner')}
          </Button>
          <Button mt="5px" ml="5px" variant="danger" onClick={onPresentRemoveItem}>
            {t('Remove')}
          </Button>
        </Flex>
      ) : null}
      <Flex justifyContent="center" alignItems="center" ml="10px" flexDirection="column">
        <LinkExternal href={`${cancanBaseUrl}/collections/${collection?.id}/paywall/${paywall?.tokenId}`} bold>
          {t('View Paywall')}
        </LinkExternal>
      </Flex>
      <Button mt="5px" ml="5px" onClick={openPresentControlPanel}>
        {t('Control Panel')}
      </Button>
      {!paywall?.canPublish && !isAdmin ? (
        <Flex flexDirection="row" mt="10px" justifyContent="center" alignItems="center">
          <Button mr="18px" onClick={onPresentAddItem2}>
            {t('Add')}
          </Button>
          <Button variant="success" onClick={onPresentPartner}>
            {t('Partner')}
          </Button>
        </Flex>
      ) : null}
      <TabMenu>
        {tabs}
        <></>
      </TabMenu>
      {!ongoingSubscription && !isAdmin ? (
        <Flex mt="10px" flexDirection="column">
          <Flex justifyContent="center" alignItems="center" ml="10px" flexDirection="column" ref={targetRef2}>
            <NFTMedia key={paywall.tokenId} nft={paywall} width={440} height={440} />
            {tooltipVisible2 && tooltip2}
            <Divider />
            <Flex ref={targetRef}>
              <Input
                type="text"
                scale="sm"
                value={nfticketId}
                placeholder={t('input your nfticket id')}
                onChange={(e) => setNfticketId(e.target.value)}
              />
              {tooltipVisible && tooltip}
              <HelpIcon ml="4px" width="15px" height="15px" color="textSubtle" />
            </Flex>
            <LinkExternal
              mt="8px"
              href={`${cancanBaseUrl}/collections/${collection?.id}/paywall/${paywall?.tokenId}`}
              bold
            >
              {t('View Paywall')}
            </LinkExternal>
          </Flex>
          <Flex alignItems="center" flexDirection="column">
            {paywall?.options?.length ? (
              <>
                <Text textTransform="uppercase" textAlign="center" color="textSubtle" fontSize="12px" bold>
                  {t('Customize your order')}
                </Text>
                <Flex justifyContent="center" alignItems="center">
                  <OptionFilters address={account} options={options} />
                </Flex>
              </>
            ) : null}
            <Flex alignItems="center" flexDirection="row">
              <Button mr="18px" variant="success" onClick={onPresentBuySubscription}>
                {t('Buy Subscription')}
              </Button>
              <Button onClick={onPresentSubscribe}>{t('Start Subscription')}</Button>
            </Flex>
          </Flex>
        </Flex>
      ) : null}
      <Grid
        style={{ padding: '20px' }}
        gridGap="16px"
        gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
        alignItems="start"
      >
        {(ongoingSubscription || isAdmin) && paywall?.mirrors?.length > 0
          ? paywall.mirrors
              .filter((mirror) => !!mirror.item)
              .map((mirror) => {
                const nft = mirror.item
                const currentAskPriceAsNumber = nft && parseFloat(nft?.currentAskPrice)
                return (
                  <CollectibleLinkCard
                    key={nft?.tokenId}
                    nft={nft}
                    paywallId={paywall?.tokenId}
                    referrer={
                      mirror?.partner && collection?.owner?.toLowerCase() !== nft?.currentSeller?.toLowerCase()
                        ? collection?.owner
                        : ADDRESS_ZERO
                    }
                    currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
                  />
                )
              })
          : null}
      </Grid>
    </Flex>
  )
}

export default CollectionNfts
