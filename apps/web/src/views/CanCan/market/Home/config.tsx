import { LinkExternal } from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'

const config = (t: ContextApi['t']) => {
  return [
    {
      title: t('How much does it cost to list a product?'),
      description: [
        t(
          'It is completely free, create a profile, click on the *Make a channel* link in the top right drop down menu and create your own channel.',
        ),
        t('Once you have a channel, you can list as many products or paywalls as you want.'),
      ],
    },
    {
      title: t('How can I list my product on the Market?'),
      description: [
        t('You can find a step by step guide on listing products and paywalls on CanCan in the documentation.'),
        <LinkExternal href="">{t('Click here for more')}</LinkExternal>,
      ],
    },
    // {
    //   title: t('What are the fees?'),
    //   description: [
    //     t(
    //       '100% of all platform fees taken by PancakeSwap from sales are used to buy back and BURN CAKE tokens in our weekly CAKE burns.',
    //     ),
    //     t(
    //       'Platform fees: 2% is subtracted from NFT sales on the market. Subject to change.Collection fees: Additional fees may be taken by collection creators, once those collections are live. These will not contribute to the CAKE burns.',
    //     ),
    //   ],
    // },
  ]
}

export default config
