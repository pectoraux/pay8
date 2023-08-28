import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What is the Referral rewards program ?</Trans>,
    description: [
      <Trans>
        The referral rewards program is a strategic approach to driving user acquisition and engagement within the
        CanCan and eCollectibles marketplaces. This model incentivizes agents to refer users to the platform and
        establish long-term connections with their referred users. Here's a breakdown of its key components:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans> Referral Mechanism: </Trans>
        </InlineLink>
        <Trans>
          Agents are incentivized to refer users to the platform. When an agent successfully refers a user, they become
          the user's designated referrer for life. This means that as long as the referred user creates a profile and
          designates the agent as their referrer, the agent will continue to receive benefits from the user's activity.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Ongoing Rewards for Purchases: </Trans>
        </InlineLink>
        <Trans>
          When a user referred by an agent makes a purchase within the CanCan and eCollectibles marketplaces, the agent
          receives a "vote." This vote is essentially a reward or credit granted to the agent as recognition for their
          role in bringing the user to the platform.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Scaling Rewards with User Activity: </Trans>
        </InlineLink>
        <Trans>
          The more purchases that referred users make, the more votes the referring agent receives. This means that
          agents are incentivized not only to bring in users but also to encourage ongoing engagement and activity among
          the users they've referred.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Weekly Token Distribution: </Trans>
        </InlineLink>
        <Trans>
          A significant aspect of the program is the weekly emission of tokens by the platform. These tokens are
          distributed among the referring agents based on the number of votes they've accumulated during that week. This
          distribution model ensures that agents are rewarded for their ongoing efforts in bringing and retaining users.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Building a Referral Network: </Trans>
        </InlineLink>
        <Trans>
          Agents have the potential to build a network of referred users, all of whom contribute to the agent's vote
          count. This network effect can lead to exponential rewards as the agent's referred users engage with the
          marketplaces.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Long-Term Relationships: </Trans>
        </InlineLink>
        <Trans>
          The program encourages agents to establish lasting relationships with referred users by offering ongoing
          incentives. This long-term connection benefits both the agent and the referred user, creating a win-win
          scenario.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Token-Based Incentives: </Trans>
        </InlineLink>
        <Trans>
          By rewarding agents with tokens, the program leverages the internal token economy to incentivize user
          acquisition and engagement.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Transparency and Accountability: </Trans>
        </InlineLink>
        <Trans>
          The program's design, including the requirement for referred users to designate a referrer, ensures
          transparency and accountability in the reward distribution process.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In conclusion, the referral rewards program introduces a compelling model to drive user growth and engagement
        within the marketplaces. By incentivizing agents to refer users and encouraging ongoing user activity, the
        program contributes to the vibrancy and success of the ecosystem while also rewarding those who contribute to
        its expansion.
      </Trans>,
    ],
  },
]
export default config
