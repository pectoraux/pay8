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
} from '@pancakeswap/uikit'
import { Collection } from 'state/cancan/types'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useTranslation } from '@pancakeswap/localization'
import {
  useGetPaywallARP,
  useGetSubscriptionStatus,
  useGetNftShowOnlyUsers,
  useGetNftShowOnlyOnSale,
  useGetNftShowSearch,
  useGetNftFilters,
} from 'state/cancan/hooks'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CollapsibleCard from 'components/CollapsibleCard'
import { FetchStatus } from 'config/constants/types'
import NFTMedia from 'views/CanCan/market/components/NFTMedia'
import Divider from 'components/Divider'
import { ADDRESS_ZERO } from '@pancakeswap/v3-sdk'
import { orderBy } from 'lodash'
import latinise from '@pancakeswap/utils/latinise'
import { useSelector } from 'react-redux'
import { selectFilteredData } from 'state/cancan/selectors'

import GridPlaceholder from '../../components/GridPlaceholder'
import { CollectibleLinkCard, CollectionCard } from '../../components/CollectibleCard'
import { useCollectionNfts } from '../../hooks/useCollectionNfts'
import { BNBAmountLabel } from '../../components/CollectibleCard/styles'
import BuyModal from '../../components/BuySellModals/BuyModal'
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

  const _nfts = selectFilteredData(id, __nfts)
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
  }, [status, _nfts, showSearch])

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
                title={`${paywall?.tokenId} -> ${paywall.mirrors?.length} ${t('Result(s)')}`}
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
              <Content owner={collection.owner} registration={currentPartner} />
            </CollapsibleCard>
          ) : null}
          <Grid mb="64px" gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']}>
            {collection.partnerRegistrations
              .filter((registration) => registration.active && registration.partnerCollection?.id)
              .map((registration) => {
                return (
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
        collection.registrations
          .filter((registration) => registration.active)
          .map((registration) => {
            return (
              <Grid gridGap="16px" gridTemplateColumns={['1fr', '1fr', 'repeat(2, 1fr)', 'repeat(3, 1fr)']} mb="64px">
                <CollectionCard
                  key={registration.userCollection?.id}
                  bgSrc={registration.userCollection?.small}
                  avatarSrc={registration.userCollection?.avatar}
                  collectionName=""
                >
                  <Flex alignItems="center">
                    {registration.userCollection?.name}
                    <Text fontSize="12px" color="textSubtle">
                      {t('Volume')}
                    </Text>
                    <BNBAmountLabel
                      amount={
                        registration.userCollection?.totalVolumeBNB
                          ? parseFloat(registration.userCollection.totalVolumeBNB)
                          : 0
                      }
                    />
                  </Flex>
                  <Flex mb="2px" justifyContent="flex-start">
                    <Button
                      onClick={() => {
                        setUserCollectionId(registration.userCollection?.id)
                        setUserBountyId(registration.bountyId)
                        onPresentUnregister()
                      }}
                      color="failure"
                      mr="18px"
                      style={{ cursor: 'pointer' }}
                      bold={false}
                      as={Link}
                      small
                    >
                      {t('Unregister')}
                    </Button>
                    <LinkExternal
                      href={`${cancanBaseUrl}/collections/${registration.userCollection?.id}`}
                      bold={false}
                      small
                    >
                      {t('See Channel')}
                    </LinkExternal>
                  </Flex>
                </CollectionCard>
              </Grid>
            )
          })
      ) : (
        <Flex alignItems="center" py="48px" flexDirection="column">
          <BunnyPlaceholderIcon width="96px" mb="24px" />
          <Text fontWeight={600}>{t('No items found')}</Text>
        </Flex>
      )}
    </>
  )
}

