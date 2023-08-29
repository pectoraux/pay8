import Trans from 'components/Trans'
import styled from 'styled-components'
import { ContextApi } from '@pancakeswap/localization'
import { LinkExternal, Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`
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
    {
      title: <Trans>What is CanCan?</Trans>,
      description: [
        <Trans>
          The "CanCan Marketplace" offers a revolutionary platform for users to sell items online, providing a seamless
          and user-friendly experience that empowers individuals to create their own online shops and engage in
          e-commerce activities. With a range of features and capabilities, this marketplace transforms personal
          channels into dynamic and versatile online stores. Here's a closer look at the key features and benefits of
          the "CanCan Marketplace":
        </Trans>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Easy Shop Setup: </Trans>
          </InlineLink>
          <Trans>
            Users can effortlessly set up their own online shops with the same simplicity as creating a social media
            profile, enabling them to start selling quickly.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Diverse Selling Options: </Trans>
          </InlineLink>
          <Trans>
            The marketplace supports various selling methods, including auctions and subscriptions, providing
            flexibility for sellers to choose the approach that suits their products best.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Reviews and Feedback: </Trans>
          </InlineLink>
          <Trans>
            Buyers can leave reviews on purchased items, fostering transparency and helping other potential buyers make
            informed decisions. This feedback system adds credibility to the platform.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Engagement Options: </Trans>
          </InlineLink>
          <Trans>
            Users can express their preferences by liking or disliking items, creating a sense of interactivity and
            allowing sellers to gauge customer reactions.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Partnership Opportunities: </Trans>
          </InlineLink>
          <Trans>
            Channels can collaborate with one another, allowing products to be listed on multiple channels, thereby
            expanding the reach and potential customer base.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Personalized E-Commerce: </Trans>
          </InlineLink>
          <Trans>
            The platform enables individuals to transform their channels into fully functional e-commerce stores,
            resembling the look and feel of established online marketplaces.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>App-Like Experience: </Trans>
          </InlineLink>
          <Trans>
            Users can create a shopping experience similar to popular apps like Uber, Amazon, and Spotify, making it
            more engaging and familiar for shoppers.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Empowerment for Entrepreneurs: </Trans>
          </InlineLink>
          <Trans>
            The CanCan Marketplace empowers individuals to become entrepreneurs and create successful online businesses
            with ease.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Boosting Innovation: </Trans>
          </InlineLink>
          <Trans>
            By offering a platform for users to monetize their channels, the marketplace encourages innovation and
            creativity in e-commerce.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Customized Selling Strategies: </Trans>
          </InlineLink>
          <Trans>
            Sellers can adopt auction-style selling, subscription models, or other strategies that align with their
            products and goals.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Monetization Opportunities: </Trans>
          </InlineLink>
          <Trans>
            The platform provides an additional avenue for content creators and influencers to monetize their audiences
            by selling products directly to their followers.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Streamlined Shopping Experience: </Trans>
          </InlineLink>
          <Trans>
            Buyers benefit from a straightforward shopping experience, enjoying the convenience of browsing, liking, and
            purchasing products within a unified platform.
          </Trans>
        </>,
        <br></br>,
        <Trans>
          In summary, the "CanCan Marketplace" revolutionizes e-commerce by offering a platform that transforms personal
          channels into online shops, providing a seamless way for individuals to become sellers and entrepreneurs. With
          features such as various selling methods, reviews, partnerships, and personalized selling strategies, the
          marketplace empowers users to create successful and engaging online businesses, turning their channels into
          app-like experiences for customers.
        </Trans>,
      ],
    },
  ]
}

export default config
