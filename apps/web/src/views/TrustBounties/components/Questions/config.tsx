import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are TrustBounties ?</Trans>,
    description: [
      <Trans>
        The concept of "Trust Bounties" introduces a unique mechanism for creating trust and accountability within a
        community by utilizing blockchain technology and decentralized decision-making. Trust Bounties allow users to
        lock collaterals in contracts with predefined terms. These terms act as conditions that, if violated, allow
        anyone to submit a claim. The community then votes on whether the terms were indeed violated, leading to
        consequences if the violation is proven. Here's an overview of the key features and benefits of "Trust
        Bounties":
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Building Trust Through Collaterals: </Trans>
        </InlineLink>
        <Trans>
          Trust Bounties allow participants to build trust within a community by locking in collaterals that act as a
          commitment to adhere to specified terms.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Decentralized Accountability: </Trans>
        </InlineLink>
        <Trans>
          By utilizing blockchain and decentralized decision-making, Trust Bounties empower the community to hold each
          other accountable for adhering to the agreed-upon terms.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Defined Terms and Conditions: </Trans>
        </InlineLink>
        <Trans>
          Participants attach specific terms and conditions to their bounties, outlining the behavior or actions that
          are expected to be followed.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Proposal and Voting Process: </Trans>
        </InlineLink>
        <Trans>
          When someone believes the terms have been violated, they can submit a proposal to the community. A voting
          process is initiated, allowing the community to collectively decide whether the terms were breached.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Transparent and Tamper-Proof: </Trans>
        </InlineLink>
        <Trans>
          Blockchain's transparency ensures that the terms and voting outcomes are immutable and tamper-proof, enhancing
          trust in the process.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Fair and Inclusive Decision-Making: </Trans>
        </InlineLink>
        <Trans>
          The community's voting process ensures that decisions are made collectively and fairly, preventing any single
          entity from having undue influence.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Time-Bound Process: </Trans>
        </InlineLink>
        <Trans>
          The voting process has a predefined duration, providing a window for community members to participate and cast
          their votes.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Incentivized Behavior: </Trans>
        </InlineLink>
        <Trans>
          Trust Bounties incentivize participants to uphold their commitments, as any violation can result in losing the
          claimed amount.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Encouraging Positive Interaction: </Trans>
        </InlineLink>
        <Trans>
          The system encourages positive interactions and responsible behavior among community members, fostering a
          healthier ecosystem.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Prevention of Violations: </Trans>
        </InlineLink>
        <Trans>
          The potential for losing the claimed amount acts as a deterrent, discouraging individuals from violating the
          terms set for the Trust Bounty.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Customizable Terms: </Trans>
        </InlineLink>
        <Trans>
          Participants have the flexibility to customize the terms based on the context of the trust they are aiming to
          establish.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Strengthening Relationships: </Trans>
        </InlineLink>
        <Trans>
          Trust Bounties contribute to building stronger relationships within the community by promoting transparency,
          accountability, and responsibility.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, "Trust Bounties" offer a mechanism for creating trust and accountability within communities by
        utilizing collaterals, predefined terms, and decentralized decision-making. By allowing participants to hold
        each other accountable and fostering transparency, this concept promotes positive interactions and helps
        establish a more trustworthy environment.
      </Trans>,
    ],
  },
]
export default config
