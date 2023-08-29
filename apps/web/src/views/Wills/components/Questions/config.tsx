import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are Will contracts ?</Trans>,
    description: [
      <Trans>
        The "Will Contracts" concept introduces a groundbreaking application of blockchain technology that goes beyond
        traditional wills, offering a secure and automated way to manage and distribute assets to heirs after a person's
        demise. This approach not only addresses the challenges of inheritance but also brings innovative solutions to
        cryptocurrency management and security. Here's an overview of the key features and benefits of "Will Contracts":
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Secure Asset Distribution: </Trans>
        </InlineLink>
        <Trans>
          "Will Contracts" provide a secure and automated process for distributing assets, both traditional and digital,
          to heirs according to the distribution percentages defined by the owner.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Automated Execution: </Trans>
        </InlineLink>
        <Trans>
          Upon the demise of the owner, the "Will Contract" automatically triggers the asset distribution process,
          adhering to the predetermined terms outlined in the contract.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Token Inclusion: </Trans>
        </InlineLink>
        <Trans>
          The concept extends beyond traditional assets to include tokens, both fungible and non-fungible. This bridges
          the gap between traditional inheritance and the digital realm.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Timelock Systems for Security: </Trans>
        </InlineLink>
        <Trans>
          The implementation of timelock systems adds an additional layer of security by preventing premature or
          unauthorized access to the assets.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Decentralized Ownership and Security: </Trans>
        </InlineLink>
        <Trans>
          The unique profile-based recovery process for "Will Contracts" addresses the issue of private key loss,
          offering a decentralized solution for asset management and recovery.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Elimination of Intermediaries: </Trans>
        </InlineLink>
        <Trans>
          By utilizing blockchain technology, "Will Contracts" reduce the need for intermediaries and streamline the
          inheritance process.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Privacy and Transparency: </Trans>
        </InlineLink>
        <Trans>
          Blockchain ensures that the distribution process remains transparent and tamper-proof, while user profiles
          contribute to privacy.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Simplified Cryptocurrency Management: </Trans>
        </InlineLink>
        <Trans>
          For cryptocurrency owners, the concept simplifies the management and distribution of digital assets to heirs,
          even in the absence of technical knowledge.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Reducing Inheritance Challenges: </Trans>
        </InlineLink>
        <Trans>
          The automation and predefined distribution percentages reduce the likelihood of disputes among heirs, making
          the inheritance process smoother.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Expanding Use Cases: </Trans>
        </InlineLink>
        <Trans>
          The concept can also function as a secure digital wallet with built-in recovery mechanisms, making it
          versatile for personal asset management beyond inheritance.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Digital Identity Integration: </Trans>
        </InlineLink>
        <Trans>
          The use of unique profiles can potentially integrate with digital identity solutions, enhancing security and
          enabling a seamless transition for heirs.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Financial Inclusion: </Trans>
        </InlineLink>
        <Trans>
          By addressing private key loss and complex inheritance processes, "Will Contracts" promote financial inclusion
          in the cryptocurrency space.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, "Will Contracts" revolutionize inheritance and asset distribution by leveraging blockchain
        technology, automation, and security mechanisms. This innovative application serves not only as a solution for
        asset distribution after demise but also as a secure wallet, addressing challenges related to private key
        management. By combining decentralized ownership with smart contract automation, this concept brings tangible
        benefits to the world of estate planning and digital asset management.
      </Trans>,
    ],
  },
]
export default config
