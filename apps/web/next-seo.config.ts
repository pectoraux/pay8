import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | PaySwap',
  defaultTitle: 'PaySwap',
  description:
    'Cheaper and faster than Uniswap? Discover PaySwap, the marketplace that helps you setup your online item or talent marketplace business.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@payswaporg',
    site: '@payswaporg',
  },
  openGraph: {
    title: 'PaySwap - A next evolution DeFi exchange on BNB Smart Chain (BSC)',
    description:
      'PaySwap helps you start your own online cryptocurrency business, online eCommerce business, online Healthcare business, online Gambling business, as well as multiple online businesses.',
    images: [{ url: 'https://payswap.org/images/logo.png' }],
  },
}
