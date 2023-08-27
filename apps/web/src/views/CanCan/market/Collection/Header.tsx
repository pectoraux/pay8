import { useRouter } from 'next/router'
import { useCallback, useState, useMemo } from 'react'
import {
  Text,
  SvgProps,
  Svg,
  Row,
  Button,
  useModal,
  Flex,
  FlexGap,
  IconButton,
  TwitterIcon,
  TelegramIcon,
  LanguageIcon,
  Link,
  LinkExternal,
  SmartContractIcon,
  ProposalIcon,
} from '@pancakeswap/uikit'
import { useCurrency } from 'hooks/Tokens'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Collection } from 'state/cancan/types'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'
import BaseSubMenu from '../components/BaseSubMenu'
import { cancanBaseUrl } from '../constants'
import BuyModal from '../components/BuySellModals/BuyModal'
import SettingStage from '../components/BuySellModals/SellModal/SettingStage'
import ShipStage from '../components/BuySellModals/SellModal/ShipStage'
import PartnerModal from './PartnerModal'
import RegisterModal from './RegisterModal'
import TopBar from './TopBar'
import LowestPriceStatBoxItem from './LowestPriceStatBoxItem'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'

interface HeaderProps {
  collection: Collection
}

const Header: React.FC<any> = ({ collection }) => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const { numberTokensListed, numberPartnerTokensListed, totalVolumeBNB, large, avatar, owner } = collection
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const isOwner = account?.toLocaleLowerCase() === owner?.toLocaleLowerCase()
  const contactChannels = collection?.contactChannels?.split(',') ?? []
  const contacts = collection?.contacts?.split(',') ?? []
  const volume = totalVolumeBNB
    ? parseFloat(totalVolumeBNB ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    : '0'
  const defaultCurrency = useCurrency(DEFAULT_TFIAT)
  const [currency, setCurrency] = useState(defaultCurrency)
  const handleInputSelect = useCallback((currencyInput) => {
    setCurrency(currencyInput)
  }, [])

  const [onPresentSettings] = useModal(<SettingStage collection={collection} />)
  const [onPresentPartner] = useModal(<PartnerModal collection={collection} />)
  const [onPresentRegister] = useModal(<RegisterModal collection={collection} />)
  const [onPresentShip] = useModal(<ShipStage variant="product" collection={collection} currency={currency} />)
  const [onPresentPaywall] = useModal(<ShipStage variant="paywall" collection={collection} currency={currency} />)

  const itemsConfig = [
    {
      label: t('Items'),
      href: `${cancanBaseUrl}/collections/${collectionAddress}`,
    },
    {
      label: t('Activity'),
      href: `${cancanBaseUrl}/collections/${collectionAddress}#activity`,
    },
    {
      label: t('Requests'),
      href: `${cancanBaseUrl}/collections/${collectionAddress}#requests`,
    },
    {
      label: t('Contracts'), // groups together: stakemarket, trust bounties, badges, arps, lotteries, bettings, mines
      href: `${cancanBaseUrl}/collections/${collectionAddress}#stakemarket`,
    },
    {
      label: t('Legal & Info'),
      href: `${cancanBaseUrl}/collections/${collectionAddress}#legal`,
    },
    {
      label: t('Stats'),
      href: `${cancanBaseUrl}/collections/${collectionAddress}#traits`,
    },
  ]

  const getActiveItem = useMemo(() => {
    const hash = router.asPath.match(/#([a-z0-9]+)/gi)?.[0]
    if (hash === '#valuepools' || hash === '#trustbounties') {
      return `${cancanBaseUrl}/collections/${collectionAddress}#stakemarket`
    }
    return router.asPath.replace('?chainId=97', '')
  }, [router, collectionAddress])

  return (
    <>
      <MarketPageHeader>
        <TopBar />
        <BannerHeader bannerImage={large ?? ''} avatar={<AvatarImage src={avatar ?? ''} />} />
        <MarketPageTitle
          address={collection?.address}
          title={collection?.name ?? ''}
          description={collection?.description ? <Text color="textSubtle">{t(collection.description)}</Text> : null}
        >
          <StatBox>
            <StatBoxItem title={t('Items')} stat={formatNumber(Number(numberTokensListed ?? 0), 0, 0) ?? '-'} />
            <StatBoxItem
              title={t('Partner Items')}
              stat={numberTokensListed ? formatNumber(Number(numberPartnerTokensListed), 0, 0) : '0'}
            />
            <LowestPriceStatBoxItem collectionAddress={collection?.id} />
            <StatBoxItem title={t('Vol. (%symbol%)', { symbol: 'BNB' })} stat={(volume ?? 0)?.toString()} />
          </StatBox>
          <Flex justifyContent="center" alignItems="center">
            <CurrencyInputPanel
              showInput={false}
              currency={currency ?? defaultCurrency}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currency ?? defaultCurrency}
              id={collectionAddress}
            />
          </Flex>
          <Row>
            {isOwner && (
              <ActionContainer>
                <ActionTitles>
                  <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                    {t('Channel Settings')}
                  </Text>
                </ActionTitles>
                <ActionContent>
                  <Button width="100%" onClick={onPresentSettings} variant="secondary">
                    {t('Settings')}
                  </Button>
                </ActionContent>
              </ActionContainer>
            )}
            <ActionContainer>
              <ActionTitles>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {isOwner ? t('Paid content') : t('Willing to do business with us?')}
                </Text>
              </ActionTitles>
              <ActionContent>
                <Button width="100%" onClick={isOwner ? onPresentPaywall : onPresentPartner} variant="secondary">
                  {isOwner ? t('Paywall') : t('Partner')}
                </Button>
              </ActionContent>
            </ActionContainer>
            <ActionContainer>
              <ActionTitles>
                <Text bold textTransform="uppercase" color="textSubtle" fontSize="12px">
                  {isOwner ? t('Ship faster') : t('Become a user')}
                </Text>
              </ActionTitles>
              <ActionContent>
                <Button
                  // key="product-register"
                  width="100%"
                  data-test="product-register"
                  onClick={isOwner ? onPresentShip : onPresentRegister}
                  variant="secondary"
                >
                  {isOwner ? t('Poduct') : t('Register')}
                </Button>
              </ActionContent>
            </ActionContainer>
          </Row>
        </MarketPageTitle>
        <Flex>
          <Contacts contactChannels={contactChannels} contacts={contacts} />
          <FlexGap gap="16px" pt="24px" pl="4px">
            <LinkExternal href="/lotteries/1" bold={false}>
              {t('See Lottery')}
            </LinkExternal>
          </FlexGap>
        </Flex>
      </MarketPageHeader>
      <Container>
        <BaseSubMenu items={itemsConfig} activeItem={getActiveItem} mt="24px" mb="8px" />
      </Container>
    </>
  )
}

export default Header
