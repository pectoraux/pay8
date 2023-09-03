import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | PaySwap',
  defaultTitle: 'PaySwap',
  description:
    'Cheaper and faster than Uniswap? Discover PaySwap, the canary in the coalmine of a better financial system',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@payswaporg',
    site: '@payswaporg',
  },
  openGraph: {
    title: '🥞 PaySwap - A next evolution DeFi exchange on BNB Smart Chain (BSC)',
    description:
      'The most complete marketplace in both crypto and the traditional system with subscriptions, auctions, drops, discount and reward gimmicks.',
    images: [{ url: 'https://payswap.org/images/hero.png' }],
  },
}
