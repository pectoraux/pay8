import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are Profiles ?</Trans>,
    description: [
      <Trans>
        The "Profile System" introduces an innovative approach to social networking and identity management, leveraging
        blockchain technology to create a decentralized social graph. This concept aims to provide users with greater
        control over their social connections and interactions across various platforms. Here's a breakdown of the key
        features and benefits of the "Profile System":
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Decentralized Social Graph: </Trans>
        </InlineLink>
        <Trans>
          The Profile System utilizes blockchain to establish a decentralized social graph, allowing users to maintain
          their connections and interactions across platforms.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Seamless Profile Migration: </Trans>
        </InlineLink>
        <Trans>
          The system's API enables users to seamlessly move their followers and connections from one social media
          platform to another, eliminating the need to rebuild their network from scratch.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Cross-Platform Following: </Trans>
        </InlineLink>
        <Trans>
          Users can follow each other's profiles across different platforms, ensuring continuity of relationships and
          interactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Access to Social Connections: </Trans>
        </InlineLink>
        <Trans>
          By providing access to emails from profiles following a user, platforms can enable seamless integration of
          existing social graphs for new users.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Enhanced User Experience: </Trans>
        </InlineLink>
        <Trans>
          Users can easily migrate and engage with their connections, improving their experience on new platforms
          without starting from zero.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Address-Free Transactions: </Trans>
        </InlineLink>
        <Trans>
          The use of profile IDs for transactions simplifies the process of sending money or value to other users,
          eliminating the need to remember complex blockchain addresses.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Improved Data Privacy: </Trans>
        </InlineLink>
        <Trans>
          Blockchain's transparency and encryption ensure that users maintain control over their data and interactions,
          enhancing privacy and security.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Efficient Social Interactions: </Trans>
        </InlineLink>
        <Trans>
          Profiles are connected directly to users' social graph, streamlining interactions and making it easier to
          engage with friends, followers, and connections.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>User-Centric Approach: </Trans>
        </InlineLink>
        <Trans>
          The Profile System prioritizes user needs and preferences, enabling them to manage their connections and
          interactions across platforms in a way that aligns with their preferences.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Open APIs for Innovation: </Trans>
        </InlineLink>
        <Trans>
          The API provided by the Profile System encourages innovation by allowing platforms to integrate this
          functionality into their services and build upon it.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Reducing Platform Lock-In: </Trans>
        </InlineLink>
        <Trans>
          The ability to move social connections between platforms reduces vendor lock-in, granting users more freedom
          and choice.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Social Currency Simplification: </Trans>
        </InlineLink>
        <Trans>
          Using profile IDs for transactions simplifies the process of exchanging value between users, fostering
          adoption of blockchain-based interactions.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, the "Profile System" disrupts traditional social networking by offering a decentralized social graph
        that facilitates seamless profile migration, cross-platform interactions, and simplified transactions. This
        concept empowers users to maintain their social connections across platforms and interact more efficiently, all
        while enhancing data privacy and control.
      </Trans>,
    ],
  },
  {
    title: <Trans>What is the SSI sytem ?</Trans>,
    description: [
      <Trans>
        The "Self Sovereign Identity" (SSI) system introduces a revolutionary approach to identity management and data
        sharing by leveraging blockchain technology. This decentralized system empowers users to have control over their
        personal data and identity, allowing them to securely manage and share their information while maintaining
        ownership and privacy. Here's a breakdown of the key features and benefits of the "SSI System":
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>User-Centric Identity Management: </Trans>
        </InlineLink>
        <Trans>
          The SSI system places users at the center of their identity management, enabling them to control their data
          and decide when and how to share it.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Decentralized and Encrypted Data: </Trans>
        </InlineLink>
        <Trans>
          User data is registered on the blockchain in an encrypted format by auditors. This decentralized approach
          enhances security and prevents unauthorized access.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Ownership and Access Control: </Trans>
        </InlineLink>
        <Trans>
          Users exclusively own their registered data and have complete control over who can access it and for how long.
          This strengthens privacy and data control.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Time-Limited Data Sharing: </Trans>
        </InlineLink>
        <Trans>
          Users can share specific data with authorized parties for a predefined period, enhancing control over the
          dissemination of sensitive information.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Medical Records and Identity Management: </Trans>
        </InlineLink>
        <Trans>
          The SSI system allows users to store and share medical records, identity information, and other personal data
          securely and efficiently.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Privacy-Preserving Proofs: </Trans>
        </InlineLink>
        <Trans>
          Users can provide proofs about their data attributes without revealing the actual data. This ensures privacy
          while validating specific characteristics.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Trusted and Verifiable Data: </Trans>
        </InlineLink>
        <Trans>
          Auditors register data in a tamper-proof manner on the blockchain, establishing trust and enabling data
          verification by authorized parties.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Data Portability and Interoperability: </Trans>
        </InlineLink>
        <Trans>
          Users can easily move their data between platforms and services, promoting data portability and avoiding
          vendor lock-in.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Empowering User Consent: </Trans>
        </InlineLink>
        <Trans>
          The SSI system enforces user consent and control over data sharing, reducing the risk of unauthorized or
          unethical data usage.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Enhancing Trust and Reliability: </Trans>
        </InlineLink>
        <Trans>
          By enabling users to share verified and accurate data, the SSI system fosters trust between individuals and
          institutions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Prevention of Identity Theft: </Trans>
        </InlineLink>
        <Trans>
          The decentralized and encrypted nature of the system reduces the risk of identity theft and unauthorized data
          access.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Empowering User Rights: </Trans>
        </InlineLink>
        <Trans>
          The SSI system aligns with principles of data sovereignty and user rights, granting individuals greater agency
          over their digital identities.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, the "Self Sovereign Identity" (SSI) system transforms identity management by providing users with
        control, privacy, and security over their personal data. By enabling encrypted data registration, time-limited
        sharing, and privacy-preserving proofs, the SSI system empowers individuals to manage their identity information
        in a secure, efficient, and user-centric manner.
      </Trans>,
    ],
  },
]
export default config
