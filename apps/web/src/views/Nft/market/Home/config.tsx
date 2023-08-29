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
      title: <Trans>What is eCollectible?</Trans>,
      description: [
        <Trans>
          The "eCollectible Marketplace" introduces a unique platform tailored specifically for trading and selling
          digital collectibles in the form of Non-Fungible Tokens (NFTs). Much like the CanCan marketplace, the
          eCollectible marketplace provides users with the tools to create their own digital storefronts, but with a
          focus on the sale of NFTs. Here are the distinguishing features and benefits of the "eCollectible
          Marketplace":
        </Trans>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>NFT-Specific Marketplace: </Trans>
          </InlineLink>
          <Trans>
            The eCollectible Marketplace is specialized for NFTs, catering to collectors and creators interested in
            buying, selling, and trading unique digital assets.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Digital Collectibles and NFTs: </Trans>
          </InlineLink>
          <Trans>
            Users can list and sell their digital collectibles in the form of NFTs, each representing a one-of-a-kind
            digital item, artwork, or token.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Custom NFT Contracts: </Trans>
          </InlineLink>
          <Trans>
            Users have the option to deploy their own custom NFT contracts, giving them greater control over the
            properties and attributes of their NFTs.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Default NFT Contract: </Trans>
          </InlineLink>
          <Trans>
            Alternatively, users can utilize the eCollectible marketplace's default NFT contract for simplicity,
            providing an accessible option for those new to NFTs.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>User-Friendly Shop Setup: </Trans>
          </InlineLink>
          <Trans>
            Similar to the CanCan marketplace, eCollectible offers a straightforward setup process, allowing users to
            quickly create their own digital collectibles shop.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Collectible Auctions and Sales: </Trans>
          </InlineLink>
          <Trans>
            Users can list their NFTs for sale or auction, enabling various ways for collectors to acquire these unique
            digital items.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Encouraging Creative Expression: </Trans>
          </InlineLink>
          <Trans>
            The platform fosters creativity by allowing artists, creators, and enthusiasts to showcase and monetize
            their digital artwork and collectibles.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Global Reach: </Trans>
          </InlineLink>
          <Trans>
            The digital nature of NFTs means users can engage in buying and selling with a global audience, transcending
            geographical limitations.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>NFT Ownership and Rarity: </Trans>
          </InlineLink>
          <Trans>
            NFTs on the eCollectible Marketplace represent ownership of unique digital assets and can include varying
            degrees of rarity and uniqueness.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Interactivity and Engagement: </Trans>
          </InlineLink>
          <Trans>
            Collectors can interact with NFTs, showcasing them in virtual galleries, participating in auctions, and
            trading with other collectors.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Monetization for Creators: </Trans>
          </InlineLink>
          <Trans>
            Artists and creators can monetize their digital art, music, and creations by minting NFTs and offering them
            for sale to their audience.
          </Trans>
        </>,
        <br></br>,
        <>
          <InlineLink ml="4px">
            <Trans>Authenticity and Provenance: </Trans>
          </InlineLink>
          <Trans>
            Blockchain technology ensures the authenticity and provenance of each NFT, allowing buyers to verify the
            ownership and history of their digital collectibles.
          </Trans>
        </>,
        <br></br>,
        <Trans>
          In summary, the "eCollectible Marketplace" focuses on creating a platform where users can buy, sell, and trade
          digital collectibles in the form of NFTs. With features such as customizable NFT contracts, auctions, and
          digital art monetization, this marketplace caters to the growing demand for unique and valuable digital assets
          in the digital collectibles space.
        </Trans>,
      ],
    },
  ]
}

export default config
