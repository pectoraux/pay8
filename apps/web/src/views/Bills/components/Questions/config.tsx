import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are Bill contracts ?</Trans>,
    description: [
      <Trans>
        The "Bill Contract" concept you've described adds an interesting layer of flexibility and automation to the
        realm of financial transactions, particularly when dealing with payments or deposits where the exact value is
        unknown in advance. This contract model could have numerous applications, including calculating taxes, managing
        bill payments, and processing bank account deposits. Here's an overview of the key aspects and benefits of the
        "Bill Contract":
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Flexible Payment Processing: </Trans>
        </InlineLink>
        <Trans>
          The "Bill Contract" is designed to handle transactions where the precise value is uncertain or variable. This
          flexibility is valuable for scenarios like taxes, where the exact amount owed might vary based on income or
          other factors.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Automation and Accuracy: </Trans>
        </InlineLink>
        <Trans>
          By utilizing smart contracts, the "Bill Contract" automates the calculation and processing of payments,
          ensuring accurate and transparent transactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Dynamic Value Calculation: </Trans>
        </InlineLink>
        <Trans>
          The contract can dynamically calculate the value of payments based on various parameters or external data
          sources. This is particularly useful for payments that fluctuate, such as utility bills or taxes.
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
          <Trans>Real-Time Adjustments: </Trans>
        </InlineLink>
        <Trans>
          The contract can adjust payment amounts in real-time, accommodating changes in circumstances and preventing
          under- or over-payment.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Secure and Transparent Transactions: </Trans>
        </InlineLink>
        <Trans>
          Blockchain's inherent security and transparency contribute to the reliability of the "Bill Contract."
          Participants can trust the accuracy of calculations and the integrity of transactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Consistency in Recordkeeping: </Trans>
        </InlineLink>
        <Trans>
          All transactions processed through the contract are recorded immutably on the blockchain, providing a
          consistent and reliable record of payment history.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Streamlined Processes: </Trans>
        </InlineLink>
        <Trans>
          Users can experience more streamlined and efficient payment processes, as the contract handles complex
          calculations and eliminates the need for manual adjustments.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Wide Range of Use Cases: </Trans>
        </InlineLink>
        <Trans>
          The "Bill Contract" is versatile and applicable to various scenarios, including calculating taxes, managing
          bill payments, processing deposits, and other financial interactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Customizable Parameters: </Trans>
        </InlineLink>
        <Trans>
          Contract parameters can be customized to suit different types of payments and individual requirements.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Integration with Existing Systems: </Trans>
        </InlineLink>
        <Trans>
          The contract can be integrated with existing financial systems, enhancing their capabilities and ensuring
          compatibility with established processes.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Reducing Error Risks: </Trans>
        </InlineLink>
        <Trans>
          Automation reduces the risks of human errors in calculations, leading to more accurate financial transactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Improved Financial Planning: </Trans>
        </InlineLink>
        <Trans>
          Users can benefit from better financial planning, knowing that payments are being accurately calculated and
          processed.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In conclusion, the "Bill Contract" concept showcases the potential of blockchain and smart contracts in
        revolutionizing the way we handle payments that involve variable or unknown values. By automating calculations,
        ensuring accuracy, and enhancing transparency, this model has the potential to significantly streamline
        financial transactions in various contexts.
      </Trans>,
    ],
  },
]
export default config
