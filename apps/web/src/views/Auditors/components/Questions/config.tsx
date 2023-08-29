import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are Auditor contracts ?</Trans>,
    description: [
      <Trans>
        The concept of "Auditor Contracts" presents a unique and decentralized approach to verifying ownership and
        authenticity through the use of blockchain technology and smart contracts. By allowing users to apply for audits
        and obtain badges that certify various aspects of ownership, character, and more, this system introduces a new
        level of trust and transparency to various domains. Here's an overview of the key features and benefits of the
        "Auditor Contracts":
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Verification and Certification: </Trans>
        </InlineLink>
        <Trans>
          "Auditor Contracts" offer a means to verify and certify a wide range of attributes, including ownership of
          items, personal characteristics, addresses, and more.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Badges for Trust and Verification: </Trans>
        </InlineLink>
        <Trans>
          Badges serve as certifications that attest to the effective ownership or other qualities of the item or
          individual in question. These badges provide a trustable record on the blockchain.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Customizable Badges: </Trans>
        </InlineLink>
        <Trans>
          The system's versatility allows for a diverse range of badges that cater to different industries and
          verification needs.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>User Voting and Reputation: </Trans>
        </InlineLink>
        <Trans>
          Users have the ability to vote for auditors they trust, contributing to the auditor's reputation and status
          level. This creates a self-regulating system where reputable auditors gain more influence.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Graduated Status Levels: </Trans>
        </InlineLink>
        <Trans>
          The status levels (black, brown, silver, gold) provide a hierarchy of trustworthiness based on the auditor's
          history and the community's endorsement.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Weight and Value of Badges: </Trans>
        </InlineLink>
        <Trans>
          Higher status auditors have badges that carry more weight and influence due to their proven track record and
          reputation.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Enhanced Audit Request Process: </Trans>
        </InlineLink>
        <Trans>
          Users can request audits based on their needs and interests, further customizing the verification process.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Auditing Bounties and Authenticity: </Trans>
        </InlineLink>
        <Trans>
          The use of bounties ensures that auditors are incentivized to provide authentic and accurate verifications.
          Fraudulent audits could lead to the claim of these bounties.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Decentralization and Transparency: </Trans>
        </InlineLink>
        <Trans>
          Blockchain technology guarantees the transparency and immutability of verification records, enhancing the
          trustworthiness of the system.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Comprehensive Trust Ecosystem: </Trans>
        </InlineLink>
        <Trans>
          The system fosters a comprehensive ecosystem where individuals and businesses can establish trust through
          verified and certified badges.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Wide Range of Applications: </Trans>
        </InlineLink>
        <Trans>
          The concept can be applied to various industries such as real estate, online marketplaces, hiring processes,
          and more.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Potential for Fraud Prevention: </Trans>
        </InlineLink>
        <Trans>
          By providing an incentive for accurate audits and offering mechanisms for claim in case of fraud, the system
          discourages dishonest behavior.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, "Auditor Contracts" introduce a paradigm shift in verification and certification by leveraging
        blockchain technology and decentralized consensus. The reputation-based status levels, voting mechanisms, and
        auditing bounties create a system of trust that has the potential to revolutionize how we verify ownership and
        qualities in various domains.
      </Trans>,
    ],
  },
]
export default config
