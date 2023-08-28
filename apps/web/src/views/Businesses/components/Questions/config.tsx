import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What is the Business reward program ?</Trans>,
    description: [
      <Trans>
        The business reward program is a strategic and multifaceted approach to driving growth and engagement within the
        CanCan and eCollectible marketplaces. This model leverages various mechanisms to incentivize businesses to sell
        more items, fostering a dynamic ecosystem of buyers and sellers. Here's a breakdown of its key components:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Sales as Votes: </Trans>
        </InlineLink>
        <Trans>
          In this program, each sale made by a business within the CanCan and eCollectible marketplaces is treated as a
          "vote" for that business in the reward program. This approach effectively aligns business success with
          participation in the program.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Differentiated Voting Power: </Trans>
        </InlineLink>
        <Trans>
          The program introduces the concept of differentiated voting power, where items purchased using free tokens
          associated with a Leviathan count for more votes than those bought with onramped tokens. This helps enhance
          the impact of purchases made using Leviathan-associated tokens, potentially encouraging users to adopt this
          currency within the ecosystem.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans> Incentivizing Investors: </Trans>
        </InlineLink>
        <Trans>
          To encourage investors to participate in the voting process, businesses have the option to create "bribes."
          These bribes are essentially incentives or rewards offered to investors who vote for a particular business.
          This helps businesses attract votes and potentially secure a larger share of the newly minted tokens.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Weekly Token Rewards: </Trans>
        </InlineLink>
        <Trans>
          A significant aspect of the program is the weekly minting of tokens by the platform. These tokens are then
          distributed among businesses based on the number of votes (sales) they accumulate during that week. This
          distribution model inherently rewards businesses that are actively engaging buyers and achieving sales
          milestones.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Creating a Flywheel: </Trans>
        </InlineLink>
        <Trans>
          The program aims to create a positive feedback loop by rewarding well-performing businesses. As businesses
          attract more buyers, generate more sales (votes), and accumulate more tokens, they are better positioned to
          market their products effectively, which in turn can attract more buyers. This flywheel effect contributes to
          a thriving marketplace ecosystem.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Incentive Mechanisms for Businesses: </Trans>
        </InlineLink>
        <Trans>
          Businesses have several options to incentivize users to purchase their items. These options include creating
          "bribes" to encourage users to refer more clients, offering discounts on products, and actively marketing
          their products. These strategies not only drive sales but also engage buyers through various promotional
          avenues.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Growth and Engagement: </Trans>
        </InlineLink>
        <Trans>
          The program is designed to foster growth and engagement within the marketplaces. By incentivizing businesses
          to perform well and encouraging users to purchase items, the ecosystem becomes more vibrant and attractive to
          both sellers and buyers.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Token Economy: </Trans>
        </InlineLink>
        <Trans>
          The use of tokens within the reward program creates an internal economy that rewards participation, drives
          sales, and promotes collaboration among participants.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Sustainability and Adaptability: </Trans>
        </InlineLink>
        <Trans>
          The recurring weekly token minting ensures that the program can sustainably incentivize businesses over time.
          Additionally, the flexibility for businesses to choose their incentives enables adaptation to changing market
          dynamics.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        Overall, the business reward program introduces a comprehensive and dynamic model to drive marketplace growth,
        engagement, and mutual benefit between businesses and users. Its multi-faceted approach leverages different
        strategies and mechanisms to create a synergistic ecosystem.
      </Trans>,
    ],
  },
]
export default config
