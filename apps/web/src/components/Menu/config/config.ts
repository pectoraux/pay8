import {
  MenuItemsType,
  DropdownMenuItemType,
  SwapIcon,
  SwapFillIcon,
  EarnFillIcon,
  EarnIcon,
  TrophyIcon,
  TrophyFillIcon,
  NftIcon,
  NftFillIcon,
  MoreIcon,
  DropdownMenuItems,
  ResourcesIcon,
  RocketIcon,
  SafePalIcon,
  SellIcon,
  WalletIcon,
  WalletFilledIcon,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { SUPPORTED_CHAIN_IDS as POOL_SUPPORTED_CHAINS } from '@pancakeswap/pools'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { cancanBaseUrl } from 'views/CanCan/market/constants'
import { getPerpetualUrl } from 'utils/getPerpetualUrl'
import { SUPPORT_FARMS, SUPPORT_ONLY_BSC, SUPPORT_ONLY_FANTOM_TESTNET } from 'config/constants/supportChains'
import { NewIconButton } from 'views/BuyCrypto/components/NewIcon'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: t('Trade'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: false,
      supportChainIds: SUPPORT_ONLY_FANTOM_TESTNET,
      items: [
        {
          label: t('dRamps'),
          href: '/ramps',
        },
        {
          label: t('Swap'),
          href: '/swap',
        },
        {
          label: t('Liquidity'),
          href: '/liquidity',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Mint'),
      href: '/accelerator',
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      image: '/images/decorations/pe2.png',
      supportChainIds: SUPPORT_ONLY_FANTOM_TESTNET,
      items: [
        {
          label: t('Accelerator'),
          href: '/accelerator',
        },
        {
          label: t('Businesses'),
          href: '/businesses',
        },
        {
          label: t('Contributors'),
          href: '/contributors',
        },
        {
          label: t('Leviathans'),
          href: '/leviathans',
        },
        {
          label: t('Referrals'),
          href: '/referrals',
        },
        {
          label: t('Worlds'),
          href: '/worlds',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Earn'),
      href: '/auditors',
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      supportChainIds: SUPPORT_ONLY_FANTOM_TESTNET,
      items: [
        {
          label: t('ARPs'),
          href: '/arps',
        },
        {
          label: t('Auditors'),
          href: '/auditors',
          image: '/images/decorations/tc.png',
        },
        {
          label: t('Bills'),
          href: '/bills',
          image: '/images/decorations/prediction.png',
        },
        {
          label: t('PayCards'),
          href: '/cards',
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Future Collaterals'),
          href: '/futureCollaterals',
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Pools'),
          href: '/pools',
        },
        {
          label: t('Sponsors'),
          href: '/sponsors',
        },
        {
          label: t('Wills'),
          href: '/wills',
        },
      ],
    },
    {
      label: t('Win'),
      href: '/bettings',
      icon: TrophyIcon,
      fillIcon: TrophyFillIcon,
      supportChainIds: SUPPORT_ONLY_FANTOM_TESTNET,
      items: [
        {
          label: t('Bettings'),
          href: '/bettings',
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Games'),
          href: '/games',
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('Lotteries'),
          href: '/lotteries',
          image: '/images/decorations/lottery.png',
        },
        {
          label: t('ValuePools'),
          href: '/valuepools',
          image: '/images/decorations/tc.png',
        },
        // {
        //   label: t('Bettings'),
        //   href: '/prediction',
        //   image: '/images/decorations/prediction.png',
        // },
        // {
        //   type: DropdownMenuItemType.DIVIDER,
        // },
        // {
        //   label: t('Trading Competition'),
        //   href: '/competition',
        //   image: '/images/decorations/tc.png',
        //   hideSubNav: true,
        // },
        // {
        //   label: t('Prediction (BETA)'),
        //   href: '/prediction',
        //   image: '/images/decorations/prediction.png',
        // },
        // {
        //   label: t('Lottery'),
        //   href: '/lottery',
        //   image: '/images/decorations/lottery.png',
        // },
        // {
        //   label: t('Pottery (BETA)'),
        //   href: '/pottery',
        //   image: '/images/decorations/lottery.png',
        // },
      ],
    },
    {
      label: t('CanCan'),
      href: `${cancanBaseUrl}`,
      icon: WalletIcon,
      fillIcon: WalletFilledIcon,
      supportChainIds: SUPPORT_ONLY_FANTOM_TESTNET,
      image: '/images/decorations/nft.png',
      items: [
        {
          label: t('Overview'),
          href: `${cancanBaseUrl}`,
        },
        {
          label: t('Collections'),
          href: `${cancanBaseUrl}/collections`,
        },
        // {
        //   label: t('Activity'),
        //   href: `${cancanBaseUrl}/activity`,
        // },
      ],
    },
    {
      label: t('eCollectible'),
      href: `${nftsBaseUrl}`,
      icon: NftIcon,
      fillIcon: NftFillIcon,
      supportChainIds: SUPPORT_ONLY_FANTOM_TESTNET,
      image: '/images/decorations/nft.png',
      items: [
        {
          label: t('Overview'),
          href: `${nftsBaseUrl}`,
        },
        {
          label: t('Collections'),
          href: `${nftsBaseUrl}/collections`,
        },
        // {
        //   label: t('Activity'),
        //   href: `${nftsBaseUrl}/activity`,
        // },
      ],
    },
    {
      label: '',
      href: '/ssi',
      icon: MoreIcon,
      hideSubNav: true,
      supportChainIds: SUPPORT_ONLY_FANTOM_TESTNET,
      items: [
        // {
        //   label: t('Info'),
        //   href: '/info/v3',
        // },
        // {
        //   label: t('IFO'),
        //   href: '/ifo',
        //   supportChainIds: SUPPORT_ONLY_BSC,
        //   image: '/images/ifos/ifo-bunny.png',
        // },
        // {
        //   label: t('Affiliate Program'),
        //   href: '/affiliates-program',
        // },
        // {
        //   label: t('Voting'),
        //   href: '/voting',
        //   supportChainIds: SUPPORT_ONLY_BSC,
        //   image: '/images/voting/voting-bunny.png',
        // },
        {
          label: t('SSI'),
          href: '/ssi',
          // supportChainIds: SUPPORT_ONLY_BSC,
          image: '/images/voting/voting-bunny.png',
        },
        {
          type: DropdownMenuItemType.DIVIDER,
        },
        {
          label: t('PayChat'),
          href: 'https://paychat.payswap.org',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          type: DropdownMenuItemType.DIVIDER,
        },
        {
          label: t('Blog'),
          href: '/cancan/collections/2',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
        {
          label: t('Docs'),
          href: 'https://docs.payswap.org',
          type: DropdownMenuItemType.EXTERNAL_LINK,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
