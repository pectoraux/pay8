import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are Decentralized Ramps (dRamps) ?</Trans>,
    description: [
      <Trans>
        Decentralized Ramps, or dRamps, are an innovative feature that enables users to transfer value to and out of
        blockchains seamlessly. They allow users to mint currencies on their preferred blockchain using their credit
        card, creating a bridge between traditional financial systems and the blockchain world.
      </Trans>,
    ],
  },
  {
    title: <Trans>How do Decentralized Ramps work ?</Trans>,
    description: [
      <Trans>
        dRamps operate through a network of independent agents worldwide. These agents deploy their own ramps,
        connecting payment processors like Stripe, and eventually PayPal and others, to facilitate the conversion of
        fiat currencies into their equivalent blockchain tokens. The agents collateralize their ramps to ensure the
        security and stability of the minted tokens.
      </Trans>,
    ],
  },
  {
    title: <Trans>What's the purpose of collateralization in Decentralized Ramps ?</Trans>,
    description: [
      <Trans>
        Collateralization serves as a security measure to ensure the value and stability of the minted tokens. Agents
        create bounties/collaterals in the native currency of the blockchain which they then attach to their ramps in
        order to collateralize it. This collateralization guarantees that minted tokens are backed by real-world value
        and mitigates risks associated with value fluctuations.
      </Trans>,
    ],
  },
  {
    title: <Trans>How do agents activate their ramps in the dRamps system ?</Trans>,
    description: [
      <Trans>
        Agents activate their ramps by attaching bounties/collaterals to their ramps . These collaterals are placed in
        the blockchain's native currency. This process allows the agents to enable their ramps to process 80% of the
        collaterals' value. By attaching a unique profile to their ramps, agents can increase this percentage to 100%.
      </Trans>,
    ],
  },
  {
    title: <Trans>How can users transfer value across different blockchains using dRamps ?</Trans>,
    description: [
      <Trans>
        To transfer value across blockchains, users initiate a process that involves transitioning value from the origin
        blockchain into fiat currency, and then from fiat into the destination blockchain. This trustless process
        ensures secure and seamless cross-blockchain value transfers.
      </Trans>,
    ],
  },
  {
    title: <Trans>What is the process of minting tokens using dRamps ?</Trans>,
    description: [
      <Trans>
        Minting tokens involves users selecting a ramp that processes the desired currency. Users then go through the
        minting process by sending an equivalent amount of fiat currency to the ramp's payment processor account. In
        return, they receive tokens representing the equivalent value on the blockchain.
      </Trans>,
    ],
  },
  {
    title: <Trans>How can users transfer value out of a blockchain using dRamps ?</Trans>,
    description: [
      <Trans>
        To transfer value out of a blockchain, users initiate the burning process. They link their payment processor
        account to the ramp, then burn the blockchain tokens. This process prompts the ramp to send an equivalent value
        in fiat currency to the user's payment processor account.
      </Trans>,
    ],
  },
  {
    title: <Trans>What are trustless manual onramps and offramps ?</Trans>,
    description: [
      <Trans>
        Trustless manual onramps and offramps involve agents manually operating their payment processors to transfer
        value on behalf of their users outside of the blockchain realm. This option is valid for any wallet the agent
        supports from mobile money wallets to cash.
      </Trans>,
    ],
  },
  {
    title: <Trans>How much does it cost to mint/burn an on/offramp token ?</Trans>,
    description: [
      <Trans>
        The operation fees associated with a ramp in the Decentralized Ramps (dRamps) system are composed of two main
        components: PaySwap's 1% fee and the fee charged by the ramp's payment processor. Let's break down these fees:.
      </Trans>,
      <>
        <InlineLink ml="4px">
          <Trans>PaySwap's 1% Fee: </Trans>
        </InlineLink>
        <Trans>
          PaySwap imposes a 1% fee on any minting or burning operations facilitated through the dRamps system. This fee
          is a standard charge for the services provided by PaySwap in connecting users with the independent agents'
          ramps and enabling seamless value transfer between different blockchains.
        </Trans>
      </>,
      <>
        <InlineLink ml="4px">
          <Trans>Ramp's Payment Processor Fee: </Trans>
        </InlineLink>
        <Trans>
          In addition to PaySwap's fee, the ramp's payment processor charges a fee for processing transactions involving
          fiat currency. This fee varies depending on the payment processor chosen (e.g., Stripe, PayPal).
        </Trans>
      </>,
    ],
  },
  {
    title: <Trans>Are dRamps a Ponzi scheme ?</Trans>,
    description: [
      <Trans>
        No, Decentralized Ramps (dRamps) are not a Ponzi scheme. A Ponzi scheme is a fraudulent investment scheme that
        promises high returns to early investors using the capital of new investors, rather than generating legitimate
        profits. dRamps, on the other hand, are a technical feature within the blockchain ecosystem that facilitates the
        transfer of value between different blockchains and the traditional financial system.
      </Trans>,
    ],
  },
  {
    title: <Trans>What happens if a ramp steals from me ?</Trans>,
    description: [
      <>
        <Trans>
          The security and accountability measures built into the Decentralized Ramps (dRamps) system help protect users
          against potential fraudulent activity. If an agent is found to have stolen funds, users have the ability to
          take action and potentially reclaim their stolen funds using the bounty/collateral mechanism. Here's how the
          process would generally work: The user claims the bounty of the ramp by submitting a proposal through
        </Trans>
        <InlineLink ml="4px" external href="/trustbounties/voter">
          <Trans>the trustbounties' voter </Trans>
        </InlineLink>
        <Trans>
          to the bounties' community. Each member of the trustbounties community can then review the proposal and vote
          on whether the ramp is guilty or not. The admin of ramp can also add his/her peice to the proposal. The voting
          process takes 7 days and if the ramp is found guilty, the user gets refunded the stolen funds otherwise,
          nothing happens.
        </Trans>
        ,
      </>,
    ],
  },
  {
    title: <Trans>What problem are dRamps solving?</Trans>,
    description: [
      <Trans>
        Decentralized Ramps (dRamps) are designed to address several key challenges and problems within the realm of
        blockchain and cryptocurrency transactions:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Interoperability between Blockchains: </Trans>
        </InlineLink>
        <Trans>
          Different blockchains often operate in isolation, making it difficult for users to transfer value seamlessly
          across various platforms. dRamps solve this problem by providing a mechanism to bridge the gap between
          different blockchains, enabling users to transfer value from one blockchain to another.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Limited Fiat Integration: </Trans>
        </InlineLink>
        <Trans>
          Many blockchain ecosystems lack direct integration with fiat currencies, which are essential for real-world
          transactions. dRamps solve this issue by facilitating the conversion of fiat currency into blockchain tokens
          and vice versa, making cryptocurrencies more accessible and usable in everyday transactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Overcoming Technical Barriers: </Trans>
        </InlineLink>
        <Trans>
          Transacting on different blockchains can be complex, requiring users to navigate technical processes. dRamps
          simplify this process by creating a user-friendly interface that allows users to mint, burn, and transfer
          tokens without the need for extensive technical knowledge.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Volatility and Stability: </Trans>
        </InlineLink>
        <Trans>
          Cryptocurrencies are known for their price volatility, which can be a concern for users. dRamps address this
          by implementing overcollateralization, ensuring that minted tokens are always backed by real-world collateral,
          providing a level of stability and security.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Liquidity and Accessibility: </Trans>
        </InlineLink>
        <Trans>
          Some cryptocurrencies might have limited liquidity, making it challenging to convert them into other assets or
          fiat. dRamps enhance liquidity by enabling users to mint and burn tokens as needed, providing a reliable
          method to access and utilize their assets.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Manual Transactions: </Trans>
        </InlineLink>
        <Trans>
          While blockchain transactions are typically automated, there are situations where manual transactions are
          necessary, such as interacting with offline systems or alternative payment methods. dRamps enable trustless
          manual onramps and offramps, ensuring secure value transfers even in scenarios that require human
          intervention.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Cross-Border Transactions: </Trans>
        </InlineLink>
        <Trans>
          Traditional cross-border transactions can be costly and time-consuming. dRamps offer a more efficient solution
          by facilitating value transfers across different blockchains, regardless of geographic boundaries.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In essence, dRamps are solving the challenge of interoperability, accessibility, stability, and usability within
        the blockchain ecosystem. They provide a bridge between the blockchain and traditional financial systems, making
        it easier for users to interact with cryptocurrencies and utilize their value in various ways.
      </Trans>,
    ],
  },
]
export default config
