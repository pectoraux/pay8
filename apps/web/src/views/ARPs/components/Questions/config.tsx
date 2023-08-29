import Trans from 'components/Trans'
import styled from 'styled-components'
import { Link } from '@pancakeswap/uikit'

const InlineLink = styled(Link)`
  display: inline;
`

const config = [
  {
    title: <Trans>What are ARPs ?</Trans>,
    description: [
      <Trans>
        ARPs (Accounts Receivable Payable) contracts, as you've described them, offer a streamlined and innovative
        solution for managing scheduled payments and financial transactions on the blockchain. This system can have a
        wide range of applications, from payrolls to budgeting and more. Here's a breakdown of the key features and
        benefits of ARPs:
      </Trans>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Scheduled Payment Processing: </Trans>
        </InlineLink>
        <Trans>
          ARPs provide a structured and automated way to process scheduled payments to one or multiple users. This can
          be particularly valuable for managing payrolls, where employees receive regular payments at specified
          intervals.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Versatility in Use Cases: </Trans>
        </InlineLink>
        <Trans>
          ARPs can be used beyond payroll processing. They can serve various purposes such as budgeting, savings plans,
          subscription payments, and any scenario that involves recurring financial transactions.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Blockchain Efficiency and Transparency: </Trans>
        </InlineLink>
        <Trans>
          By deploying these contracts on the blockchain, ARPs benefit from the inherent efficiency and transparency of
          the technology. Transactions are recorded immutably and can be audited for transparency.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>NFT Note Concept: </Trans>
        </InlineLink>
        <Trans>
          The concept of converting future payments into NFT notes is an interesting approach. This can potentially
          enable users to access funds earlier by selling these notes to individuals who are willing to wait for the
          scheduled payment date to collect the amount.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Financial Flexibility: </Trans>
        </InlineLink>
        <Trans>
          Allowing users to trade NFT notes provides financial flexibility. It can be particularly useful for those who
          may need immediate funds before the scheduled payment date.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Value of Time and Waiting: </Trans>
        </InlineLink>
        <Trans>
          The ability to trade NFT notes adds value to the element of time. Users who need funds sooner might be willing
          to pay a premium to access their payments ahead of schedule.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Marketplace for NFT Notes: </Trans>
        </InlineLink>
        <Trans>
          The NFT notes can potentially create a marketplace where individuals can buy and sell these notes, based on
          their financial needs and preferences.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Enhanced Cash Flow Management: </Trans>
        </InlineLink>
        <Trans>
          For businesses or individuals, the option to access funds sooner can help with better cash flow management and
          meeting immediate financial needs.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Risk and Demand: </Trans>
        </InlineLink>
        <Trans>
          The value of NFT notes may vary based on risk assessment and demand. Individuals willing to wait longer might
          pay less for the note, while those in a hurry might pay more.
        </Trans>
      </>,
      <br></br>,
      <>
        <InlineLink ml="4px">
          <Trans>Innovation in Financial Instruments: </Trans>
        </InlineLink>
        <Trans>
          The use of blockchain, smart contracts, and NFTs to manage payments and create financial instruments is a
          prime example of the innovative potential of decentralized technologies.
        </Trans>
      </>,
      <br></br>,
      <Trans>
        In conclusion, ARPs, along with the concept of NFT notes, present a novel and forward-thinking approach to
        managing financial transactions, providing flexibility, and leveraging blockchain for enhanced transparency and
        efficiency. As the blockchain ecosystem continues to evolve, such innovative financial instruments have the
        potential to reshape traditional payment systems and financial management practices.
      </Trans>,
    ],
  },
]
export default config
