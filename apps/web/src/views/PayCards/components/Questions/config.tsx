import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are PayCards ?</Trans>,
    description: [
      <Trans>
        The concept of PayCards introduces a user-friendly and convenient approach to making payments within the
        cryptocurrency ecosystem. Similar to traditional debit cards, PayCards offer a streamlined and accessible way
        for users to initiate transactions without the need to connect their wallets each time. Here's an overview of
        the key features and benefits of PayCards:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Seamless Transactions: </Trans>
        </InlineLink>
        <Trans>
          PayCards enable users to make transactions without the hassle of manually connecting their wallets for every
          purchase. This streamlines the payment process and enhances the user experience.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Wallet Integration: </Trans>
        </InlineLink>
        <Trans>
          Users can link their cryptocurrency wallets to their PayCards, allowing for seamless integration between the
          PayCard and their digital assets.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Accessibility and Convenience: </Trans>
        </InlineLink>
        <Trans>
          The convenience of using a PayCard is comparable to traditional credit cards, making cryptocurrency payments
          accessible to a wider audience.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Shop Transactions: </Trans>
        </InlineLink>
        <Trans>
          PayCards can be used at various shops, online platforms, and merchant locations that accept cryptocurrency
          payments, making them versatile for a range of purchasing scenarios.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Password Protection: </Trans>
        </InlineLink>
        <Trans>
          The requirement to enter a password adds an extra layer of security, preventing unauthorized access and
          ensuring that only the rightful owner can initiate transactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>User-Friendly Interface: </Trans>
        </InlineLink>
        <Trans>
          The user interface for managing PayCards can be designed for ease of use, making it simple for individuals,
          even those unfamiliar with cryptocurrency, to initiate payments.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Reducing Complexity: </Trans>
        </InlineLink>
        <Trans>
          By eliminating the need for users to manage complex wallet connections and addresses, PayCards simplify the
          cryptocurrency payment process.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Enhancing Adoption: </Trans>
        </InlineLink>
        <Trans>
          The familiarity of the credit card-like experience can encourage more individuals to adopt cryptocurrency for
          daily transactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Minimizing Errors: </Trans>
        </InlineLink>
        <Trans>
          With PayCards, the potential for errors in entering wallet addresses is significantly reduced, contributing to
          smoother transactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Integrating Payment Ecosystems: </Trans>
        </InlineLink>
        <Trans>
          PayCards can potentially integrate with existing payment gateways and systems, facilitating acceptance by
          merchants and businesses.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Cross-Platform Usage: </Trans>
        </InlineLink>
        <Trans>
          PayCards can be designed to work seamlessly across different platforms, including online and physical
          transactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Transitioning to Mainstream Use: </Trans>
        </InlineLink>
        <Trans>
          The concept of PayCards bridges the gap between cryptocurrency and traditional financial systems, making
          cryptocurrency payments more familiar and accepted.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In summary, "PayCards" offer a promising solution to streamline cryptocurrency payments and bridge the gap
        between the digital asset world and traditional payment methods. By combining the convenience of credit
        card-like transactions with the security of password protection, this concept has the potential to encourage
        broader adoption of cryptocurrency for everyday purchases.
      </Trans>,
    ],
  },
]
export default config
