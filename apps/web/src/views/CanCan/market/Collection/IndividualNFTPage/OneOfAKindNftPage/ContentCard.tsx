import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useWeb3React } from '@pancakeswap/wagmi'
import { useGetDecryptedContent, useGetPaywallARP, useGetSubscriptionStatus } from 'state/cancan/hooks'
import RichText from 'components/RichText'
import { Button, Flex, useModal } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import BuyModal from 'views/CanCan/market/components/BuySellModals/BuyModal'
import SubscribeModal from '../../SubscribeModal'

const ContentCard: React.FC<any> = ({ collection, nft, mp4 }) => {
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const paywallId = useRouter().query.paywallId as any
  const paywall = collection?.paywalls?.find((payw) => payw.tokenId?.toLowerCase() === paywallId?.toLowerCase())
  const paywallARP = useGetPaywallARP(nft?.collection?.id ?? '', paywall?.tokenId ?? '') as any
  const { ongoingSubscription } = useGetSubscriptionStatus(
    paywallARP?.paywallAddress ?? '',
    account ?? '',
    '0',
    paywallId,
  )
  const { mp4: __mp4, refetch } = useGetDecryptedContent(nft, '', mp4, ongoingSubscription, account)
  const [onPresentBuySubscription] = useModal(<BuyModal variant="paywall" nftToBuy={paywall} />)
  const [onPresentSubscribe] = useModal(<SubscribeModal collection={collection} paywall={paywall} />)

  useEffect(() => {
    refetch()
  }, [account, refetch])

  return ongoingSubscription ? (
    <RichText readOnly value={__mp4} id="rte" />
  ) : (
    <Flex alignItems="center" justifyContent="center" flexDirection="row" mt="3px">
      <Button mr="18px" variant="success" onClick={onPresentBuySubscription}>
        {t('Buy Subscription')}
      </Button>
      <Button onClick={onPresentSubscribe}>{t('Start Subscription')}</Button>
    </Flex>
  )
}

export default ContentCard
