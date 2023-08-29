import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What is the StakeMarket ?</Trans>,
    description: [
      <Trans>
        The "Stake Market" contract introduces a novel way to ensure trust and fair transactions in marketplaces by
        utilizing blockchain technology and decentralized decision-making. This concept allows users to put funds in
        escrow, or "stake," until certain conditions are met. This way, participants can engage in transactions with a
        higher level of confidence, and disputes can be resolved through community-driven voting. Here's an overview of
        the key features and benefits of the "Stake Market":
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Secure Escrow Mechanism: </Trans>
        </InlineLink>
        <Trans>
          The "Stake Market" provides a secure escrow system where users can lock funds until predetermined conditions
          are satisfied.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Building Trust in Transactions: </Trans>
        </InlineLink>
        <Trans>
          Participants can transact with confidence, knowing that their funds are safeguarded until the agreed-upon
          conditions are met.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Conditional Release of Funds: </Trans>
        </InlineLink>
        <Trans>
          The escrowed funds are released based on specific conditions, such as successful receipt of items, resolution
          of disputes, or other agreed-upon criteria.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Dispute Resolution Mechanism: </Trans>
        </InlineLink>
        <Trans>
          In case of disputes, either party involved can create a proposal, and the community votes on the resolution.
          This decentralized process ensures fair decision-making.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Transparency and Accountability: </Trans>
        </InlineLink>
        <Trans>
          Blockchain's transparency ensures that all participants can track the progress of transactions, proposals, and
          voting outcomes.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Incentivizing Fair Behavior: </Trans>
        </InlineLink>
        <Trans>
          The potential loss of funds acts as an incentive for participants to fulfill their obligations and adhere to
          agreed-upon conditions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Community-Driven Resolution: </Trans>
        </InlineLink>
        <Trans>
          Decentralized voting empowers the community to collectively determine the outcome of disputes, reducing the
          risk of biased judgments.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Customizable Conditions: </Trans>
        </InlineLink>
        <Trans>
          Users can define specific conditions under which the escrowed funds will be released, allowing for flexibility
          in transaction terms.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Protection Against Fraud: </Trans>
        </InlineLink>
        <Trans>
          By requiring consensus in dispute resolution, the system provides protection against fraudulent claims or
          malicious actions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Strengthening Marketplace Trust: </Trans>
        </InlineLink>
        <Trans>
          The "Stake Market" contributes to building trust within marketplaces by fostering transparency and offering a
          reliable dispute resolution mechanism.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Efficient Dispute Handling: </Trans>
        </InlineLink>
        <Trans>
          Disputes are resolved efficiently through voting, reducing the need for lengthy legal processes and potential
          costs.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Promoting Fairness and Collaboration: </Trans>
        </InlineLink>
        <Trans>
          The concept encourages fair behavior and collaboration among participants by incentivizing both parties to
          adhere to their commitments.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, the "Stake Market" contract revolutionizes trust and transactions within marketplaces by providing a
        secure escrow system and decentralized dispute resolution. By ensuring that funds are only released upon meeting
        agreed-upon conditions and involving the community in dispute resolution, this concept promotes transparency,
        accountability, and positive interactions within the marketplace ecosystem.
      </Trans>,
    ],
  },
]
export default config
