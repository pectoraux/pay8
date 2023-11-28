import { useRouter } from 'next/router'
import { useCallback, useState, useMemo } from 'react'
import { Text, Row, Button, useModal, Flex, FlexGap, LinkExternal, ReactMarkdown } from '@pancakeswap/uikit'
import { useCurrency } from 'hooks/Tokens'
import { useWeb3React } from '@pancakeswap/wagmi'
import { Collection } from 'state/cancan/types'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import { formatNumber } from '@pancakeswap/utils/formatBalance'
import { useTranslation } from '@pancakeswap/localization'
import Container from 'components/Layout/Container'
import { DEFAULT_TFIAT } from 'config/constants/exchange'
import dynamic from 'next/dynamic'
import styled from 'styled-components'
import { Contacts } from 'views/Ramps/components/PoolStatsInfo'

import MarketPageHeader from '../components/MarketPageHeader'
import MarketPageTitle from '../components/MarketPageTitle'
import StatBox, { StatBoxItem } from '../components/StatBox'
import BannerHeader from '../components/BannerHeader'
import AvatarImage from '../components/BannerHeader/AvatarImage'
import BaseSubMenu from '../components/BaseSubMenu'
import { nftsBaseUrl } from '../constants'
import SettingStage from '../components/BuySellModals/SellModal/SettingStage'
import ShipStage from '../components/BuySellModals/SellModal/ShipStage'
import PartnerModal from './PartnerModal'
import RegisterModal from './RegisterModal'
import TopBar from './TopBar'
import LowestPriceStatBoxItem from './LowestPriceStatBoxItem'
import { ActionContainer, ActionContent, ActionTitles } from './styles'
import { useGetEstimateVotes } from 'state/cancan/hooks'
import NextStepButton from 'views/ChannelCreation/NextStepButton'

const Tour = dynamic(() => import('../../../../components/Tour'), { ssr: false })

interface HeaderProps {
  collection: Collection
}

const DesktopButton = styled(Button)`
  align-self: flex-end;
`

const Header: React.FC<any> = ({ collection }) => {
  const router = useRouter()
  const collectionAddress = router.query.collectionAddress as string
  const { numberNftsListed, numberPartnerNftsListed, totalVolumeBNB, large, avatar, owner } = collection
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const isOwner = account?.toLocaleLowerCase() === owner?.toLocaleLowerCase()
  const contactChannels = collection?.contactChannels?.split(',') ?? []
  const contacts = collection?.contacts?.split(',') ?? []
  const votes = useGetEstimateVotes(collection?.id)
  const volume = totalVolumeBNB
    ? parseFloat(totalVolumeBNB ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      })
    : '0'
  const [launch, setLaunch] = useState(false)
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

  const steps = [
    {
      target: '.tour-1',
      content: (
        <>
          <ReactMarkdown>{t("The **Items**' tab displays all products available on the channel.")}</ReactMarkdown>
          <ReactMarkdown>{t("The **Activity**'s tab display all product sales & listings.")}</ReactMarkdown>
          <ReactMarkdown>{t("The **Requests**' tab displays all partnership & membership requests.")}</ReactMarkdown>
          <ReactMarkdown>
            {t("The **Contracts**' tab displays all stakes, bounties and valuepools relevant to this channel.")}
          </ReactMarkdown>
          <ReactMarkdown>
            {t("The **Legal & Info**'s tab displays the channel's terms of service and essential announcements.")}
          </ReactMarkdown>
          <ReactMarkdown>{t("The **Stats**' tab displays all stats relevant to the channel")}</ReactMarkdown>
        </>
      ),
      disableBeacon: true,
    },
    {
      target: '.tour-2',
      content: t('The Home tab displays all products listed by this channel'),
    },
    {
      target: '.tour-3',
      content: t('The Partner tab displays all products listed by channel partners'),
    },
    {
      target: '.tour-4',
      content: t("The Users' tab displays all channel users"),
    },
    {
      target: '.tour-5',
      content: t('Use this section for filtering products based on workspace, country, city or product tags'),
    },
  ]
  const itemsConfig = [
    {
      label: t('Items'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}`,
    },
    {
      label: t('Activity'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#activity`,
    },
    {
      label: t('Requests'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#requests`,
    },
    {
      label: t('Contracts'), // groups together: stakemarket, trust bounties, badges, arps, lotteries, bettings, mines
      href: `${nftsBaseUrl}/collections/${collectionAddress}#stakemarket`,
    },
    {
      label: t('Legal & Info'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#legal`,
    },
    {
      label: t('Stats'),
      href: `${nftsBaseUrl}/collections/${collectionAddress}#traits`,
    },
  ]

  const getActiveItem = useMemo(() => {
    const hash = router.asPath.match(/#([a-z0-9]+)/gi)?.[0] ?? ''
    if (hash === '#valuepools' || hash === '#trustbounties') {
      return `${nftsBaseUrl}/collections/${collectionAddress}#stakemarket`
    }
    return `${router.asPath?.split('?chain=')[0]}${hash}`
  }, [router, collectionAddress])

  return (
    <>
      <Tour steps={steps} launch={launch} />
      <MarketPageHeader>
        <TopBar />
        <BannerHeader bannerImage={large ?? ''} avatar={<AvatarImage src={avatar ?? ''} />} />
        <MarketPageTitle
          address={collection?.address}
          title={collection?.name ?? ''}
          description={collection?.description ? <Text color="textSubtle">{t(collection.description)}</Text> : null}
        >
          <StatBox>
            <StatBoxItem title={t('Items')} stat={formatNumber(Number(numberNftsListed ?? 0), 0, 0) ?? '-'} />
            <StatBoxItem
              title={t('Partner Items')}
              stat={numberNftsListed ? formatNumber(Number(numberPartnerNftsListed), 0, 0) : '0'}
            />
            <LowestPriceStatBoxItem collectionAddress={collection?.id} />
            <StatBoxItem title={t('Vol.')} stat={(volume ?? 0)?.toString()} />
            <StatBoxItem title={t('Likes')} stat={votes?.likes} />
            <StatBoxItem title={t('Dislikes')} stat={votes?.dislikes} />
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
                  {isOwner ? t('Ship faster') : t('Get Started With Us Today!')}
                </Text>
              </ActionTitles>
              <ActionContent>
                <Button width="100%" onClick={isOwner ? onPresentShip : onPresentRegister} variant="secondary">
                  {isOwner ? t('Product') : t('Register')}
                </Button>
              </ActionContent>
            </ActionContainer>
          </Row>
        </MarketPageTitle>
        <Flex>
          <Contacts contactChannels={contactChannels} contacts={contacts} />
          <FlexGap gap="16px" pt="24px" pl="4px">
            <DesktopButton
              disabled={launch}
              onClick={() => {
                if (router.asPath.includes('#')) {
                  router.push(`/nfts/collections/${collectionAddress}`)
                } else {
                  setLaunch(true)
                }
              }}
              mb="18px"
              variant="subtle"
            >
              {t('Launch Tour')}
            </DesktopButton>
            <NextStepButton external onClick={() => router.push(`/cancan/collections/${collectionAddress}`)}>
              {t('Go to CanCan')}
            </NextStepButton>
            <LinkExternal href="/lotteries/1" bold={false}>
              {t('See Lottery')}
            </LinkExternal>
          </FlexGap>
        </Flex>
      </MarketPageHeader>
      <Container>
        <BaseSubMenu className="tour-1" items={itemsConfig} activeItem={getActiveItem} mt="24px" mb="8px" />
      </Container>
    </>
  )
}

export default Header
