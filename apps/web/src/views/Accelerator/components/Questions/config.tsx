import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What is the Accelerator model ?</Trans>,
    description: [
      <Trans>
        The Accelerator model, is a dynamic and innovative approach to funding businesses within the blockchain and
        cryptocurrency ecosystem. This model combines elements of decentralized governance, fundraising, and incentives
        for both businesses and investors. Here's a closer look at the key components:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Funding through Voting: </Trans>
        </InlineLink>
        <Trans>
          The Accelerator model uses a unique mechanism where investors don't directly purchase tokens from businesses
          but instead, vote for businesses they believe in. This voting mechanism allows investors to show support for
          projects they find promising or aligned with their investment strategy. To be able to vote, investors need to
          purchase a stake in{' '}
        </Trans>
        <InlineLink ml="4px" external href="/valuepools">
          <Trans>the valuepool </Trans>
        </InlineLink>
        <Trans> whose token the business is raising.</Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Token Minting and Distribution: </Trans>
        </InlineLink>
        <Trans>
          At regular weekly intervals, a specific number of tokens are minted. These tokens are then distributed among
          the businesses in the accelerator based on the number of votes they've received. This distribution method
          encourages active participation and provides a way for businesses to receive funding based on investor
          interest.
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
          <Trans>Decentralized Governance: </Trans>
        </InlineLink>
        <Trans>
          The accelerator model aligns with principles of decentralized governance. Investors collectively decide which
          businesses receive funding through their votes, and the token minting process is based on this distributed
          decision-making.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Transparency and Trust: </Trans>
        </InlineLink>
        <Trans>
          Transparency is a fundamental aspect of this model. Investors can see the distribution of tokens, the
          businesses that are funded, and the reasoning behind investor votes. This level of transparency builds trust
          within the ecosystem.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Fair Distribution: </Trans>
        </InlineLink>
        <Trans>
          By distributing tokens based on votes, the model aims to distribute funding more equitably among businesses
          based on their level of investor support.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Potential for Growth: </Trans>
        </InlineLink>
        <Trans>
          The Accelerator model provides businesses with a unique way to raise funds while also gaining visibility and
          support from investors. Investors, in turn, have a say in which businesses receive funding and can potentially
          benefit from the growth of successful projects.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        It's important to note that while this accelerator model offers innovative ways to fund and support businesses,
        it's still subject to risks and uncertainties. As with any investment or funding strategy, participants should
        exercise caution, conduct due diligence in businesses before giving them their votes.
      </Trans>,
      <br></br>,
      <Trans>
        Overall, the accelerator concept demonstrates the evolving and creative ways in which blockchain technology is
        reshaping traditional funding models and fostering new forms of collaboration between businesses and investors.
      </Trans>,
    ],
  },
]
export default config
