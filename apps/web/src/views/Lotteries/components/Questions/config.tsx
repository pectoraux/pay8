import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are Lotteries ?</Trans>,
    description: [
      <Trans>
        The concept of "Lottery Contracts" introduces a modern and decentralized approach to organizing and
        participating in lotteries. By leveraging blockchain technology, these contracts offer a transparent and secure
        way for agents to set up lotteries, sell tickets, and define token rewards and distribution. Here's an overview
        of the key features and benefits of "Lottery Contracts":
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Decentralized Lotteries: </Trans>
        </InlineLink>
        <Trans>
          "Lottery Contracts" enable the creation of decentralized lotteries that operate on the blockchain, ensuring
          transparency and preventing tampering with results.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Secure and Transparent Transactions: </Trans>
        </InlineLink>
        <Trans>
          Blockchain technology ensures secure and transparent ticket purchases, ticket tracking, and reward
          distribution, instilling trust among participants.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Token Rewards and Distribution: </Trans>
        </InlineLink>
        <Trans>
          Agents can define the token rewards for the lottery and specify how these rewards will be distributed among
          the winners.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Customizable Parameters: </Trans>
        </InlineLink>
        <Trans>
          Agents have the flexibility to set various parameters, including ticket prices, reward amounts, distribution
          rules, and more, to tailor the lottery to their preferences.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Trustless System: </Trans>
        </InlineLink>
        <Trans>
          The use of smart contracts removes the need for intermediaries, creating a trustless environment where
          outcomes are automatically executed based on predefined rules.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Accessibility and Inclusion: </Trans>
        </InlineLink>
        <Trans>
          Blockchain lotteries are accessible to a global audience, allowing participants from anywhere to engage in the
          lottery process.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Fairness and Randomness: </Trans>
        </InlineLink>
        <Trans>
          The transparency and cryptographic nature of blockchain technology ensure that lottery outcomes are random and
          cannot be manipulated.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Eliminating Fraud: </Trans>
        </InlineLink>
        <Trans>
          Blockchain's immutability prevents fraud, ensuring that the lottery's operations and results remain
          tamper-proof.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Direct Participation: </Trans>
        </InlineLink>
        <Trans>
          Players can participate directly by purchasing tickets using cryptocurrency, eliminating the need for
          third-party ticket vendors.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Instant Payouts: </Trans>
        </InlineLink>
        <Trans>
          Winners receive their rewards instantly through the automated execution of smart contracts, reducing delays
          and enhancing the user experience.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Engaging Gameplay: </Trans>
        </InlineLink>
        <Trans>
          Lottery contracts create an engaging and interactive experience for participants who eagerly anticipate the
          outcome and potential rewards.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Lower Costs: </Trans>
        </InlineLink>
        <Trans>
          Blockchain lotteries can potentially reduce operational costs compared to traditional lotteries, benefiting
          both organizers and participants.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, "Lottery Contracts" revolutionize the lottery industry by introducing decentralized, transparent,
        and secure mechanisms for setting up and participating in lotteries. These contracts provide agents with the
        tools to define rewards, parameters, and distribution rules while offering participants a more engaging and
        trustless lottery experience. This concept brings increased fairness, efficiency, and accessibility to the world
        of lotteries.
      </Trans>,
    ],
  },
]
export default config
