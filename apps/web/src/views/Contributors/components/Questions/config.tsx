import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What is the Contributors reward program ?</Trans>,
    description: [
      <Trans>
        The contributors reward program leverages various mechanisms to incentivize third-party contributors to provide
        valuable assistance to businesses within the CanCan and eCollectible marketplaces. This program rewards those
        who aid businesses by offering customer support, developing tools, or contributing to their better operations.
        Here's an overview of how this program works:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans> Incentivizing Contributors: </Trans>
        </InlineLink>
        <Trans>
          The contributors reward program is designed to encourage third-party contributors, such as customer support
          representatives or tool developers, to actively engage and support businesses. This helps foster a
          collaborative environment that benefits all participants.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Weekly Token Rewards: </Trans>
        </InlineLink>
        <Trans>
          A significant aspect of the program is the weekly minting of tokens by the platform. These tokens are then
          distributed among contributors based on the number of votes they accumulate during that week. This
          distribution model inherently rewards contributors that are actively engaging and helping businesses achieve
          sales milestones.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Earned Votes and Token Share: </Trans>
        </InlineLink>
        <Trans>
          Contributors earn votes and a share of tokens based on the level of assistance they provide to businesses. The
          more a contributor helps a business, the more votes that contributor receives from the business. These votes
          are translated into a token share, allowing contributors to participate in the ecosystem's growth.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Tailored Support and Tools: </Trans>
        </InlineLink>
        <Trans>
          Contributors can aid businesses in various ways, including offering customer support to resolve queries and
          issues, as well as developing tools that enhance the operations of businesses within the marketplaces. These
          tools could streamline processes, improve efficiency, and contribute to overall business success.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Teamwork and Collaboration: </Trans>
        </InlineLink>
        <Trans>
          Contributors have the flexibility to work individually or as part of teams. This fosters a collaborative
          environment where contributors can combine their skills and expertise to provide comprehensive support or
          develop sophisticated tools for businesses.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Importance of Engagement: </Trans>
        </InlineLink>
        <Trans>
          The program encourages contributors to actively engage with businesses, aligning their efforts with the
          specific needs and goals of each business they assist. This engagement ensures that contributors provide
          meaningful support and valuable solutions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Token Economy and Incentives: </Trans>
        </InlineLink>
        <Trans>
          By rewarding contributors with tokens, the program introduces an incentive for individuals and teams to
          actively contribute to the growth and success of businesses. This token-based approach ties rewards directly
          to the impact of the support and tools provided.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Mutual Benefit: </Trans>
        </InlineLink>
        <Trans>
          The contributors reward program creates a mutually beneficial ecosystem where contributors are rewarded for
          their assistance, and businesses benefit from enhanced customer support and improved operational tools.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Flexibility and Scalability: </Trans>
        </InlineLink>
        <Trans>
          The program's adaptability to individual businesses' needs and the ability to work in teams ensure that it can
          be scaled and customized according to the evolving requirements of the marketplace.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, the contributors reward program adds another layer of collaboration and value creation within the
        marketplace ecosystem. By incentivizing third-party contributors to assist businesses, the program strengthens
        overall operations, encourages engagement, and contributes to the success of the marketplaces as a whole.
      </Trans>,
    ],
  },
]
export default config