const Content: React.FC<any> = ({ owner, registration }) => {
  const { t } = useTranslation()
  const [onPresentAddReferral] = useModal(<AddReferralModal registration={registration} />)
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
              referrer={owner?.toLowerCase() !== nft?.currentSeller?.toLowerCase() && nft?.currentSeller}
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
  const paywallARP = useGetPaywallARP(paywall?.collection?.id ?? '') as any
  const [nfticketId, setNfticketId] = useState('')
  const { ongoingSubscription, status, refetch } = useGetSubscriptionStatus(
    paywallARP?.paywallAddress ?? '',
    account ?? '',
    nfticketId ?? '0',
    paywall?.tokenId ?? '',
  )
  console.log('paywallnfticketId======================>', nfticketId, ongoingSubscription, paywallARP, paywall)
  const isAdmin = paywall?.currentSeller?.toLowerCase() === account?.toLowerCase()
  const [onPresentAddItem] = useModal(<AddItemModal collection={collection} paywall={paywall} />)
  const [onPresentAddItem2] = useModal(<AddItemModal partner collection={collection} paywall={paywall} />)
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
  }, [paywallARP, nfticketId, account, paywall])

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

  return (isAdmin || ongoingSubscription) && paywall?.mirrors?.length > 0 ? (
    <Flex flexDirection="column">
      {isAdmin ? (
        <Flex flexDirection="row" justifyContent="center">
          <Button mt="5px" onClick={onPresentAddItem}>
            {t('Add')}
          </Button>
          <Button mt="5px" ml="5px" variant="success" onClick={onPresentPartner}>
            {t('Add Partner')}
          </Button>
          <Button mt="5px" ml="5px" variant="danger" onClick={onPresentRemoveItem}>
            {t('Remove')}
          </Button>
          <Flex justifyContent="center" alignItems="center" ml="10px" flexDirection="column">
            <LinkExternal href={`${cancanBaseUrl}/collections/${collection?.id}/paywall/${paywall?.tokenId}`} bold>
              {t('View Paywall')}
            </LinkExternal>
          </Flex>
        </Flex>
      ) : null}
      <Grid
        style={{ padding: '20px' }}
        gridGap="16px"
        gridTemplateColumns={['1fr', null, 'repeat(3, 1fr)', null, 'repeat(4, 1fr)']}
        alignItems="start"
      >
        {paywall.mirrors
          .filter((mirror) => !!mirror.item)
          .map((mirror) => {
            const nft = mirror.item
            const currentAskPriceAsNumber = nft && parseFloat(nft?.currentAskPrice)
            return (
              <CollectibleLinkCard
                key={nft?.tokenId}
                nft={nft}
                referrer={
                  mirror?.partner && collection?.owner?.toLowerCase() !== nft?.currentSeller?.toLowerCase()
                    ? collection?.owner
                    : ADDRESS_ZERO
                }
                currentAskPrice={currentAskPriceAsNumber > 0 ? currentAskPriceAsNumber : undefined}
              />
            )
          })}
      </Grid>
    </Flex>
  ) : !isAdmin ? (
    <Flex alignItems="center" py="48px" flexDirection="column">
      {!ongoingSubscription ? (
        <>
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
        </>
      ) : null}
      {!paywall?.canPublish ? (
        <Flex alignItems="center" mt="18px" flexDirection="row">
          <Button mr="18px" onClick={onPresentAddItem2}>
            {t('Add')}
          </Button>
          <Button variant="success" onClick={onPresentPartner}>
            {t('Partner')}
          </Button>
        </Flex>
      ) : null}
    </Flex>
  ) : (
    <Flex alignItems="center" py="48px" flexDirection="column">
      <Flex justifyContent="center" alignItems="center" ml="10px" flexDirection="column">
        <NFTMedia key={paywall.tokenId} nft={paywall} width={440} height={440} />
        <LinkExternal href={`${cancanBaseUrl}/collections/${collection?.id}/paywall/${paywall?.tokenId}`} bold>
          {t('View Paywall')}
        </LinkExternal>
      </Flex>
      <Button mb="18px" ml="5px" onClick={onPresentAddItem}>
        {t('Add')}
      </Button>
      <Button variant="success" ml="5px" onClick={onPresentPartner}>
        {t('Add Partner')}
      </Button>
      <Text fontWeight={600}>{t('Paywall is empty')}</Text>
    </Flex>
  )
}

export default CollectionNfts
