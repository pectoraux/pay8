import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are Pools ?</Trans>,
    description: [
      <Trans>
        The concept of "Pools" within an Automated Market Maker (AMM) ecosystem serves a crucial role in fairly
        distributing fees generated from users swapping tokens. These pools are designed to benefit Liquidity Providers
        (LP) who contribute assets to the pool's liquidity, ensuring a proportional share of the fees earned. Here's a
        breakdown of the key features and benefits of using "Pools" in an AMM system:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Fee Distribution: </Trans>
        </InlineLink>
        <Trans>
          Pools play a pivotal role in distributing the fees collected from token swaps among the LP providers who
          supply liquidity to the pool.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>LP Participation: </Trans>
        </InlineLink>
        <Trans>
          Liquidity Providers lock their tokens into the pool, creating a reserve of assets that enable users to easily
          trade tokens without causing significant price slippage.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Proportional Distribution: </Trans>
        </InlineLink>
        <Trans>
          The fees collected are distributed among LP providers in proportion to the amount of liquidity they contribute
          to the pool. Those with larger contributions receive a greater share of the fees.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Incentivizing Participation: </Trans>
        </InlineLink>
        <Trans>
          Pools incentivize LP providers to contribute assets to the liquidity pool, as they are rewarded with a share
          of the trading fees.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Passive Income for LPs: </Trans>
        </InlineLink>
        <Trans>
          By participating in pools, LPs earn passive income in the form of a portion of the fees generated from the
          platform's trading activities.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Fair Compensation: </Trans>
        </InlineLink>
        <Trans>
          The distribution model ensures that LPs are fairly compensated for their contribution to maintaining liquidity
          and enabling smooth token swapping.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Liquidity Provision: </Trans>
        </InlineLink>
        <Trans>
          Pools facilitate the liquidity provision process, which is essential for AMMs to function effectively and
          provide a seamless trading experience.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Dynamic Fees: </Trans>
        </InlineLink>
        <Trans>
          Depending on the AMM protocol, fees might be dynamic and can vary based on trading volume or other parameters,
          impacting the overall distribution to LPs.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Community Involvement: </Trans>
        </InlineLink>
        <Trans>
          Pools encourage community involvement, as users have the opportunity to become LPs and actively participate in
          the growth and success of the AMM platform.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Balanced Rewards: </Trans>
        </InlineLink>
        <Trans>
          The distribution mechanism ensures that LPs who contribute more liquidity are rewarded accordingly, aligning
          incentives with the level of involvement.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>AMM Sustainability: </Trans>
        </InlineLink>
        <Trans>
          By providing an incentive structure for liquidity provision, pools contribute to the long-term sustainability
          and growth of the AMM ecosystem.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Diversification Opportunities: </Trans>
        </InlineLink>
        <Trans>
          LPs can participate in multiple pools across different tokens, allowing for diversification of their asset
          holdings and potential revenue streams.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In conclusion, "Pools" are a fundamental component of an AMM system, providing a mechanism for fairly
        distributing fees to Liquidity Providers who contribute assets to maintain liquidity. This approach fosters
        community engagement, rewards active participation, and ensures the efficient functioning of the platform while
        providing passive income opportunities for LPs.
      </Trans>,
    ],
  },
]
export default config
