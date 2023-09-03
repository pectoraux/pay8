import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | PaySwap',
  defaultTitle: 'PaySwap',
  description:
    'The most popular AMM DEX on BSC is now on Aptos! Swap your favourite tokens instantly and provide liquidity to start earning from trading fees. Earn CAKE through yield farming, and stake them to earn more tokens, or use them to buy new tokens in initial farm offerings—all on a platform you can trust.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@payswaporg',
    site: '@payswaporg',
  },
  openGraph: {
    title: '🥞 PaySwap - The most popular DeFi exchange on BSC, now on Aptos',
    description:
      'The most popular AMM on BSC is now on Aptos! Swap your favourite tokens instantly and provide liquidity to start earning from trading fees. Earn CAKE through yield farming, and stake them to earn more tokens, or use them to buy new tokens in initial farm offerings—all on a platform you can trust.',
    images: [{ url: 'https://aptos.pancakeswap.finance/images/hero.jpeg' }],
  },
}
